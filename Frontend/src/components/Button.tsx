import React from "react";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary"; // màu đỏ / trắng viền đỏ
  type?: "button" | "submit" | "reset"; // <-- thêm dòng này
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  type = "button", // default type
}) => {
  const baseClasses =
    "min-w-[110px] px-6 py-3 font-semibold rounded-xl shadow-md transition duration-300 ease-in-out transform active:scale-95 focus:outline-none";

  const variants = {
    primary:
      "bg-[#B3261E] text-white hover:bg-[#8c1f19] hover:scale-105 hover:shadow-xl",
    secondary:
      "border border-[#B3261E] text-[#B3261E] hover:bg-[#B3261E] hover:text-white hover:scale-105 hover:shadow-xl",
  };

  return (
    <button type={type} className={`${baseClasses} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
