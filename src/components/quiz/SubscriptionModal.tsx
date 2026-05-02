"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PrimaryButton } from "@/components/common/PrimaryButton";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ open, onClose }: SubscriptionModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[160] flex items-end justify-center bg-slate-950/55 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[min(90dvh,720px)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl bg-white p-6"
          >
            <h3 className="text-xl font-semibold text-slate-900">Unlock your full plan</h3>
            <p className="mt-2 text-sm text-slate-500">
              Personalized workouts, nutrition tips, and weekly check-ins to keep you on track.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="text-sm font-medium text-indigo-700">Best value</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  $19.99<span className="text-base font-medium text-slate-500"> / mo</span>
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Billed annually</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">$12.50 / mo</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Not now
              </button>
              <PrimaryButton onClick={onClose}>Continue</PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
