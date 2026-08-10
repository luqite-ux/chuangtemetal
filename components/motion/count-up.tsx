"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(reduceMotion ? value : 0);
  const rounded = useTransform(progress, (latest) => `${Math.round(latest).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(progress, value, { duration: 1.45, ease: "easeOut" });
    return controls.stop;
  }, [inView, progress, reduceMotion, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
