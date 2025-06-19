"use client";
import React from "react";
import { X, Send } from "lucide-react";
import Image from "next/image";

interface ModalProps {
  onClose: () => void;
  onLoginRedirect: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, onLoginRedirect }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-fadeIn">
      <div className="bg-[#0c1821] text-white p-12 rounded-lg shadow-[0_0_2px_#fff] relative w-md text-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold cursor-pointer"
        >
          <X size={24} />
        </button>
        <Image
          src="/images/rocket.png"
          alt="Rocket"
          width={120}
          height={150}
          loading="lazy"
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 h-[150px] !w-auto"
        />
        <div className="flex flex-col items-center justify-center">
          <h3 className="mt-16 mb-5 text-lg">
            Sign in to start posting your stunning creations and showcase your
            imagination to the world!
          </h3>
          <button
            onClick={onLoginRedirect}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-transparent text-lg border border-white rounded-lg mt-2 hover:bg-white/20 transition"
          >
            <Send size={20} />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
