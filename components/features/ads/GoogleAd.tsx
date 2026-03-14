"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface GoogleAdProps {
    slot: string;
    format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
    responsive?: "true" | "false";
    style?: React.CSSProperties;
    className?: string;
    isPremium?: boolean;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function GoogleAd({
    slot,
    format = "auto",
    responsive = "true",
    style = { display: "block" },
    className = "",
    isPremium = false,
}: GoogleAdProps) {
    const [adLoaded, setAdLoaded] = useState(false);
    const [error, setError] = useState(false);
    const adRef = useRef<HTMLModElement>(null);
    const t = useTranslations("Common");

    useEffect(() => {
        if (isPremium) return;
        // Clear any previous error
        setError(false);

        const loadAd = () => {
            try {
                if (adRef.current) {
                    // AdSense script will consume this object when it loads
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    setAdLoaded(true);
                }
            } catch (err) {
                console.error("AdSense error:", err);
                setError(true);
            }
        };

        // Execution delayed slightly just to make sure the internal ad div renders first.
        const timeoutId = setTimeout(loadAd, 100);

        return () => clearTimeout(timeoutId);
    }, [slot, isPremium]); // Re-run if slot or isPremium changes

    if (isPremium) return null;

    return (
        <div className={`ad-container ${className} overflow-hidden min-h-[50px] transition-opacity duration-500 ${adLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-8863410308164779"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
            {error && (
                <div className="hidden">{t("ad_failed_to_load")}</div>
            )}
        </div>
    );
}
