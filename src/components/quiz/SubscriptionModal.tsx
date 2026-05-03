"use client";

import { CheckOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type SubscriptionPlanId = "monthly" | "annual";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ open, onClose }: SubscriptionModalProps) {
  const [plan, setPlan] = useState<SubscriptionPlanId>("monthly");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[160] flex items-center justify-center bg-[rgba(23,23,23,0.45)] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 14, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[min(90dvh,720px)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-[rgba(23,23,23,0.08)] bg-white p-6 shadow-[0_24px_48px_-12px_rgba(23,23,23,0.18)]"
          >
            <h3 className="text-xl font-semibold tracking-tight text-[#171717]">Unlock your full plan</h3>
            <p className="mt-2 text-sm leading-relaxed text-[rgba(23,23,23,0.56)]">
              Personalized workouts, nutrition tips, and weekly check-ins to keep you on track.
            </p>

            <div className="mt-5 space-y-3" role="radiogroup" aria-label="Choose billing">
              <motion.button
                type="button"
                role="radio"
                aria-checked={plan === "monthly"}
                whileTap={{ scale: 0.99 }}
                onClick={() => setPlan("monthly")}
                className={`flex w-full items-start justify-between gap-4 rounded-3xl border px-5 py-4 text-left shadow-sm transition-all duration-200 ${plan === "monthly"
                  ? "border-[#485AA3] bg-[#EFF1F4]"
                  : "border-[rgba(23,23,23,0.07)] bg-transparent hover:border-[rgba(23,23,23,0.12)]"
                  }`}
              >
                <div>
                  <p className="text-sm font-semibold text-[#485AA3]">Best value</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-[#171717]">
                    $19.99<span className="text-base font-medium text-[rgba(23,23,23,0.45)]"> / mo</span>
                  </p>
                  <p className="mt-1 text-xs text-[rgba(23,23,23,0.45)]">Billed monthly · cancel anytime</p>
                </div>
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-base transition-colors ${plan === "monthly"
                    ? "border-[#485AA3] bg-[#485AA3] text-white"
                    : "border-[rgba(23,23,23,0.28)] bg-white text-transparent"
                    }`}
                  aria-hidden
                >
                  {plan === "monthly" ? <CheckOutlined /> : null}
                </span>
              </motion.button>

              <motion.button
                type="button"
                role="radio"
                aria-checked={plan === "annual"}
                whileTap={{ scale: 0.99 }}
                onClick={() => setPlan("annual")}
                className={`flex w-full items-start justify-between gap-4 rounded-3xl border px-5 py-4 text-left shadow-sm transition-all duration-200 ${plan === "annual"
                  ? "border-[#485AA3] bg-[#EFF1F4]"
                  : "border-[rgba(23,23,23,0.07)] bg-transparent hover:border-[rgba(23,23,23,0.12)]"
                  }`}
              >
                <div>
                  <p className="text-sm font-semibold text-[#171717]">Billed annually</p>
                  <p className="mt-1 text-lg font-bold tabular-nums tracking-tight text-[#171717]">
                    $12.50<span className="text-base font-medium text-[rgba(23,23,23,0.45)]"> / mo</span>
                  </p>
                  <p className="mt-1 text-xs text-[rgba(23,23,23,0.45)]">$150 billed once per year</p>
                </div>
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-base transition-colors ${plan === "annual"
                    ? "border-[#485AA3] bg-[#485AA3] text-white"
                    : "border-[rgba(23,23,23,0.28)] bg-white text-transparent"
                    }`}
                  aria-hidden
                >
                  {plan === "annual" ? <CheckOutlined /> : null}
                </span>
              </motion.button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-[rgba(23,23,23,0.12)] bg-white px-5 py-4 text-sm font-semibold text-[rgba(23,23,23,0.72)] transition hover:bg-[rgba(23,23,23,0.04)]"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label={
                  plan === "monthly" ? "Continue with monthly plan" : "Continue with annual plan"
                }
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl px-5 py-3.5 text-[17px] font-semibold text-white transition-all duration-300 bg-[#485AA3] shadow-lg shadow-[rgba(72,90,163,0.35)] hover:-translate-y-0.5 hover:bg-[#3f4f92] active:translate-y-0"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
