"use client";

import { motion } from "framer-motion";
import { OptionCard } from "@/components/common/OptionCard";
import {
  CoffeeOutlined,
  ThunderboltOutlined,
  FireOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import type { WorkoutFrequency } from "@/types/quiz";

interface StepWorkoutFrequencyProps {
  value: WorkoutFrequency | null;
  onSelect: (value: WorkoutFrequency) => void;
  onNext: () => void;
}

export function StepWorkoutFrequency({
  value,
  onSelect,
  onNext,
}: StepWorkoutFrequencyProps) {
  return (
    <section className="relative w-full min-w-0 max-sm:space-y-4 sm:space-y-6 pb-[calc(96px+env(safe-area-inset-bottom,0px))] sm:pb-[calc(90px+env(safe-area-inset-bottom,0px))]">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-sm:space-y-4 sm:space-y-6"
      >
        <div className="mx-auto max-w-full max-sm:px-0.5">
          <h1 className="text-center text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] text-[rgb(23,23,23)] max-sm:text-[1.5rem] sm:text-[2rem] md:text-[40px] md:leading-[1.15]">
            How often do you workout?
          </h1>
          <p className="mt-2 max-w-full text-pretty text-center text-sm leading-snug text-slate-500 sm:text-[15px] md:text-base md:leading-relaxed">
            This will affect the speed of goal achievement prediction.
          </p>
        </div>

        <div className="max-sm:space-y-2 sm:space-y-3">
          <OptionCard
            selected={value === "rarely"}
            title="Rarely"
            description="0 times per week"
            icon={<CoffeeOutlined />}
            onClick={() => onSelect("rarely")}
          />
          <OptionCard
            selected={value === "one_two_week"}
            title="Lightly"
            description="1-2 times per week"
            icon={<ThunderboltOutlined />}
            onClick={() => onSelect("one_two_week")}
          />
          <OptionCard
            selected={value === "three_four_week"}
            title="Moderate"
            description="3-4 times per week"
            icon={<FireOutlined />}
            onClick={() => onSelect("three_four_week")}
          />
          <OptionCard
            selected={value === "five_plus_week"}
            title="Highly"
            description="5 times per week or more"
            icon={<RocketOutlined />}
            onClick={() => onSelect("five_plus_week")}
          />
        </div>
      </motion.div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex h-[calc(90px+env(safe-area-inset-bottom,0px))] items-center justify-center border-t border-[rgba(23,23,23,0.12)] bg-white px-4 shadow-[0_-4px_24px_-12px_rgba(23,23,23,0.06)]">
        <button
          type="button"
          onClick={onNext}
          disabled={!value}
          className="quiz-footer-primary-cta"
        >
          Start analysis
        </button>
      </div>
    </section>
  );
}
