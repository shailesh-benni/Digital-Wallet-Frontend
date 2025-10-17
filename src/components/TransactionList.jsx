import React from "react";

const TransactionList = ({ transactions = [] }) => (
  <div className="divide-y divide-slate-800">
    {transactions.slice(0, 5).map((tx, i) => (
      <div
        key={i}
        className="flex justify-between items-center py-3 hover:bg-slate-800/50 rounded-lg px-2 transition"
      >
        <div>
          <p className="font-medium">{tx.type === "SELF_CREDITED"
                        ? "Credited by your bank"
                        : tx.amount < 0
                        ? `Paid to ${tx.relatedUser?.name || "N/A"}`
                        : `Received from ${tx.relatedUser?.name || "N/A"}`}</p>
          <span className="text-slate-500 text-xs">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "—"}</span>
        </div>
        <p className={`font-semibold ${tx.amount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {tx.amount >= 0 ? "+" : "-"}₹{Math.abs(tx.amount)}
        </p>
      </div>
    ))}
  </div>
);

export default TransactionList;
