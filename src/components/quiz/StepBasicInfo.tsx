import {
  ManOutlined,
  WomanOutlined,
  FireOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { OptionCard } from "@/components/common/OptionCard";
import type { FitnessGoal, Gender } from "@/types/quiz";

interface StepBasicInfoProps {
  mode: "gender" | "goal";
  gender: Gender | null;
  goal: FitnessGoal | null;
  onSelectGender: (value: Gender) => void;
  onSelectGoal: (value: FitnessGoal) => void;
}

export function StepBasicInfo({
  mode,
  gender,
  goal,
  onSelectGender,
  onSelectGoal,
}: StepBasicInfoProps) {
  const isGenderStep = mode === "gender";

  const handleGenderSelect = (value: Gender) => {
    onSelectGender(value);
  };

  const handleGoalSelect = (value: FitnessGoal) => {
    onSelectGoal(value);
  };

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-center text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] text-[rgb(23,23,23)] sm:text-[2rem] md:text-[40px] md:leading-[1.15]">
          {isGenderStep ? "Are you a male or female?" : "What is your main goal?"}
        </h1>
      </div>

      <div className="space-y-4">
        {isGenderStep ? (
          <>
            <OptionCard
              selected={gender === "male"}
              title="Male"
              icon={<ManOutlined />}
              onClick={() => handleGenderSelect("male")}
            />
            <OptionCard
              selected={gender === "female"}
              title="Female"
              icon={<WomanOutlined />}
              onClick={() => handleGenderSelect("female")}
            />
          </>
        ) : (
          <>
            <OptionCard
              selected={goal === "lose_weight"}
              title="Lose Weight"
              icon={<FireOutlined />}
              onClick={() => handleGoalSelect("lose_weight")}
            />
            <OptionCard
              selected={goal === "build_muscle"}
              title="Build Muscle"
              icon={<ThunderboltOutlined />}
              onClick={() => handleGoalSelect("build_muscle")}
            />
            <OptionCard
              selected={goal === "tone_body"}
              title="Tone Body"
              icon={<ExperimentOutlined />}
              onClick={() => handleGoalSelect("tone_body")}
            />
          </>
        )}
      </div>
    </section>
  );
}
