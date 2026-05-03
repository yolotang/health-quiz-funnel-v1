"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { BmiInsightCard } from "@/components/quiz/BmiInsightCard";
import { GoalWeightGetMovingCard, GoalWeightLowAlertCard } from "@/components/quiz/GoalWeightInsightCards";
import { healthyWeightRangeKg } from "@/lib/calculation";
import { cmToFeetInches, feetInchesToCm, kgToLb, lbToKg } from "@/lib/units";
import type { QuizData, UnitSystem } from "@/types/quiz";

interface StepBodyDataProps {
  data: QuizData;
  mode: "age" | "height" | "weight" | "target_weight";
  onUpdate: (payload: Partial<QuizData>) => void;
  onNext: () => void;
}

/** clamp 防止窄屏占位裁切；sm+ 与桌面大字对齐 */
const rowInputStyle =
  "no-spin bg-transparent text-center text-[clamp(1.75rem,8vw,3rem)] font-medium leading-none text-[rgb(23,23,23)] outline-none placeholder:font-medium placeholder:text-[rgba(23,23,23,0.4)] sm:text-[48px] sm:placeholder:text-[48px]";

/** 与单位同一行：输入区吃掉剩余宽度，避免旧版 1fr|auto|1fr 把单位挤出视口 */
const rowInputFlexGrow = "min-w-0 flex-1 basis-0";

const unitToggleOuterClass =
  "box-border flex h-8 w-[180px] max-w-full shrink-0 items-stretch rounded-[12px] bg-[#F3F4F6] p-[4px]";

const unitSuffixOuterCompactClass = "flex shrink-0 items-end pb-0.5";

/** 全程横向：输入 | 单位（窄屏与桌面一致） */
const dataRowFlexClass =
  "flex w-full min-w-0 flex-row items-end gap-x-2 border-b border-[rgba(23,23,23,0.18)] pb-2 sm:gap-x-3";

const HEIGHT_RANGE_MSG: Record<UnitSystem, string> = {
  metric: "Please, enter a value from 90 cm to 243 cm.",
  imperial: "Please, enter a value from 3 ft to 7 ft 11 in.",
};

const WEIGHT_RANGE_MSG: Record<UnitSystem, string> = {
  metric: "Please, enter a value from 25 kg to 300 kg.",
  imperial: "Please, enter a value from 55 lbs to 662 lbs.",
};

/** 同行展示时单位略小于输入，避免 “years” 撑破行 */
const unitSuffixClass =
  "shrink-0 whitespace-nowrap text-right text-[clamp(1rem,4.5vw,3rem)] font-semibold leading-none text-[rgb(23,23,23)] select-none sm:text-[48px]";

