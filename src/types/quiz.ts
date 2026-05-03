export type Gender = "male" | "female";
export type FitnessGoal = "lose_weight" | "build_muscle" | "tone_body";
export type UnitSystem = "metric" | "imperial";
export type WorkoutFrequency =
  | "rarely"
  | "one_two_week"
  | "three_four_week"
  | "five_plus_week";

export interface QuizData {
  gender: Gender | null;
  goal: FitnessGoal | null;
  unit: UnitSystem;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
  workoutFrequency: WorkoutFrequency | null;
  /** 健康问卷同意（身高 / 体重步骤） */
  healthOnboardingConsent: boolean;
}

export interface ReportData {
  bmi: number;
  bmiCategory: string;
  weeksToGoal: number;
  targetDateLabel: string;
  /** 图表样本（时间戳 + 体重）；可能缺失在旧版持久化快照中 */
  chartCurve?: Array<{ atMs: number; weightKg: number }>;
}
