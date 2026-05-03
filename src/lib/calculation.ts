/**
 * 报告里的「预计达标日期」与趋势折线均为 **展示用启发式**，不是临床或个体化预测。
 *
 * 做法概要：用「当前体重与目标体重的差值」除以「假设的周体重变化速度」得到周数，再换算日期。
 * - 周速度来自运动频率挡位的一组经验常数（kg/周量级），再乘以 goal / age 的系数让结果与问卷选项挂钩。
 * - BMI 与 WHO 常用的 BMI 分段阈值一致（偏瘦 / 健康 / 超重 / 肥胖），仅作健康科普层级参考。
 *
 * 真实减脂增肌速度因人而异，若要做合规产品，应改为免责声明 + 不接「确切日期」表述，或接入真人顾问 / 算法模型。
 */
import type { FitnessGoal, ReportData, WorkoutFrequency } from "@/types/quiz";

/** Step 4 分析页强制等待（毫秒）；`page` 定时器与 `StepAnalyzing` 圆环共用此值。 */
export const ANALYSIS_DURATION_MS = 3500;

/** BMI 分类标签 */
export type BmiCategoryLabel = "Underweight" | "Normal" | "Overweight" | "Obese";

/** 根据 BMI 计算分类标签 */
export function getBmiCategory(bmi: number): BmiCategoryLabel {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24) return "Normal";
  if (bmi < 28) return "Overweight";
  return "Obese";
}

/** 计算 BMI */
export function computeBmi(weightKg: number, heightCm: number): number {
  const hM = heightCm / 100;
  return weightKg / (hM * hM);
}

/** 健康体重带（BMI 18.5–24），以身高为参数，返回体重范围（kg） */
export function healthyWeightRangeKg(heightCm: number): { minKg: number; maxKg: number } {
  const heightM = heightCm / 100;
  const h2 = heightM * heightM;
  return { minKg: 18.5 * h2, maxKg: 24 * h2 };
}

const getWeeklyProgressKg = (frequency: WorkoutFrequency | null): number => {
  switch (frequency) {
    case "rarely":
      return 0.2;
    case "one_two_week":
      return 0.35;
    case "three_four_week":
      return 0.5;
    case "five_plus_week":
      return 0.65;
    default:
      return 0.35;
  }
};

const getGoalProgressMultiplier = (goal: FitnessGoal | null): number => {
  switch (goal) {
    case "lose_weight":
      return 1.08; //  减脂略「快」一点
    case "build_muscle":
      return 0.72;
    case "tone_body":
      return 0.92;
    default:
      return 1;
  }
};

const getAgeProgressMultiplier = (age: number | null): number => {
  if (!age) return 1;
  if (age >= 55) return 0.88;
  if (age >= 45) return 0.94;
  return 1;
};

export const buildReportData = (params: {
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  workoutFrequency: WorkoutFrequency | null;
  goal: FitnessGoal | null;
  age: number | null;
}): ReportData => {
  const { weightKg, targetWeightKg, heightCm, workoutFrequency, goal, age } = params;
  const bmi = computeBmi(weightKg, heightCm);
  const bmiCategory = getBmiCategory(bmi);

  const totalDelta = Math.abs(weightKg - targetWeightKg); // 计算当前体重与目标体重之差
  const weeklyProgress =
    getWeeklyProgressKg(workoutFrequency) *
    getGoalProgressMultiplier(goal) *
    getAgeProgressMultiplier(age); // 计算每周减重或增重量
  const weeksToGoal = Math.max(2, Math.ceil(totalDelta / weeklyProgress)); // 计算达到目标体重所需周数

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + weeksToGoal * 7); // 将周数转换为天数
  const targetDateLabel = targetDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const totalDays = Math.max(7, weeksToGoal * 7);
  const segments = 56;
  const dayStart = new Date();
  dayStart.setHours(12, 0, 0, 0);

  const chartCurve: Array<{ atMs: number; weightKg: number }> = [];
  for (let i = 0; i <= segments; i++) {
    const p = i / segments;
    const eased = 1 - Math.pow(1 - p, 3);
    const w = weightKg + (targetWeightKg - weightKg) * eased;
    const day = new Date(dayStart);
    day.setDate(day.getDate() + Math.round(p * totalDays));
    chartCurve.push({
      atMs: day.getTime(),
      weightKg: Number(w.toFixed(2)),
    });
  }
  chartCurve[0] = { ...chartCurve[0], weightKg: Number(weightKg.toFixed(2)) };
  chartCurve[chartCurve.length - 1] = {
    ...chartCurve[chartCurve.length - 1],
    weightKg: Number(targetWeightKg.toFixed(2)),
  };

  return {
    bmi: Number(bmi.toFixed(1)),
    bmiCategory,
    weeksToGoal,
    targetDateLabel,
    chartCurve,
  };
};
