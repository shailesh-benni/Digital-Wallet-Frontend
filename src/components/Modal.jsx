import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // don't render if closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-slate-900 p-6 rounded-xl shadow-lg w-80">
        {title && <h2 className="text-lg font-semibold text-indigo-400 mb-4">{title}</h2>}
        <div>{children}</div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
