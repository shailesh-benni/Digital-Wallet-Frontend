import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BalanceCard from "../components/BalanceCard";
import TransactionList from "../components/TransactionList";
import SendMoneyForm from "../components/SendMoneyForm";
import TopUpModal from "../components/TopUpModal";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";


export default function Dashboard() {
  const [user, setUser] = useState({ name: "", email: "", balance: 0, transactions: [] });
  const [allUsers, setAllUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/all", { headers: { Authorization: `Bearer ${token}` } });
        setAllUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [token]);

  const boomConfetti = (x = 0.5, y = 0.6) => {
  const duration = 1 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 60,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
    colors: ["#6366f1", "#a855f7", "#10b981", "#facc15"],
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 200 * (timeLeft / duration);

    // Two bursts from opposite sides 💥
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(x - 0.2, x - 0.1), y },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(x + 0.1, x + 0.2), y },
    });
  }, 200);
};


  const handleSendMoney = async (e) => {
    e.preventDefault();
    if (!recipientId || !amount) return alert("Select recipient and enter amount");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/transfer",
        { receiverId: recipientId, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      boomConfetti();
      const updatedUser = await axios.get("http://localhost:8080/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
      setUser(updatedUser.data);
      setAmount("");
      setRecipientId("");
    } catch (err) {
      toast.error(err.response?.data || "Transfer failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col gap-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-400">Welcome, {user.name} 👋</h1>
        <div className="flex gap-2">
          <button onClick={() => setIsTopUpOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium">TopUp</button>
          <button onClick={handleLogout} className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium">Logout</button>
        </div>
      </header>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} token={token} setUser={setUser} />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard title="Account Balance" value={`₹${user.balance}`} subValue="+ ₹0 this month" color="text-emerald-400" />
        <BalanceCard title="Total Transactions" value={user.name.length} subValue="0 new this week" />
        <BalanceCard
          title="Monthly Spend"
          // value={`₹${user.transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0)}`}
          value={`₹${60}`}
          
          subValue="-0% from last month"
          color="text-rose-400"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-indigo-400">Recent Transactions</h3>
            <button className="text-sm text-indigo-400 hover:underline">View All</button>
          </div>
          <TransactionList transactions={user.transactions} />
        </div>

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-4">Send Money</h3>
          <SendMoneyForm
            allUsers={allUsers}
            recipientId={recipientId}
            setRecipientId={setRecipientId}
            amount={amount}
            setAmount={setAmount}
            handleSendMoney={handleSendMoney}
          />
        </div>
      </section>

      <footer className="text-center text-slate-500 text-sm mt-8">
        © 2025 Shailu’s Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
