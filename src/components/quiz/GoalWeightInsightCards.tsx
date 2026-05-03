"use client";

import { StockOutlined } from "@ant-design/icons";
import { kgToLb } from "@/lib/units";
import type { UnitSystem } from "@/types/quiz";

const UTAH_STUDY_BODY =
  "A study by the University of Utah found that working out just 5 minutes per day can maintain your level of fitness, improve energy levels, and lead to better sleep.";

function weightStrongParts(kg: number, unit: UnitSystem): { n: number; unitLabel: "kg" | "lbs" } {
  if (unit === "metric") return { n: Math.round(kg), unitLabel: "kg" };
  return { n: Math.round(kgToLb(kg)), unitLabel: "lbs" };
}

function StrongWeight({ kg, unit }: { kg: number; unit: UnitSystem }) {
  const { n, unitLabel } = weightStrongParts(kg, unit);
  return (
    <strong className="font-semibold text-[rgb(23,23,23)] tabular-nums">
      {n} {unitLabel}
    </strong>
  );
}

function AlertIcon() {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(238,80,90)] text-[13px] font-bold text-white"
      aria-hidden
    >
      !
    </span>
  );
}

function GetMovingLeadIcon() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[rgb(23,23,23)]" aria-hidden>
      <StockOutlined className="text-[22px] leading-none" />
    </span>
  );
}

export function GoalWeightLowAlertCard({
  unit,
  minKg,
  maxKg,
}: {
  unit: UnitSystem;
  minKg: number;
  maxKg: number;
}) {
  return (
    <div className="mt-5 rounded-[16px] border border-solid border-[var(--borderTertiaryColor)] bg-[var(--backgroundNegativeColor)] p-6 text-[14px] leading-snug">
      <div className="flex items-start gap-4">
        <AlertIcon />
        <div className="min-w-0 flex-1 space-y-3">
          <p className="font-semibold text-[rgb(23,23,23)]">Uh-oh! Low weight alert!</p>
          <p className="text-[rgba(23,23,23,0.78)]">
            A normal weight range for your height is between <StrongWeight kg={minKg} unit={unit} /> and <StrongWeight kg={maxKg} unit={unit} />. Any weight below{" "}
            <StrongWeight kg={minKg} unit={unit} /> is classified as underweight and is not recommended by the World Health Organization.
          </p>
        </div>
      </div>
    </div>
  );
}

export function GoalWeightGetMovingCard({
  percentRounded,
  lose,
}: {
  percentRounded: number;
  lose: boolean;
}) {
  const verb = lose ? "lose" : "gain";

  return (
    <div className="mt-5 rounded-[16px] border border-solid border-[var(--borderTertiaryColor)] bg-[rgba(243,244,246,0.96)] p-6 text-[14px] leading-snug">
      <div className="flex items-start gap-4">
        <GetMovingLeadIcon />
        <div className="min-w-0 flex-1 space-y-3">
          <p className="font-medium text-[rgb(23,23,23)] text-[17px]">
            Get moving:{" "}
            <strong className="font-bold">
              {verb} {percentRounded}%
            </strong>{" "}
            of your weight
          </p>
        </div>
      </div>
      <p className="text-[rgba(23,23,23,0.78)] text-[14px] mt-2">{UTAH_STUDY_BODY}</p>
    </div>
  );
}
