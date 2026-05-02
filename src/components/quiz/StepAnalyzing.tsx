"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Crunching your BMI...",
  "Estimating how fast you can reach your goal...",
  "Building your personalized path...",
  "Polishing your results...",
];

const DURATION_MS = 3500;
const RING_SIZE = 168;
const STROKE = 10;
const R = (RING_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

interface StepAnalyzingProps {
  startedAt: number;
}

export function StepAnalyzing({ startedAt }: StepAnalyzingProps) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentElapsed = Date.now() - startedAt;
      const next = Math.min(100, (currentElapsed / DURATION_MS) * 100);
      setProgress(next);
    }, 50);
    return () => window.clearInterval(interval);
  }, [startedAt]);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 900);
    return () => window.clearInterval(ticker);
  }, []);

  const pct = Math.round(progress);
  const dashOffset = CIRC - (progress / 100) * CIRC;

  return (
    <section className="fixed inset-0 z-[100] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 text-center text-[#171717]">
      {/* 全屏柔和背景动画 */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute -left-1/4 top-0 h-[70vmin] w-[70vmin] rounded-full bg-[#485AA3]/[0.06] blur-3xl"
          animate={{ x: [0, 24, 0], y: [0, 16, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-1/4 bottom-0 h-[60vmin] w-[60vmin] rounded-full bg-sky-400/[0.07] blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -12, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-[1] w-full max-w-sm"
      >
        <p className="text-xs font-medium tracking-[0.12em] text-[rgba(23,23,23,0.45)]">
          ANALYZING
        </p>
        <h2 className="mt-2 text-[1.375rem] font-semibold leading-snug tracking-tight text-[#171717] sm:text-2xl">
          Hang tight
        </h2>
        <p className="mt-1.5 text-[13px] text-[rgba(23,23,23,0.5)]">
          We&apos;re preparing your personalized report
        </p>

        <div className="relative mx-auto mt-10 flex h-[200px] w-[200px] items-center justify-center">
          {/* 外圈缓慢旋转装饰 */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-[rgba(72,90,163,0.2)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            aria-hidden
          />
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            className="-rotate-90"
            aria-hidden
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R}
              fill="none"
              stroke="rgba(23,23,23,0.08)"
              strokeWidth={STROKE}
            />
            <motion.circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R}
              fill="none"
              stroke="url(#analyzingRingGrad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.08, ease: "linear" }}
            />
            <defs>
              <linearGradient id="analyzingRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#485AA3" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[2rem] font-semibold tabular-nums tracking-tight text-[#485AA3]">
              {pct}
              <span className="text-lg font-semibold text-[rgba(72,90,163,0.75)]">%</span>
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={messages[index]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="mt-8 min-h-[1.5rem] text-sm text-[rgba(23,23,23,0.62)]"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
