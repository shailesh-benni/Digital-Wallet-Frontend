import React from "react";

export default function TransactionModal({ isOpen, onClose, transactions }) {
  if (!isOpen) return null;

  transactions.map((t, index) => {
    console.log(t.relatedUser?.name || "Self"); // optional chaining + fallback
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white w-full max-w-3xl rounded-xl p-6 shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
          <h2 className="text-xl font-semibold text-indigo-400">
            All Transactions
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-400 text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Transaction list */}
        {transactions.length === 0 ? (
          <p className="text-center text-slate-500 py-4">
            No transactions yet.
          </p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
            <table className="w-full text-sm">
              <thead className="text-indigo-400 border-b border-slate-700">
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Receiver</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-800/60 transition"
                  >
                    <td className="py-2">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-2 capitalize">
                      {t.amount < 0 ? (
                        <span className="text-rose-400">Sent</span>
                      ) : (
                        <span className="text-emerald-400">Received</span>
                      )}
                    </td>
                    <td className="py-2">{`₹${Math.abs(t.amount)}`}</td>
                    <td className="py-2">
                      {t.type === "SELF_CREDITED"
                        ? "Credited by your bank"
                        : t.amount < 0
                        ? `Paid to ${t.relatedUser?.name || "N/A"}`
                        : `Received from ${t.relatedUser?.name || "N/A"}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
