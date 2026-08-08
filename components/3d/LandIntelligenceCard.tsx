"use client";

import { ArrowRight, Check, MapPin, Sparkles } from "lucide-react";
import type { LandListing } from "../data/land-data";

type Props = {
  land: LandListing;
};

export default function LandIntelligenceCard({
  land,
}: Props) {
  return (
    <div className="w-[330px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F0C]/95 text-white shadow-2xl backdrop-blur-2xl">

      {/* Header */}
      <div className="border-b border-white/10 p-5">

        <div className="flex items-start justify-between gap-4">

          <div>
            <div className="mb-2 flex items-center gap-2">

              {land.verified && (
                <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[8px] uppercase tracking-[0.18em] text-white/60">
                  <Check size={9} />
                  Verified
                </span>
              )}

            </div>

            <h3 className="text-base font-medium tracking-tight">
              {land.title}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/40">
              <MapPin size={11} />
              {land.location}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-medium">
              {land.suitabilityScore}%
            </div>

            <div className="text-[8px] uppercase tracking-[0.18em] text-white/30">
              AI Score
            </div>
          </div>

        </div>

      </div>

      {/* Main intelligence */}
      <div className="p-5">

        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/35">
          <Sparkles size={11} />
          Best Use
        </div>

        <div className="mt-2 text-2xl font-medium tracking-tight">
          {land.bestUse}
        </div>

        {/* Score */}
        <div className="mt-5">

          <div className="mb-2 flex justify-between text-[9px]">
            <span className="text-white/35">
              Suitability
            </span>

            <span className="text-white/60">
              {land.suitabilityScore}%
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/75 transition-all"
              style={{
                width: `${land.suitabilityScore}%`,
              }}
            />
          </div>

        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-3">

          <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
            <div className="text-[8px] uppercase tracking-[0.15em] text-white/30">
              Area
            </div>

            <div className="mt-1 text-sm">
              {land.area}
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
            <div className="text-[8px] uppercase tracking-[0.15em] text-white/30">
              Est. Value
            </div>

            <div className="mt-1 text-sm">
              {land.estimatedValue}
            </div>
          </div>

        </div>

        {/* Revenue */}
        <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.025] p-3">

          <div className="text-[8px] uppercase tracking-[0.15em] text-white/30">
            Estimated Potential
          </div>

          <div className="mt-1 text-lg">
            {land.estimatedRevenue}
          </div>

          <div className="mt-1 text-[9px] text-white/30">
            AI-generated estimate
          </div>

        </div>

        {/* Highlights */}
        <div className="mt-5">

          <div className="mb-3 text-[8px] uppercase tracking-[0.18em] text-white/30">
            Why this land
          </div>

          <div className="space-y-2">

            {land.highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-2 text-[10px] text-white/55"
              >
                <span className="h-1 w-1 rounded-full bg-white/50" />
                {highlight}
              </div>
            ))}

          </div>

        </div>

        {/* CTA */}
        <button className="group mt-6 flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-xs font-medium text-black transition-transform hover:scale-[1.01]">

          View Land Intelligence

          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />

        </button>

      </div>

    </div>
  );
}