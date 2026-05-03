"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";

interface TopNavProps {
  brand?: string;
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  currentStep?: number;
  totalSteps?: number;
  progress?: number;
  showProgress?: boolean;
  className?: string;
}

export function TopNav({
  brand = "Quiz-Funnel",
  onBack,
  showBack = true,
  title,
  totalSteps = 5,
  progress = 0,
  showProgress = true,
  className = "",
}: TopNavProps) {
  const safeTotalSteps = Math.max(1, totalSteps);
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const completedUnits = (normalizedProgress / 100) * safeTotalSteps;

  return (
    <header
      className={`relative grid h-full grid-cols-[1fr_auto_1fr] items-center ${className}`}
    >
      <div className="flex max-w-[45%] items-center gap-2 justify-self-start sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!showBack || !onBack}
          className={`inline-flex h-12 min-h-12 min-w-12 w-12 shrink-0 items-center justify-center rounded-full border transition sm:mr-4 ${showBack && onBack
            ? "border-[rgba(23,23,23,0.46)] bg-transparent text-[#171717] hover:bg-[rgba(23,23,23,0.06)] hover:border-transparent"
            : "border-transparent bg-transparent text-transparent"
            }`}
          aria-label="Go back"
        >
          <ArrowLeftOutlined className="text-lg" />
        </button>
        <div
          className={`min-w-0 flex-1 ${title ? "hidden sm:block" : ""}`}
        >
          <p className="truncate text-[clamp(1.125rem,4vw,1.75rem)] font-semibold leading-none tracking-[-0.02em] text-[rgba(23,23,23)]">
            {brand}
          </p>
        </div>
      </div>
      <div className="justify-self-center">
        {title ? (
          <p className="text-[17px] font-medium text-[rgba(23,23,23)]">{title}</p>
        ) : null}
      </div>

      <div className="h-12 w-12 justify-self-end" aria-hidden />


      {showProgress ? (
        <div className="absolute bottom-0 left-0 right-0 flex h-1 gap-[2px]">
          {Array.from({ length: safeTotalSteps }).map((_, index) => (
            <div key={index} className="relative h-full flex-1 bg-[rgba(23,23,23,0.14)]">
              <div
                className="h-full bg-[#171717] transition-[width] duration-200 ease-out"
                style={{
                  width: `${Math.min(1, Math.max(0, completedUnits - index)) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </header>
  );
}
