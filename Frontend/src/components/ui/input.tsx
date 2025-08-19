import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ error, label, rightIcon, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium capitalize">{label}</label>}
    <div className={cn("flex items-center rounded border px-3", error ? "border-red-500" : "border-gray-300")}
      >
      <input
        {...props}
        className={cn("w-full py-2 outline-none bg-transparent", className)}
      />
      {rightIcon}
    </div>
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);
