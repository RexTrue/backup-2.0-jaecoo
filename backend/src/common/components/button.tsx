import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  onClick?: () => void;
}

export default function Button({ children, variant = "primary", onClick }: ButtonProps) {

  const base =
    "px-6 py-3 rounded-lg font-semibold transition duration-200";

  const style =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-blue-600 text-blue-600 hover:bg-blue-50";

  return (
    <button className={`${base} ${style}`} onClick={onClick}>
      {children}
    </button>
  );
}