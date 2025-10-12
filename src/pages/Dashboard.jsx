import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import GradientButton from "../components/GradientButton";
import Modal from "../components/Modal";

export default function Dashboard() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    balance: 0,
    transactions: [],
  });
    const navigate = useNavigate();

    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
const [topUpAmount, setTopUpAmount] = useState("");


  const token = localStorage.getItem("token");
  const [allUsers, setAllUsers] = useState([]);
const [recipientId, setRecipientId] = useState("");
const [amount, setAmount] = useState("");

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  if (token) fetchUsers();
}, [token]);

const handleSendMoney = async (e) => {
  e.preventDefault();
  if (!recipientId || !amount) return alert("Select recipient and enter amount");

  try {
    const response = await axios.post(
      "http://localhost:8080/api/users/transfer",
      { receiverId: recipientId, amount: parseFloat(amount) },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(response.data.message);
    // Optionally, refresh user data
    const updatedUser = await axios.get("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(updatedUser.data);
    setAmount("");
    setRecipientId("");
  } catch (err) {
    alert(err.response?.data || "Transfer failed");
  }
};


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col gap-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-400">
          Welcome, {user.name} 👋
        </h1>
        {/* <GradientButton/> */}
<Modal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} title="Top Up Wallet">
  <input
    type="number"
    value={topUpAmount}
    onChange={(e) => setTopUpAmount(e.target.value)}
    placeholder="Enter Amount"
    className="w-full bg-slate-800 p-2 rounded-lg mb-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
  <button
    onClick={async () => {
      if (!topUpAmount || topUpAmount <= 0) return alert("Enter a valid amount");
      try {
        const response = await axios.post(
          "http://localhost:8080/api/users/me/load",
          { amount: parseFloat(topUpAmount) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(response.data.message);
        setUser(prev => ({ ...prev, balance: response.data.balance })); // update balance
        setTopUpAmount("");
        setIsTopUpOpen(false);
      } catch (err) {
        alert(err.response?.data || "Top up failed");
      }
    }}
    className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white w-full"
  >
    Load
  </button>
</Modal>

<button
  onClick={() => setIsTopUpOpen(true)}
  className="bg-indigo-500 cursor-pointer hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium transition-all"
>
  TopUp
</button>


        <button
          onClick={handleLogout}
          className="bg-indigo-500 cursor-pointer hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium transition-all"
        >
          Logout
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800 hover:border-indigo-500 transition-all">
          <h2 className="text-slate-400 text-sm">Account Balance</h2>
          <p className="text-3xl font-semibold mt-2">₹{user.balance}</p>
          <span className="text-emerald-400 text-sm font-medium">
            + ₹0 this month
          </span>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800 hover:border-indigo-500 transition-all">
          <h2 className="text-slate-400 text-sm">Total Transactions</h2>
          <p className="text-3xl font-semibold mt-2">{user.transactions.length}</p>
          <span className="text-indigo-400 text-sm font-medium">
            0 new this week
          </span>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800 hover:border-indigo-500 transition-all">
          <h2 className="text-slate-400 text-sm">Monthly Spend</h2>
          <p className="text-3xl font-semibold mt-2">
            ₹
            {user.transactions
              .filter((t) => t.amount < 0)
              .reduce((acc, t) => acc + Math.abs(t.amount), 0)}
          </p>
          <span className="text-rose-400 text-sm font-medium">
            -0% from last month
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-indigo-400">
              Recent Transactions
            </h3>
            <button className="text-sm text-indigo-400 hover:underline">
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {user.transactions.slice(0, 5).map((tx, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 hover:bg-slate-800/50 rounded-lg px-2 transition"
              >
                <div>
                  <p className="font-medium">{tx.description || tx.type}</p>
                  <span className="text-slate-500 text-xs">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "—"}</span>
                </div>
                <p className={`font-semibold ${tx.amount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {tx.amount >= 0 ? "+" : "-"}₹{Math.abs(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-4">Send Money</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSendMoney}>
  <select
    value={recipientId}
    onChange={(e) => setRecipientId(e.target.value)}
    className="bg-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="">Select Recipient</option>
    {allUsers.map((u) => (
      <option key={u.id} value={u.id}>
        {u.name}
      </option>
    ))}
  </select>

  <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    placeholder="Amount (₹)"
    className="bg-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />

  <button
    type="submit"
    className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-sm font-medium py-2 rounded-lg transition-all"
  >
    Send Now
  </button>
</form>

        </div>
      </section>

  
      <footer className="text-center text-slate-500 text-sm mt-8">
        © 2025 Shailu’s Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
