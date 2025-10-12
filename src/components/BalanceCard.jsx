// components/BalanceCard.jsx
import React from "react";

const BalanceCard = ({ title, value, subValue, color = "text-white" }) => (
  <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800 hover:border-indigo-500 transition-all">
    <h2 className="text-slate-400 text-sm">{title}</h2>
    <p className={`text-3xl font-semibold mt-2 ${color}`}>{value}</p>
    {subValue && <span className="text-sm font-medium text-gray-400">{subValue}</span>}
  </div>
);

export default BalanceCard;
