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
}

export interface ReportData {
  bmi: number;
  bmiCategory: string;
  weeksToGoal: number;
  targetDateLabel: string;
  /** 平滑曲线采样点：时间戳 + kg；旧版持久化数据可能缺失 */
  chartCurve?: Array<{ atMs: number; weightKg: number }>;
}
