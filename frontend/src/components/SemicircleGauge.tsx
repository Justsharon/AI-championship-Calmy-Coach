import React from "react";
import { motion } from "framer-motion";

interface Props {
  value: number /* 0..100 */;
  size?: number;
}

export const SemicircleGauge: React.FC<Props> = ({ value, size = 160 }) => {
  const radius = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const dash = (circumference * progress) / 100;

  return (
    <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
      <defs>
        <linearGradient id="g1" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* background arc */}
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${
          cx + radius
        } ${cy}`}
        stroke="#e6e9ef"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
      />

      {/* animated progress arc — using stroke-dasharray on path length */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress / 100 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${
          cx + radius
        } ${cy}`}
        stroke="url(#g1)"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
      />

      <text
        x={cx}
        y={cy - radius / 3}
        textAnchor="middle"
        fontSize={14}
        fill="#374151"
      >
        Confidence
      </text>
      <text
        x={cx}
        y={cy - radius / 10}
        textAnchor="middle"
        fontSize={20}
        fontWeight={700}
        fill="#111827"
      >
        {progress}%
      </text>
    </svg>
  );
};
