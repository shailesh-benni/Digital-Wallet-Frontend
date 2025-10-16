import React, { useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { toast } from "react-toastify";

const TopUpModal = ({ isOpen, onClose, token, setUser }) => {
  const [topUpAmount, setTopUpAmount] = useState("");

  const handleTopUp = async () => {
    if (!topUpAmount || topUpAmount <= 0) return toast.error("Enter a valid amount");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/me/load",
        { amount: parseFloat(topUpAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      setUser(prev => ({ ...prev, balance: response.data.balance }));
      setTopUpAmount("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data || "Top up failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Wallet">
      <input
        type="number"
        value={topUpAmount}
        onChange={(e) => setTopUpAmount(e.target.value)}
        placeholder="Enter Amount"
        className="w-full bg-slate-800 p-2 rounded-lg mb-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleTopUp}
        className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white w-full"
      >
        Load
      </button>
    </Modal>
  );
};

export default TopUpModal;
