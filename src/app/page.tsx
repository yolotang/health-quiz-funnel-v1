"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TopNav } from "@/components/common/TopNav";
import { StepAnalyzing } from "@/components/quiz/StepAnalyzing";
import { StepBasicInfo } from "@/components/quiz/StepBasicInfo";
import { StepBodyData } from "@/components/quiz/StepBodyData";
import { StepReport } from "@/components/quiz/StepReport";
import { StepWorkoutFrequency } from "@/components/quiz/StepWorkoutFrequency";
import { SubscriptionModal } from "@/components/quiz/SubscriptionModal";
import { ANALYSIS_DURATION_MS, buildReportData } from "@/lib/calculation";
import { useQuizStore } from "@/store/quiz-store";

const AUTO_ADVANCE_DELAY_MS = 220;

export default function Home() {
  const {
    currentStep,
    quizData,
    reportData,
    analysisStartedAt,
    hasHydrated,
    setCurrentStep,
    updateQuizData,
    startAnalysis,
    completeAnalysis,
    setReportData,
    resetAll,
  } = useQuizStore();

  const reportForDisplay = useMemo(() => {
    if (!reportData) return null;
    if (reportData.chartCurve?.length) return reportData;
    const q = quizData;
    if (q.heightCm && q.weightKg && q.targetWeightKg) {
      return buildReportData({
        weightKg: q.weightKg,
        targetWeightKg: q.targetWeightKg,
        heightCm: q.heightCm,
        workoutFrequency: q.workoutFrequency,
        goal: q.goal,
        age: q.age,
      });
    }
    return reportData;
  }, [reportData, quizData]);

  const [paywallOpen, setPaywallOpen] = useState(false);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  const scheduleStepChange = useCallback(
    (nextStep: number) => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
      autoAdvanceTimerRef.current = window.setTimeout(() => {
        startTransition(() => setCurrentStep(nextStep));
        autoAdvanceTimerRef.current = null;
      }, AUTO_ADVANCE_DELAY_MS);
    },
    [setCurrentStep],
  );

  useEffect(
    () => () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    },
    [],
  );


  useEffect(() => {
    const p = useQuizStore.persist;
    if (!p) {
      useQuizStore.getState().setHasHydrated(true);
      return;
    }
    if (p.hasHydrated()) {
      useQuizStore.getState().setHasHydrated(true);
    }
    return p.onFinishHydration(() => {
      useQuizStore.getState().setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!useQuizStore.getState().hasHydrated) {
        console.warn("[quiz-funnel] Persist hydration did not confirm in time; unblocking UI.");
        useQuizStore.getState().setHasHydrated(true);
      }
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (currentStep === 8 && analysisStartedAt) {
      const elapsed = Date.now() - analysisStartedAt;
      const remaining = Math.max(0, ANALYSIS_DURATION_MS - elapsed);
      const timer = window.setTimeout(() => {
        completeAnalysis();
      }, remaining);
      return () => window.clearTimeout(timer);
    }
  }, [analysisStartedAt, completeAnalysis, currentStep]);

  useEffect(() => {
    if (currentStep !== 9) return;
    if (!reportData || reportData.chartCurve?.length) return;
    if (!reportForDisplay?.chartCurve?.length) return;
    startTransition(() => setReportData(reportForDisplay));
  }, [currentStep, reportData, reportForDisplay, setReportData]);

  useEffect(() => {
    if (!hasHydrated) return;

    const patchStep = (s: number) => startTransition(() => setCurrentStep(s));

    const id = requestAnimationFrame(() => {
      const step = Number(currentStep);
      if (!Number.isFinite(step) || step < 1 || step > 9) {
        patchStep(1);
        return;
      }

      if (step === 8 && !analysisStartedAt) {
        patchStep(7);
        return;
      }

      if (step === 1) return;

      if (step >= 2 && !quizData.gender) {
        patchStep(1);
        return;
      }
      if (step >= 3 && !quizData.goal) {
        patchStep(2);
        return;
      }
      if (step >= 4 && !quizData.age) {
        patchStep(3);
        return;
      }
      if (step >= 5 && !quizData.heightCm) {
        patchStep(4);
        return;
      }
      if (step >= 6 && !quizData.weightKg) {
        patchStep(5);
        return;
      }
      if (step >= 7 && !quizData.targetWeightKg) {
        patchStep(6);
        return;
      }
      if (step >= 8 && !quizData.workoutFrequency) {
        patchStep(7);
        return;
      }
      if (step >= 9 && !reportData) {
        patchStep(8);
        return;
      }
      if (step > 9) {
        patchStep(9);
      }
    });

    return () => cancelAnimationFrame(id);
  }, [analysisStartedAt, currentStep, hasHydrated, quizData, reportData, setCurrentStep]);

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo
            mode="gender"
            gender={quizData.gender}
            goal={quizData.goal}
            onSelectGender={(value) => {
              updateQuizData({ gender: value });
              scheduleStepChange(2);
            }}
            onSelectGoal={(value) => updateQuizData({ goal: value })}
          />
        );
      case 2:
        return (
          <StepBasicInfo
            mode="goal"
            gender={quizData.gender}
            goal={quizData.goal}
            onSelectGender={(value) => updateQuizData({ gender: value })}
            onSelectGoal={(value) => {
              updateQuizData({ goal: value });
              scheduleStepChange(3);
            }}
          />
        );
      case 3:
        return (
          <StepBodyData
            mode="age"
            data={quizData}
            onUpdate={updateQuizData}
            onNext={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <StepBodyData
            mode="height"
            data={quizData}
            onUpdate={updateQuizData}
            onNext={() => setCurrentStep(5)}
          />
        );
      case 5:
        return (
          <StepBodyData
            mode="weight"
            data={quizData}
            onUpdate={updateQuizData}
            onNext={() => setCurrentStep(6)}
          />
        );
      case 6:
        return (
          <StepBodyData
            mode="target_weight"
            data={quizData}
            onUpdate={updateQuizData}
            onNext={() => setCurrentStep(7)}
          />
        );
      case 7:
        return (
          <StepWorkoutFrequency
            value={quizData.workoutFrequency}
            onSelect={(value) => updateQuizData({ workoutFrequency: value })}
            onNext={() => startAnalysis()}
          />
        );
      case 8:
        return <StepAnalyzing startedAt={analysisStartedAt as number} />;
      case 9:
        if (!reportForDisplay) return null;
        if (!reportForDisplay.chartCurve?.length) {
          return (
            <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F6F7F9] px-6 text-center">
              <p className="max-w-sm text-sm text-[rgba(23,23,23,0.72)]">
                Your report data is incomplete. Start over to continue.
              </p>
              <button
                type="button"
                className="rounded-full bg-[#485AA3] px-6 py-3 text-sm font-semibold text-white"
                onClick={() => {
                  setPaywallOpen(false);
                  resetAll();
                }}
              >
                Start over
              </button>
            </section>
          );
        }
        return (
          <StepReport
            report={reportForDisplay}
            unit={quizData.unit}
            onOpenPaywall={() => setPaywallOpen(true)}
          />
        );
      default:
        return (
          <div className="mx-auto max-w-[552px] space-y-4 px-4 py-12 text-center">
            <p className="text-base text-[rgba(23,23,23,0.72)]">
              Something went wrong with your session. We moved you to a safe step.
            </p>
            <button
              type="button"
              className="rounded-full bg-[#485AA3] px-6 py-3 text-sm font-semibold text-white"
              onClick={() => setCurrentStep(1)}
            >
              Back to start
            </button>
          </div>
        );
    }
  }, [
    analysisStartedAt,
    currentStep,
    quizData,
    reportForDisplay,
    resetAll,
    scheduleStepChange,
    setCurrentStep,
    startAnalysis,
    updateQuizData,
  ]);

  if (!hasHydrated) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const isAnalyzingStep = currentStep === 8;
  const isReportStep = currentStep === 9;
  const canGoBack = currentStep > 1 && !isAnalyzingStep;
  const handleBack = () => {
    if (currentStep <= 1 || isAnalyzingStep) return;
    if (currentStep === 9) {
      setCurrentStep(7);
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  const stepTitleEn =
    currentStep <= 2
      ? "Basic info"
      : currentStep <= 6
        ? "Body data"
        : currentStep === 7
          ? "Activity"
          : currentStep === 8
            ? "Analyzing"
            : "Your plan";
  const displayStep = currentStep <= 2 ? 1 : currentStep <= 6 ? 2 : currentStep - 4;
  const progress =
    currentStep <= 2
      ? ((currentStep / 2) / 5) * 100
      : currentStep <= 6
        ? ((1 + (currentStep - 2) / 4) / 5) * 100
        : ((currentStep - 4) / 5) * 100;

  return (
    <div
      className={`relative min-h-screen bg-white max-sm:min-h-[100dvh] ${isAnalyzingStep ? "" : "pt-[88px]"}`}
    >
      {!isAnalyzingStep ? (
        <div
          className={`fixed inset-x-0 top-0 z-[111] h-[88px] bg-white px-4 sm:px-6 lg:px-[60px] ${isReportStep ? "" : "border-b border-[rgba(23,23,23,0.08)]"}`}
        >
          <TopNav
            onBack={handleBack}
            showBack={canGoBack}
            title={stepTitleEn}
            currentStep={displayStep}
            totalSteps={5}
            progress={progress}
            showProgress
          />
        </div>
      ) : null}

      <main
        className={`relative mx-auto w-full min-w-0 ${isAnalyzingStep ? "max-w-full" : isReportStep ? "max-w-5xl px-4 sm:px-6 lg:px-[60px]" : "mt-6 max-w-[552px] px-4 sm:px-0"
          }`}
      >
        <div key={currentStep}>{stepContent}</div>
      </main>

      <SubscriptionModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
