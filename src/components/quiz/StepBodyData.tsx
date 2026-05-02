"use client";

import { useMemo } from "react";
import { quizBottomPrimaryButtonClass } from "@/components/common/quizCtaClasses";
import { cmToFeetInches, feetInchesToCm, kgToLb, lbToKg } from "@/lib/units";
import type { QuizData, UnitSystem } from "@/types/quiz";

interface StepBodyDataProps {
  data: QuizData;
  mode: "age" | "height" | "weight" | "target_weight";
  onUpdate: (payload: Partial<QuizData>) => void;
  onNext: () => void;
}

const rowInputStyle =
  "no-spin w-full bg-transparent text-center text-[48px] font-medium leading-none text-[rgb(23,23,23)] outline-none placeholder:text-[48px] placeholder:font-medium placeholder:text-[rgba(23,23,23,0.4)]";

const HEIGHT_RANGE_MSG: Record<UnitSystem, string> = {
  metric: "Please, enter a value from 90 cm to 243 cm.",
  imperial: "Please, enter a value from 3 ft to 7 ft 11 in.",
};

const WEIGHT_RANGE_MSG: Record<UnitSystem, string> = {
  metric: "Please, enter a value from 25 kg to 300 kg.",
  imperial: "Please, enter a value from 55 lbs to 662 lbs.",
};

/** 输入框旁单位（cm / ft / in / kg / lbs / years） */
const unitSuffixClass =
  "pb-1 text-[48px] font-semibold leading-none text-[rgb(23,23,23)] select-none";

