"use client";

import { AnimatePresence } from "framer-motion";

export default function MotionLayout({ children }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
