import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { CheckOutlined } from "@ant-design/icons";

interface OptionCardProps {
  selected: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
}

export function OptionCard({
  selected,
  title,
  description,
  icon,
  onClick,
  className = "",
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-pressed={selected}
      className={`mx-auto flex min-h-[72px] w-full max-w-[552px] items-center rounded-3xl border px-5 py-4 text-left shadow-sm transition-all duration-200 sm:min-h-[80px] sm:px-6 ${selected ? "border-transparent bg-[#EFF1F4]" : "border-[rgba(23,23,23,0.07)] bg-transparent hover:border-[rgba(23,23,23,0.12)]"
        } ${className}`}
    >
      <div className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          {icon ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(23,23,23,0.06)] text-[22px] text-[rgba(23,23,23,0.62)]">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0 text-left">
            <p className="break-words text-[18px] font-semibold leading-tight text-[#171717]">{title}</p>
            {description ? (
              <p className="mt-0.5 break-words text-sm text-[rgba(23,23,23,0.56)]">{description}</p>
            ) : null}
          </div>
        </div>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xl ${selected
            ? "border-[#171717] bg-[#171717] text-white"
            : "border-[rgba(23,23,23,0.28)] bg-white text-transparent"
            }`}
        >
          {selected ? <CheckOutlined /> : null}
        </span>
      </div>
    </motion.button>
  );
}
