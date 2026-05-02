import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-[52px] w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 ${
        disabled
          ? "cursor-not-allowed bg-slate-400"
          : "bg-[#485AA3] shadow-lg shadow-[rgba(72,90,163,0.35)] hover:-translate-y-0.5 hover:bg-[#3f4f92] active:translate-y-0"
      } ${className}`}
    >
      {children}
    </button>
  );
}