export function StepBodyData({ data, mode, onUpdate, onNext }: StepBodyDataProps) {

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

  const targetWeightInsight = useMemo(() => {
    if (mode !== "target_weight") return null;
    const h = data.heightCm;
    const w = data.weightKg;
    const t = data.targetWeightKg;
    if (h == null || h < 90 || h > 243) return null;
    if (w == null || w < 25 || w > 300) return null;
    if (t == null || t < 25 || t > 300) return null;
    const { minKg, maxKg } = healthyWeightRangeKg(h);
    if (t < minKg) return { variant: "low" as const, minKg, maxKg };
    const pct = ((t - w) / w) * 100;
    if (Math.abs(pct) < 0.5) return { variant: "none" as const };
    return {
      variant: "moving" as const,
      percentRounded: Math.round(Math.abs(pct)),
      lose: t < w,
    };
  }, [mode, data.heightCm, data.targetWeightKg, data.weightKg]);

  const showBmiInsight = useMemo(() => {
    if (mode !== "weight") return false;
    const h = data.heightCm;
    const w = data.weightKg;
    if (h == null || h < 90 || h > 243) return false;
    if (w == null || w < 25 || w > 300) return false;
    return true;
  }, [data.heightCm, data.weightKg, mode]);

  const showTargetMarketingInsights = mode === "target_weight" && currentError.length === 0;

  const consentRequired = mode === "height" || mode === "weight";
  const hasConsent = data.healthOnboardingConsent === true;
  const canNext = currentError.length === 0 && (!consentRequired || hasConsent);

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
    <label className="block min-w-0">
      <div className={dataRowFlexClass}>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${rowInputStyle} ${rowInputFlexGrow}`}
        />
        <div className={unitSuffixOuterCompactClass}>
          <span className={unitSuffixClass}>{unit}</span>
        </div>
      </div>
    </label>
  );

  return (
    <section className="relative w-full min-w-0 space-y-8 pb-[calc(112px+env(safe-area-inset-bottom,0px))] sm:pb-[calc(100px+env(safe-area-inset-bottom,0px))]">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-center text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] text-[rgb(23,23,23)] sm:text-[2rem] md:text-[40px] md:leading-[1.15]">
            {mode === "age"
              ? "What is your age?"
              : mode === "height"
                ? "How tall are you?"
                : mode === "weight"
                  ? "What’s your current weight?"
                  : "Got it! And what's your goal weight?"}
          </h1>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-[552px] rounded-3xl border border-[rgba(23,23,23,0.08)] bg-white px-4 py-6 sm:px-6">
          {showUnitToggle ? (
            <div className="mb-5 flex justify-center">
              <div className={unitToggleOuterClass}>
                <button
                  type="button"
                  onClick={() => onUnitChange("imperial")}
                  className={`flex h-full min-h-0 w-1/2 min-w-0 items-center justify-center rounded-[12px] text-sm font-medium transition ${data.unit === "imperial"
                    ? "bg-white text-[#171717] shadow-sm"
                    : "text-[rgba(23,23,23,0.52)]"
                    }`}
                >
                  {imperialUnitLabel}
                </button>
                <button
                  type="button"
                  onClick={() => onUnitChange("metric")}
                  className={`flex h-full min-h-0 w-1/2 min-w-0 items-center justify-center rounded-[12px] text-sm font-medium transition ${data.unit === "metric"
                    ? "bg-white text-[#171717] shadow-sm"
                    : "text-[rgba(23,23,23,0.52)]"
                    }`}
                >
                  {metricUnitLabel}
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
                  <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
                    <label className="block min-w-0">
                      <div className={dataRowFlexClass}>
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
                          className={`${rowInputStyle} ${rowInputFlexGrow}`}
                        />
                        <div className={unitSuffixOuterCompactClass}>
                          <span className={unitSuffixClass}>ft</span>
                        </div>
                      </div>
                    </label>
                    <label className="block min-w-0">
                      <div className={dataRowFlexClass}>
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
                          className={`${rowInputStyle} ${rowInputFlexGrow}`}
                        />
                        <div className={unitSuffixOuterCompactClass}>
                          <span className={unitSuffixClass}>in</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )
            ) : null}

            {mode === "height" ? (
              <div className="flex gap-3 pt-1 text-left">
                <input
                  id="health-onboarding-consent"
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => onUpdate({ healthOnboardingConsent: e.target.checked })}
                  className="mt-0.5 h-[22px] w-[22px] shrink-0 rounded border border-[rgba(23,23,23,0.28)] text-[#485AA3] accent-[#485AA3]"
                />
                <p className="text-[15px] leading-snug text-[rgba(23,23,23,0.72)]">
                  <label htmlFor="health-onboarding-consent" className="cursor-pointer">
                    I consent to this app processing my health onboarding data to provide the assessment experience and
                    improve the product.
                  </label>
                </p>
              </div>
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
          {showTargetMarketingInsights && targetWeightInsight?.variant === "low" ? (
            <GoalWeightLowAlertCard unit={data.unit} minKg={targetWeightInsight.minKg} maxKg={targetWeightInsight.maxKg} />
          ) : null}
          {showTargetMarketingInsights && targetWeightInsight?.variant === "moving" ? (
            <GoalWeightGetMovingCard percentRounded={targetWeightInsight.percentRounded} lose={targetWeightInsight.lose} />
          ) : null}
          {showBmiInsight && data.weightKg != null && data.heightCm != null ? (
            <BmiInsightCard weightKg={data.weightKg} heightCm={data.heightCm} />
          ) : null}
        </div>
      </motion.div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex h-[calc(90px+env(safe-area-inset-bottom,0px))] items-center justify-center border-t border-[rgba(23,23,23,0.12)] bg-white px-4 shadow-[0_-4px_24px_-12px_rgba(23,23,23,0.06)]">
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="quiz-footer-primary-cta"
        >
          Next step
        </button>
      </div>
    </section>
  );
}
