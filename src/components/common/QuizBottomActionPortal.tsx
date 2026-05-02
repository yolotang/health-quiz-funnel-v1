"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders fixed bottom UI into document.body so it is not trapped inside a
 * transformed ancestor (e.g. Framer Motion step transitions), which would
 * make `position: fixed` behave like absolute and “jump” during animations.
 */
export function QuizBottomActionPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
