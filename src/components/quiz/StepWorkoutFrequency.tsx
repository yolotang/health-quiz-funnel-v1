import { OptionCard } from "@/components/common/OptionCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
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
    <section className="space-y-6">
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

      <div className="flex justify-center">
        <PrimaryButton onClick={onNext} disabled={!value}>
          Start Analysis
        </PrimaryButton>
      </div>
    </section>
  );
}
