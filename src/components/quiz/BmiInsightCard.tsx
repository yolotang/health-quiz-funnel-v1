"use client";

import { CheckOutlined } from "@ant-design/icons";
import { computeBmi, getBmiCategory, type BmiCategoryLabel } from "@/lib/calculation";

const categoryWord: Record<BmiCategoryLabel, string> = {
  Underweight: "underweight",
  Normal: "normal",
  Overweight: "overweight",
  Obese: "obese",
};

function NegativeIcon() {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(238,80,90)] text-[15px] font-bold text-white"
      aria-hidden
    >
      !
    </span>
  );
}

function PositiveIcon() {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(58,174,146)] text-white"
      aria-hidden
    >
      <CheckOutlined className="text-[13px] leading-none" />
    </span>
  );
}

export function BmiInsightCard({ weightKg, heightCm }: { weightKg: number; heightCm: number }) {
  const bmi = computeBmi(weightKg, heightCm);
  const category = getBmiCategory(bmi);
  const display = Math.round(bmi);
  const word = categoryWord[category];
  const positive = category === "Normal";

  const body =
    category === "Normal"
      ? "You're starting from a great place! Now we'll use your BMI to create a program tailored to your needs."
      : "You have some work ahead of you, but it's great that you're taking this first step. We'll use your BMI to create a program just for you.";

  return (
    <div
      className={`mt-5 rounded-[16px] border border-solid border-[var(--borderTertiaryColor)] p-6 leading-snug ${positive ? "bg-[var(--backgroundPositiveColor)]" : "bg-[var(--backgroundNegativeColor)]"}`}
    >
      <div className="flex items-start gap-4">
        {positive ? <PositiveIcon /> : <NegativeIcon />}
        <div className="min-w-0 flex-1 space-y-3">
          <p className="font-medium text-[rgb(23,23,23)] text-[17px]">
            Your BMI is {display} which is considered{" "}
            <strong className="font-bold">{word}</strong>
          </p>
        </div>
      </div>
      <p className="mt-2 text-[14px] text-[rgba(23,23,23,0.78)]">{body}</p>
    </div>
  );
}
