// components/SendMoneyForm.jsx
import React from "react";

const SendMoneyForm = ({ allUsers, recipientId, setRecipientId, amount, setAmount, handleSendMoney }) => (
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
);

export default SendMoneyForm;