export function StepBodyData({ data, mode, onUpdate, onNext }: StepBodyDataProps) {
  /** 仅在有身高数据时换算；不要用默认 cm，否则 ft/in 一直有数字、placeholder 永远不显示 */
  const imperialParts = useMemo(() => {
    if (data.heightCm == null) return null;
    return cmToFeetInches(data.heightCm);
  }, [data.heightCm]);

  const currentError = useMemo(() => {
    if (mode === "age") {
      if (!data.age) return "Please, enter a value from 14 to 80 years.";
      if (data.age < 14 || data.age > 80) return "Please, enter a value from 14 to 80 years.";
      return "";
    }
    if (mode === "height") {
      const heightMsg = HEIGHT_RANGE_MSG[data.unit];
      if (!data.heightCm) return heightMsg;
      if (data.heightCm < 90 || data.heightCm > 243) return heightMsg;
      return "";
    }
    if (mode === "weight") {
      const wMsg = WEIGHT_RANGE_MSG[data.unit];
      if (!data.weightKg) return wMsg;
      if (data.weightKg < 25 || data.weightKg > 300) return wMsg;
      return "";
    }
    const targetWMsg = WEIGHT_RANGE_MSG[data.unit];
    if (!data.targetWeightKg) return targetWMsg;
    if (data.targetWeightKg < 25 || data.targetWeightKg > 300) return targetWMsg;
    if (data.goal && data.weightKg) {
      const diff = data.targetWeightKg - data.weightKg;
      if (data.goal === "lose_weight" && diff >= -0.05) {
        return "For weight loss, your target weight should be below your current weight.";
      }
      if (data.goal === "build_muscle" && diff <= 0.05) {
        return "For muscle gain, your target weight should be above your current weight.";
      }
      if (data.goal === "tone_body" && Math.abs(diff) < 0.5) {
        return "For toning, set your target at least ~0.5 kg different from your current weight.";
      }
    }
    return "";
  }, [data.age, data.goal, data.heightCm, data.targetWeightKg, data.unit, data.weightKg, mode]);

  const canNext = currentError.length === 0;

  const onUnitChange = (unit: UnitSystem) => {
    onUpdate({ unit });
  };
  const showUnitToggle = mode === "height" || mode === "weight" || mode === "target_weight";
  const metricUnitLabel = mode === "height" ? "cm" : "kg";
  const imperialUnitLabel = mode === "height" ? "ft" : "lbs";
  const renderDataRow = ({
    value,
    unit,
    onChange,
    placeholder = "",
  }: {
    value: string | number;
    unit: string;
    onChange: (next: string) => void;
    placeholder?: string;
  }) => (
    <label className="block">
      <div className="flex items-end gap-3 border-b border-[rgba(23,23,23,0.18)] pb-2">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={rowInputStyle}
        />
        <span className={unitSuffixClass}>{unit}</span>
      </div>
    </label>
  );

  return (
    <section className="relative space-y-8 pb-[calc(90px+env(safe-area-inset-bottom,0px))]">
      <div>
        <h1 className="text-center text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] text-[rgb(23,23,23)] sm:text-[2rem] md:text-[40px] md:leading-[1.15]">
          {mode === "age"
            ? "How old are you?"
            : mode === "height"
              ? "How tall are you?"
              : mode === "weight"
                ? "What’s your current weight?"
                : "Got it! And what's your goal weight?"}
        </h1>
      </div>

      <div className="mx-auto w-full max-w-[552px] rounded-3xl border border-[rgba(23,23,23,0.08)] bg-white px-6 py-6">
        {showUnitToggle ? (
          <div className="mb-5 flex justify-center">
            <div className="inline-flex rounded-full bg-[#F3F4F6] p-1">
              <button
                type="button"
                onClick={() => onUnitChange("metric")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${data.unit === "metric"
                  ? "bg-white text-[#171717] shadow-sm"
                  : "text-[rgba(23,23,23,0.52)]"
                  }`}
              >
                {metricUnitLabel}
              </button>
              <button
                type="button"
                onClick={() => onUnitChange("imperial")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${data.unit === "imperial"
                  ? "bg-white text-[#171717] shadow-sm"
                  : "text-[rgba(23,23,23,0.52)]"
                  }`}
              >
                {imperialUnitLabel}
              </button>
            </div>
          </div>
        ) : null}

        <div className="space-y-5">
          {mode === "age"
            ? renderDataRow({
              value: data.age ?? "",
              unit: "years",
              placeholder: "Age",
              onChange: (next) => onUpdate({ age: next ? Number(next) : null }),
            })
            : null}

          {mode === "height" ? (
            data.unit === "metric" ? (
              renderDataRow({
                value: data.heightCm ?? "",
                unit: "cm",
                placeholder: "Height",
                onChange: (next) => onUpdate({ heightCm: next ? Number(next) : null }),
              })
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-end gap-2 border-b border-[rgba(23,23,23,0.18)] pb-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Height"
                      value={imperialParts === null ? "" : imperialParts.feet}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          onUpdate({ heightCm: null });
                          return;
                        }
                        const nextFeet = Number(raw);
                        const inches = imperialParts?.inches ?? 0;
                        onUpdate({ heightCm: feetInchesToCm(nextFeet, inches) });
                      }}
                      className={rowInputStyle}
                    />
                    <span className={unitSuffixClass}>ft</span>
                  </label>
                  <label className="flex items-end gap-2 border-b border-[rgba(23,23,23,0.18)] pb-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Height"
                      value={imperialParts === null ? "" : imperialParts.inches}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const ft = imperialParts?.feet ?? 0;
                        if (raw === "") {
                          if (ft === 0) {
                            onUpdate({ heightCm: null });
                          } else {
                            onUpdate({ heightCm: feetInchesToCm(ft, 0) });
                          }
                          return;
                        }
                        const nextInches = Number(raw);
                        if (ft === 0 && nextInches === 0) {
                          onUpdate({ heightCm: null });
                          return;
                        }
                        onUpdate({ heightCm: feetInchesToCm(ft, nextInches) });
                      }}
                      className={rowInputStyle}
                    />
                    <span className={unitSuffixClass}>in</span>
                  </label>
                </div>
              </div>
            )
          ) : null}

          {mode === "weight"
            ? renderDataRow({
              value:
                data.weightKg
                  ? data.unit === "metric"
                    ? data.weightKg
                    : Number(kgToLb(data.weightKg).toFixed(1))
                  : "",
              unit: data.unit === "metric" ? "kg" : "lbs",
              placeholder: "Weight",
              onChange: (next) =>
                onUpdate({
                  weightKg: next
                    ? data.unit === "metric"
                      ? Number(next)
                      : Number(lbToKg(Number(next)).toFixed(2))
                    : null,
                }),
            })
            : null}

          {mode === "target_weight"
            ? renderDataRow({
              value:
                data.targetWeightKg
                  ? data.unit === "metric"
                    ? data.targetWeightKg
                    : Number(kgToLb(data.targetWeightKg).toFixed(1))
                  : "",
              unit: data.unit === "metric" ? "kg" : "lbs",
              placeholder: "Goal weight",
              onChange: (next) =>
                onUpdate({
                  targetWeightKg: next
                    ? data.unit === "metric"
                      ? Number(next)
                      : Number(lbToKg(Number(next)).toFixed(2))
                    : null,
                }),
            })
            : null}
        </div>
        {currentError ? (
          <div className="mt-4 rounded-2xl border border-amber-200/90 bg-amber-50 px-4 py-3">
            <p className="text-center text-sm font-medium leading-relaxed text-amber-900">{currentError}</p>
          </div>
        ) : null}
      </div>

      {/* BetterMe-style: fixed bottom strip, centered pill CTA (not full-width) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex h-[calc(90px+env(safe-area-inset-bottom,0px))] items-center justify-center border-t border-[rgba(23,23,23,0.12)] bg-white px-4 shadow-[0_-4px_24px_-12px_rgba(23,23,23,0.06)]">
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={quizBottomPrimaryButtonClass}
        >
          Next step
        </button>
      </div>
    </section>
  );
}
