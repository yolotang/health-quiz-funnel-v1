"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { kgToLb } from "@/lib/units";
import type { ReportData, UnitSystem } from "@/types/quiz";

interface StepReportProps {
  report: ReportData;
  unit: UnitSystem;
  onOpenPaywall: () => void;
  onRestart: () => void;
}

function formatWeight(kg: number, unit: UnitSystem): string {
  if (unit === "metric") {
    return `${kg.toFixed(1)} kg`;
  }
  return `${kgToLb(kg).toFixed(1)} lbs`;
}

export function StepReport({ report, unit, onOpenPaywall, onRestart }: StepReportProps) {
  const dotGlowId = `reportGoalDotGlow-${useId().replace(/:/g, "")}`;
  const [goalAnchor, setGoalAnchor] = useState<{ cx: number; cy: number } | null>(null);

  const curve = report.chartCurve ?? [];

  const lastKg = curve[curve.length - 1]?.weightKg ?? 0;
  const firstKg = curve[0]?.weightKg ?? 0;
  const isLoss = firstKg > lastKg;

  const series = curve.map((row) => ({
    atMs: row.atMs,
    weight: unit === "metric" ? row.weightKg : Number(kgToLb(row.weightKg).toFixed(1)),
  }));

  const startMs = series[0]?.atMs ?? 0;
  const endMs = series[series.length - 1]?.atMs ?? 0;

  const strokeGradientId = isLoss ? "reportStrokeLoss" : "reportStrokeGain";

  const targetDateEnglish =
    curve.length > 0
      ? new Date(curve[curve.length - 1]!.atMs).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
      : report.targetDateLabel;

  return (
    <section className="relative min-h-screen bg-white pb-[calc(90px+env(safe-area-inset-bottom,0px))] text-[#171717]">
      <div className="mx-auto w-full max-w-lg px-5 pt-6 sm:max-w-xl sm:px-6 sm:pt-8">
        <div className="text-center">
          <h1 className="text-[1.25rem] font-semibold leading-snug tracking-tight text-[#171717] sm:text-[1.375rem] md:text-[1.75rem]">
            The last plan you&apos;ll ever need to get in shape
          </h1>
          <p className="mt-5 text-[20px] text-[rgba(23,23,23,0.72)]">We predict you&apos;ll be</p>
          <p className="mt-1 flex flex-wrap items-baseline justify-center gap-x-2 font-semibold tracking-[-0.02em]">
            <span className="text-[24px] text-[#485AA3]">{formatWeight(lastKg, unit)}</span>
            <span className="text-[20px] font-normal text-[rgba(23,23,23,0.72)]">by</span>
            <span className="text-[24px] text-[#485AA3]">{targetDateEnglish}*</span>
          </p>

          <div
            className="step-report-chart relative mt-8 w-full rounded-2xl bg-neutral-100 px-2 py-4 sm:px-3 sm:py-5"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="relative h-[260px] min-h-[260px] w-full min-w-0 sm:h-[280px] sm:min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={260} className="outline-none">
                <AreaChart
                  accessibilityLayer={false}
                  data={series}
                  margin={{ top: 28, right: 4, bottom: 22, left: 0 }}
                >
                  <defs>
                    <filter id={dotGlowId} x="-80%" y="-80%" width="260%" height="260%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#171717" floodOpacity="0.14" />
                    </filter>
                    <linearGradient id="reportStrokeLoss" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="32%" stopColor="#f97316" />
                      <stop offset="66%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    <linearGradient id="reportStrokeGain" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="45%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#485AA3" />
                    </linearGradient>
                    <linearGradient id="reportAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(23, 23, 23, 0.08)" />
                      <stop offset="70%" stopColor="rgba(23, 23, 23, 0.03)" />
                      <stop offset="100%" stopColor="rgba(245, 245, 245, 0)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(23,23,23,0.05)" vertical={false} strokeDasharray="3 6" />
                  <XAxis
                    type="number"
                    dataKey="atMs"
                    domain={[startMs, endMs]}
                    scale="time"
                    ticks={[startMs, endMs]}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    minTickGap={0}
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    tick={(props) => {
                      const x = Number(props.x);
                      const y = Number(props.y);
                      const raw = props.payload?.value;
                      if (raw == null || !Number.isFinite(x) || !Number.isFinite(y)) {
                        return null;
                      }
                      const label = new Date(raw).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                      const idx = props.index ?? 0;
                      const total = props.visibleTicksCount ?? 2;
                      const isFirst = idx === 0;
                      const isLast = idx === total - 1;
                      return (
                        <text
                          x={x}
                          y={y}
                          dy={12}
                          textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
                          fill="rgba(23,23,23,0.5)"
                          fontSize={12}
                          fontWeight={500}
                        >
                          {label}
                        </text>
                      );
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={36}
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tick={{
                      fontSize: 12,
                      fill: "rgba(23,23,23,0.5)",
                      fontWeight: 500,
                    }}
                    tickFormatter={(v) => String(Math.round(Number(v)))}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke={`url(#${strokeGradientId})`}
                    strokeWidth={3.5}
                    fill="url(#reportAreaFill)"
                    fillOpacity={1}
                    dot={(dotProps) => {
                      if (dotProps.index !== series.length - 1) {
                        return null;
                      }
                      const cx = dotProps.cx;
                      const cy = dotProps.cy;
                      if (cx == null || cy == null) {
                        return null;
                      }
                      queueMicrotask(() => {
                        setGoalAnchor((prev) =>
                          prev && Math.abs(prev.cx - cx) < 0.5 && Math.abs(prev.cy - cy) < 0.5
                            ? prev
                            : { cx, cy },
                        );
                      });
                      return (
                        <circle cx={cx} cy={cy} r={7} fill="#ffffff" filter={`url(#${dotGlowId})`} />
                      );
                    }}
                    activeDot={false}
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>

              {goalAnchor ? (
                <div
                  className="pointer-events-none absolute z-10 w-max max-w-[min(200px,85vw)]"
                  style={{
                    left: goalAnchor.cx,
                    top: goalAnchor.cy,
                    transform: "translate(-50%, calc(-100% - 16px))",
                  }}
                >
                  <div className="relative rounded-[10px] bg-[#485AA3] px-3.5 pb-2.5 pt-2 text-center shadow-[0_8px_24px_-12px_rgba(23,23,23,0.35)]">
                    <p className="text-[14px] font-medium leading-tight text-white">Goal</p>
                    <p className="mt-0.5 text-[14px] font-medium leading-tight tracking-tight text-white">
                      {formatWeight(lastKg, unit)}
                    </p>
                    <span
                      className="absolute left-1/2 top-full -translate-x-1/2 border-x-[7px] border-t-[8px] border-x-transparent border-t-[#485AA3]"
                      aria-hidden
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-4 w-full max-w-none text-left text-[12px] leading-relaxed text-[rgba(23,23,23,0.5)]">
            *Based on the data of users who log their progress in the app. Consult your physician first. The chart is a non-customized illustration and results may vary
          </p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 flex h-[calc(90px+env(safe-area-inset-bottom,0px))] items-center border-t border-[rgba(23,23,23,0.12)] bg-white px-4 shadow-[0_-4px_24px_-12px_rgba(23,23,23,0.06)]">
        <div className="mx-auto grid w-full max-w-lg grid-cols-[minmax(0,4.5rem)_1fr_minmax(0,4.5rem)] items-center gap-2 sm:max-w-xl">
          <button
            type="button"
            className="justify-self-start rounded-full px-1 py-2 text-left text-sm text-[rgba(23,23,23,0.45)] transition hover:text-[rgba(23,23,23,0.65)]"
            onClick={onRestart}
          >
            Restart
          </button>
          <button
            type="button"
            onClick={onOpenPaywall}
            className="justify-self-center w-max rounded-full bg-[#485AA3] px-10 py-2.5 text-[17px] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-[#3f4f92] active:scale-[0.98]"
          >
            Continue
          </button>
          <span className="min-w-0" aria-hidden />
        </div>
      </div>
    </section>
  );
}
