import React from "react";
import type { ReactNode } from "react";

interface PopupProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 animate-popup">
        
        {/* TITLE + CLOSE */}
        <div className="relative mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
            {title}
        </h2>

        <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-400 hover:text-[#B3261E] text-2xl transition"
        >
            ✕
        </button>
        </div>

        {/* CONTENT */}
        {children}
      </div>
    </div>
  );
};

export default Popup;
