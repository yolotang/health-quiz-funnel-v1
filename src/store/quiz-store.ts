"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { buildReportData } from "@/lib/calculation";
import type { QuizData, ReportData } from "@/types/quiz";

interface QuizState {
  currentStep: number;
  quizData: QuizData;  // 当前的问卷数据
  reportData: ReportData | null;  // 当前的报告数据
  analysisStartedAt: number | null;  // 分析开始时间
  hasHydrated: boolean;  // 是否已从本地恢复数据
  setHasHydrated: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  updateQuizData: (payload: Partial<QuizData>) => void;
  startAnalysis: () => void;
  completeAnalysis: () => void;
  /** 补齐旧版持久化里缺少的 chartCurve 等 */
  setReportData: (reportData: ReportData | null) => void;
  resetAll: () => void;
}

const initialQuizData: QuizData = {
  gender: null,
  goal: null,
  unit: "metric",
  age: null,
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,
  workoutFrequency: null,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      quizData: initialQuizData,
      reportData: null,
      analysisStartedAt: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setCurrentStep: (step) => set({ currentStep: step }),
      updateQuizData: (payload) =>
        set((state) => ({ quizData: { ...state.quizData, ...payload } })),
      startAnalysis: () =>
        set({
          currentStep: 8,
          analysisStartedAt: Date.now(),
        }),
      completeAnalysis: () => {
        const { quizData } = get();
        if (!quizData.heightCm || !quizData.weightKg || !quizData.targetWeightKg) {
          return;
        }
        const reportData = buildReportData({
          weightKg: quizData.weightKg,
          targetWeightKg: quizData.targetWeightKg,
          heightCm: quizData.heightCm,
          workoutFrequency: quizData.workoutFrequency,
          goal: quizData.goal,
          age: quizData.age,
        });
        set({
          reportData,
          currentStep: 9,
          analysisStartedAt: null,
        });
      },
      setReportData: (reportData) => set({ reportData }),
      resetAll: () =>
        set({
          currentStep: 1,
          quizData: initialQuizData,
          reportData: null,
          analysisStartedAt: null,
        }),
    }),
    {
      name: "quiz-funnel-storage",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const next = {
          ...currentState,
          ...(persistedState as Record<string, unknown>),
        } as QuizState;
        const s = next.currentStep;
        if (typeof s !== "number" || !Number.isFinite(s) || s < 1 || s > 9) {
          next.currentStep = 1;
        } else {
          next.currentStep = Math.round(s);
        }
        return next;
      },
      partialize: (state) => ({
        currentStep: state.currentStep,
        quizData: state.quizData,
        reportData: state.reportData,
        analysisStartedAt: state.analysisStartedAt,
      }),
      // Success: (state from get(), undefined). Failure: (undefined, error).
      // Avoid synchronous useQuizStore.getState() — persist can run during create() before
      // `export const useQuizStore` is assigned (TDZ ReferenceError).
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("[quiz-funnel] Could not restore saved progress:", error);
        }
        if (state?.setHasHydrated) {
          state.setHasHydrated(true);
        } else {
          queueMicrotask(() => {
            useQuizStore.getState().setHasHydrated(true);
          });
        }
      },
    },
  ),
);
