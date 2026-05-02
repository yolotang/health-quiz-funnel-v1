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
    <section className="relative space-y-6 pb-[calc(90px+env(safe-area-inset-bottom,0px))]">
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

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex h-[calc(90px+env(safe-area-inset-bottom,0px))] items-center justify-center border-t border-[rgba(23,23,23,0.12)] bg-white px-4 shadow-[0_-4px_24px_-12px_rgba(23,23,23,0.06)]">
        <button
          type="button"
          onClick={onNext}
          disabled={!value}
          className="pointer-events-auto w-max rounded-full bg-[#485AA3] px-10 py-2.5 text-[17px] font-semibold uppercase tracking-[0.06em] text-white transition enabled:hover:bg-[#3f4f92] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start analysis
        </button>
      </div>
    </section>
  );
}
