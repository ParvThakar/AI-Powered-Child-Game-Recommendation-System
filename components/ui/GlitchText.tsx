"use client";

import React from "react";
import "./GlitchText.css";

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

export function GlitchText({
  children,
  speed = 0.5,
  enableShadows = true,
  enableOnHover = false,
  className = "",
}: GlitchTextProps) {
  const inlineStyles: React.CSSProperties = {
    // @ts-expect-error custom css variables
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? "-2px 0 #ec4899" : "none",
    "--before-shadow": enableShadows ? "2px 0 #06b6d4" : "none",
  };

  const hoverClass = enableOnHover ? "enable-on-hover" : "";

  return (
    <span
      className={`glitch ${hoverClass} ${className}`}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </span>
  );
}

export default GlitchText;
