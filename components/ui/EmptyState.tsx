"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-[#E8DED5] bg-white p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
    >
      <h3 className="font-serif text-2xl text-[#4B3326]">
        {title}
      </h3>

      <p className="mt-3 max-w-md mx-auto text-sm leading-relaxed text-[#8D7768]">
        {description}
      </p>
    </motion.div>
  );
}