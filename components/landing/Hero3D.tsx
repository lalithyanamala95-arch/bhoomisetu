"use client";

import dynamic from "next/dynamic";

const LandingTerrain = dynamic(
  () => import("./LandingTerrain"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#070908]">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border border-white/10 border-t-white/60" />

          <div className="mt-4 text-[8px] uppercase tracking-[0.3em] text-white/20">
            Initializing spatial world
          </div>
        </div>
      </div>
    ),
  }
);

export default function Hero3D() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 3D WORLD */}

      <div className="absolute inset-0">
        <LandingTerrain />
      </div>

      {/* DARK CINEMATIC OVERLAY */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at 55% 45%,
              transparent 0%,
              rgba(7,9,8,0.05) 35%,
              rgba(7,9,8,0.55) 78%,
              rgba(7,9,8,0.92) 100%
            )
          `,
        }}
      />

      {/* TOP FADE */}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "linear-gradient(to bottom, #070908 0%, transparent 100%)",
        }}
      />

      {/* BOTTOM FADE */}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
        style={{
          background:
            "linear-gradient(to top, #070908 5%, transparent 100%)",
        }}
      />

      {/* SUBTLE GRID */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(ellipse at center, black, transparent 75%)",
        }}
      />
    </div>
  );
}