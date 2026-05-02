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
    <section className="relative space-y-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <div>
        <h1 className="text-center text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] text-[rgb(23,23,23)] sm:text-[2rem] md:text-[40px] md:leading-[1.15]">
          How often do you workout?
        </h1>
        <p className="mt-2 text-sm text-slate-500">This will affect the speed of goal achievement prediction.</p>
      </div>

      <div className="space-y-3">
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

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex justify-center border-t border-[rgba(23,23,23,0.12)] bg-white px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_-12px_rgba(23,23,23,0.06)]">
        <button
          type="button"
          onClick={onNext}
          disabled={!value}
          className="pointer-events-auto w-max min-h-[52px] rounded-full bg-[#5865A6] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_-8px_rgba(88,101,166,0.55)] transition enabled:hover:bg-[#4d5a94] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:px-12 sm:text-sm"
        >
          Start analysis
        </button>
      </div>
    </section>
  );
}
