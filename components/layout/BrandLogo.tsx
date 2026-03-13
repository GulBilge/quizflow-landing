import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface BrandLogoProps {
    size?: number;
    className?: string;
    showText?: boolean;
    textColor?: string;
    rounded?: string;
}

export default function BrandLogo({
    size = 24,
    className,
    showText = false,
    textColor = "text-slate-900",
    rounded = "rounded-lg"
}: BrandLogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div 
                className={cn(
                    "relative overflow-hidden shrink-0 flex items-center justify-center",
                    rounded
                )}
                style={{ 
                    width: size, 
                    height: size,
                    backgroundColor: 'rgb(44 63 113)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                }}
            >
                <img 
                    src="/webicon.jpg" 
                    alt="Quizyen Logo" 
                    className="w-full h-full object-cover"
                    style={{ transform: 'scale(0.85)' }}
                />
            </div>
            {showText && (
                <span className={cn("font-bold tracking-tight", textColor)} style={{ fontSize: size * 0.8 }}>
                    Quizyen
                </span>
            )}
        </div>
    );
}
