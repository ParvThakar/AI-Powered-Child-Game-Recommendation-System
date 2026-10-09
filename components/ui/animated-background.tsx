"use client";

import React from "react";
import MicroSlats from "./MicroSlats";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <MicroSlats
        preset="swell"
        color="#A855F7"
        glintColor="#ffffff"
        backgroundColor="#000000"
        slatWidth={7}
        slatHeight={25}
        gap={3}
        roundness={0.75}
        interactive
        cursorStrength={1}
        cursorSize={40}
        swirl={0}
        trail={1.4}
        lean={0}
      />
    </div>
  );
}
