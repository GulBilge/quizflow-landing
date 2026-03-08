"use client";

import React from "react";
import { motion } from "framer-motion";

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
}

export const Sparkline = ({ data, width = 120, height = 40, color = "#4f46e5" }: SparklineProps) => {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data, 100);
    const min = 0;
    const range = max - min;

    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / range) * height
    }));

    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <defs>
                <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={`${pathD} L ${width},${height} L 0,${height} Z`}
                fill="url(#sparkGradient)"
                stroke="none"
            />
            <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="3"
                fill={color}
                stroke="white"
                strokeWidth="1.5"
            />
        </svg>
    );
};

interface ProgressCircleProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export const ProgressCircle = ({
    percentage,
    size = 60,
    strokeWidth = 6,
    color = "#4f46e5"
}: ProgressCircleProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute text-[10px] font-black text-slate-900 dark:text-white">
                %{Math.round(percentage)}
            </span>
        </div>
    );
};

interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    height?: number;
}

export const MiniBarChart = ({ data, height = 60 }: BarChartProps) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="flex items-end gap-1.5 h-[60px] px-1">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.value / maxVal) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "backOut" }}
                        className="w-full rounded-t-sm"
                        style={{ backgroundColor: item.color || "#4f46e5" }}
                    />
                    <div className="absolute -top-6 bg-slate-900 text-white text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {item.label}: {item.value}
                    </div>
                </div>
            ))}
        </div>
    );
};
