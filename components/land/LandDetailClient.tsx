"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleCheck,
  Compass,
  Droplets,
  Factory,
  Gauge,
  Home,
  MapPin,
  Route,
  Sparkles,
  Sun,
  Wifi,
  Zap,
} from "lucide-react";

import type { LandListing } from "../data/land-data";

type Props = {
  land: LandListing;
};

/* =========================================================
   INTELLIGENCE HELPERS
========================================================= */

function getConnectivityScore(
  land: LandListing
) {
  const highway =
    parseFloat(
      land.highwayDistance
    );

  if (highway <= 2) return 95;
  if (highway <= 3) return 90;
  if (highway <= 5) return 80;
  return 70;
}

function getInfrastructureScore(
  land: LandListing
) {
  let score = 40;

  if (land.electricity) {
    score += 20;
  }

  if (land.water) {
    score += 20;
  }

  if (land.internet) {
    score += 20;
  }

  return Math.min(score, 100);
}

function getDevelopmentScore(
  land: LandListing
) {
  if (
    land.developmentDensity ===
    "Very low"
  ) {
    return 88;
  }

  if (
    land.developmentDensity ===
    "Low"
  ) {
    return 92;
  }

  if (
    land.developmentDensity ===
    "Medium"
  ) {
    return 84;
  }

  return 70;
}

function getTerrainScore(
  land: LandListing
) {
  if (
    land.terrain === "Flat"
  ) {
    return 94;
  }

  if (
    land.terrain ===
    "Gently rolling"
  ) {
    return 86;
  }

  return 78;
}

/* =========================================================
   SUITABILITY DATA
========================================================= */

const suitabilityMeta = [
  {
    key: "warehouse" as const,
    name: "Warehouse",
    icon: Factory,
  },
  {
    key: "solarFarm" as const,
    name: "Solar Farm",
    icon: Sun,
  },
  {
    key: "commercial" as const,
    name: "Commercial",
    icon: Home,
  },
  {
    key: "agriculture" as const,
    name: "Agriculture",
    icon: Droplets,
  },
];

/* =========================================================
   CONNECTIVITY DATA
========================================================= */

function ConnectivityItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Route;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/7 bg-white/[0.025] p-5">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/7 bg-white/[0.03]">
        <Icon
          size={16}
          className="text-white/40"
        />
      </div>

      <div className="mt-5 text-[9px] uppercase tracking-[0.15em] text-white/25">
        {label}
      </div>

      <div className="mt-2 text-sm text-white/75">
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function LandDetailClient({
  land,
}: Props) {
  const connectivityScore =
    getConnectivityScore(land);

  const infrastructureScore =
    getInfrastructureScore(land);

  const developmentScore =
    getDevelopmentScore(land);

  const terrainScore =
    getTerrainScore(land);

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      {/* =================================================
          NAVIGATION
      ================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#070908]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <span className="text-xs font-medium">
                B
              </span>
            </div>

            <span className="text-sm font-medium tracking-[0.3em]">
              BHOOMISETU
            </span>

          </Link>

          <Link
            href="/explore"
            className="flex items-center gap-2 text-xs text-white/45 transition hover:text-white"
          >
            <ArrowLeft size={14} />

            Back to explore
          </Link>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================== */}

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/25">

          <Link
            href="/explore"
            className="transition hover:text-white/60"
          >
            Explore
          </Link>

          <ChevronRight size={10} />

          <span>
            {land.location}
          </span>

          <ChevronRight size={10} />

          <span className="text-white/45">
            {land.id}
          </span>

        </div>

        {/* =================================================
            HERO
        ================================================== */}

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">

          {/* =================================================
              LAND VISUAL
          ================================================== */}

          <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-white/8 bg-[#0C110E]">

            {/* Atmospheric lighting */}

            <div className="absolute inset-0">

              <div className="absolute left-[8%] top-[10%] h-[400px] w-[400px] rounded-full bg-[#26382C]/40 blur-[100px]" />

              <div className="absolute bottom-[5%] right-[8%] h-[320px] w-[320px] rounded-full bg-[#17231C]/50 blur-[90px]" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#070908_95%)]" />

            </div>

            {/* Topographic visual */}

            <div className="absolute inset-0 opacity-20">

              <svg
                className="h-full w-full"
                viewBox="0 0 800 600"
                preserveAspectRatio="none"
              >

                <path
                  d="M-50 400 C100 290 170 470 320 330 S560 220 850 310"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M-50 430 C100 320 170 500 320 360 S560 250 850 340"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M-50 460 C100 350 170 530 320 390 S560 280 850 370"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M-50 490 C100 380 170 560 320 420 S560 310 850 400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M-50 520 C100 410 170 590 320 450 S560 340 850 430"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

              </svg>

            </div>

            {/* Parcel */}

            <div className="absolute left-1/2 top-1/2 h-[230px] w-[330px] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] border border-white/60 bg-white/[0.035] shadow-[0_0_100px_rgba(180,210,190,0.07)]">

              <div className="absolute inset-0 border border-white/10" />

              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.5)]" />

              <div className="absolute -right-3 top-1/2 h-1.5 w-1.5 rounded-full bg-white/70" />

              <div className="absolute -left-3 bottom-1/4 h-1.5 w-1.5 rounded-full bg-white/50" />

            </div>

            {/* Parcel ID */}

            <div className="absolute left-6 top-6">

              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/40">

                <Compass size={12} />

                Land analysis

              </div>

              <div className="mt-2 text-xs text-white/25">
                {land.id}
              </div>

            </div>

            {/* Verification */}

            {land.verified && (
              <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[9px] uppercase tracking-[0.15em] text-white/55 backdrop-blur-xl">

                <CircleCheck size={12} />

                {land.verificationLevel}

              </div>
            )}

            {/* Bottom information */}

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">

              <div>

                <div className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Location
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-white/75">

                  <MapPin size={14} />

                  {land.location}

                </div>

              </div>

              <div className="text-right">

                <div className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Land area
                </div>

                <div className="mt-2 text-sm text-white/75">
                  {land.area}
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              MAIN LAND SUMMARY
          ================================================== */}

          <div className="flex flex-col rounded-3xl border border-white/8 bg-[#0A0D0B] p-7 sm:p-9">

            <div className="flex items-center gap-2">

              <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                Land intelligence
              </span>

              {land.verified && (
                <Check
                  size={12}
                  className="text-white/50"
                />
              )}

            </div>

            <h1 className="mt-5 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              {land.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-xs text-white/35">

              <MapPin size={13} />

              {land.location}

            </div>

            <p className="mt-6 max-w-md text-sm leading-6 text-white/35">
              BhoomiSetu analyzes land characteristics,
              connectivity, infrastructure and potential
              uses to identify where the strongest
              opportunity may exist.
            </p>

            {/* Main score */}

            <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.025] p-5">

              <div className="flex items-end justify-between">

                <div>

                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/30">

                    <Sparkles size={12} />

                    Overall opportunity

                  </div>

                  <div className="mt-3 text-5xl font-medium tracking-[-0.05em]">
                    {land.suitabilityScore}%
                  </div>

                </div>

                <div className="text-right">

                  <div className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                    Recommended use
                  </div>

                  <div className="mt-2 text-sm text-white/70">
                    {land.bestUse}
                  </div>

                </div>

              </div>

              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/8">

                <div
                  className="h-full rounded-full bg-white/70"
                  style={{
                    width: `${land.suitabilityScore}%`,
                  }}
                />

              </div>

            </div>

            {/* Financial cards */}

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">

                <div className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                  Estimated value
                </div>

                <div className="mt-3 text-xl">
                  {land.estimatedValue}
                </div>

                <div className="mt-2 text-[9px] text-white/25">
                  {land.pricePerAcre}
                </div>

              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">

                <div className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                  Revenue potential
                </div>

                <div className="mt-3 text-xl">
                  {land.estimatedRevenue}
                </div>

              </div>

            </div>

            <button
              type="button"
              className="group mt-auto flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-sm font-medium text-black transition hover:scale-[1.01]"
            >
              Connect with landowner

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />

            </button>

          </div>

        </section>

        {/* =================================================
            AI EXPLANATION
        ================================================== */}

        <section className="mt-5 rounded-3xl border border-white/8 bg-[#0A0D0B] p-7 sm:p-9">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/30">

                <Sparkles size={12} />

                AI opportunity analysis

              </div>

              <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">
                Why this land?
              </h2>

              <p className="mt-3 max-w-xl text-xs leading-5 text-white/30">
                BhoomiSetu combines the available land
                characteristics into a simple opportunity
                profile. The score is designed to help
                compare potential uses, not replace
                professional due diligence.
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.025] px-4 py-2">

              <Gauge
                size={13}
                className="text-white/40"
              />

              <span className="text-[9px] uppercase tracking-[0.16em] text-white/35">
                Opportunity profile
              </span>

            </div>

          </div>

          {/* Intelligence factors */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-white/7 bg-white/[0.02] p-5">

              <Route
                size={17}
                className="text-white/40"
              />

              <div className="mt-5 flex items-end justify-between">

                <span className="text-xs text-white/50">
                  Connectivity
                </span>

                <span className="text-xl">
                  {connectivityScore}
                </span>

              </div>

              <div className="mt-3 h-1 rounded-full bg-white/8">

                <div
                  className="h-full rounded-full bg-white/55"
                  style={{
                    width: `${connectivityScore}%`,
                  }}
                />

              </div>

            </div>

            <div className="rounded-2xl border border-white/7 bg-white/[0.02] p-5">

              <Zap
                size={17}
                className="text-white/40"
              />

              <div className="mt-5 flex items-end justify-between">

                <span className="text-xs text-white/50">
                  Infrastructure
                </span>

                <span className="text-xl">
                  {infrastructureScore}
                </span>

              </div>

              <div className="mt-3 h-1 rounded-full bg-white/8">

                <div
                  className="h-full rounded-full bg-white/55"
                  style={{
                    width: `${infrastructureScore}%`,
                  }}
                />

              </div>

            </div>

            <div className="rounded-2xl border border-white/7 bg-white/[0.02] p-5">

              <Factory
                size={17}
                className="text-white/40"
              />

              <div className="mt-5 flex items-end justify-between">

                <span className="text-xs text-white/50">
                  Development
                </span>

                <span className="text-xl">
                  {developmentScore}
                </span>

              </div>

              <div className="mt-3 h-1 rounded-full bg-white/8">

                <div
                  className="h-full rounded-full bg-white/55"
                  style={{
                    width: `${developmentScore}%`,
                  }}
                />

              </div>

            </div>

            <div className="rounded-2xl border border-white/7 bg-white/[0.02] p-5">

              <Compass
                size={17}
                className="text-white/40"
              />

              <div className="mt-5 flex items-end justify-between">

                <span className="text-xs text-white/50">
                  Terrain
                </span>

                <span className="text-xl">
                  {terrainScore}
                </span>

              </div>

              <div className="mt-3 h-1 rounded-full bg-white/8">

                <div
                  className="h-full rounded-full bg-white/55"
                  style={{
                    width: `${terrainScore}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            BEST USE COMPARISON
        ================================================== */}

        <section className="mt-5 rounded-3xl border border-white/8 bg-[#0A0D0B] p-7 sm:p-9">

          <div>

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/30">

              <Sparkles size={12} />

              Land use comparison

            </div>

            <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">
              What could this land become?
            </h2>

          </div>

          <div className="mt-8 space-y-4">

            {suitabilityMeta.map(
              (item) => {
                const Icon =
                  item.icon;

                const score =
                  land.useScores[
                    item.key
                  ];

                const isBest =
                  item.name ===
                  land.bestUse;

                return (
                  <div
                    key={item.key}
                    className={`rounded-2xl border p-5 transition ${
                      isBest
                        ? "border-white/15 bg-white/[0.045]"
                        : "border-white/7 bg-white/[0.02]"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/7 bg-white/[0.03]">

                        <Icon
                          size={17}
                          className="text-white/45"
                        />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <span className="text-sm text-white/70">
                              {item.name}
                            </span>

                            {isBest && (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-white/45">
                                Recommended
                              </span>
                            )}

                          </div>

                          <span className="text-lg font-medium">
                            {score}%
                          </span>

                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7">

                          <div
                            className={`h-full rounded-full ${
                              isBest
                                ? "bg-white/75"
                                : "bg-white/35"
                            }`}
                            style={{
                              width: `${score}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* =================================================
            CONNECTIVITY
        ================================================== */}

        <section className="mt-5">

          <div className="rounded-3xl border border-white/8 bg-[#0A0D0B] p-7 sm:p-9">

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/30">

              <Route size={12} />

              Connectivity & infrastructure

            </div>

            <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">
              How connected is it?
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

              <ConnectivityItem
                icon={Route}
                label="Highway access"
                value={
                  land.highwayDistance
                }
              />

              <ConnectivityItem
                icon={MapPin}
                label="City centre"
                value={
                  land.cityDistance
                }
              />

              <ConnectivityItem
                icon={Route}
                label="Road access"
                value={
                  land.roadAccess
                }
              />

              <ConnectivityItem
                icon={Zap}
                label="Electricity"
                value={
                  land.electricity
                    ? "Available"
                    : "Unavailable"
                }
              />

            </div>

          </div>

        </section>

        {/* =================================================
            INFRASTRUCTURE
        ================================================== */}

        <section className="mt-5 rounded-3xl border border-white/8 bg-[#0A0D0B] p-7 sm:p-9">

          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/30">

            <CircleCheck size={12} />

            Infrastructure

          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">

            <div className="flex items-center gap-4 rounded-2xl border border-white/7 bg-white/[0.02] p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">

                <Zap
                  size={17}
                  className="text-white/45"
                />

              </div>

              <div>

                <div className="text-xs text-white/65">
                  Electricity
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/25">
                  {land.electricity
                    ? "Available"
                    : "Unavailable"}
                </div>

              </div>

            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/7 bg-white/[0.02] p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">

                <Droplets
                  size={17}
                  className="text-white/45"
                />

              </div>

              <div>

                <div className="text-xs text-white/65">
                  Water
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/25">
                  {land.water
                    ? "Available"
                    : "Unavailable"}
                </div>

              </div>

            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/7 bg-white/[0.02] p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">

                <Wifi
                  size={17}
                  className="text-white/45"
                />

              </div>

              <div>

                <div className="text-xs text-white/65">
                  Internet
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/25">
                  {land.internet
                    ? "Available"
                    : "Unavailable"}
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            LAND CHARACTERISTICS
        ================================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-2">

          <div className="rounded-3xl border border-white/8 bg-[#0A0D0B] p-7 sm:p-9">

            <div className="text-[9px] uppercase tracking-[0.25em] text-white/30">
              Land characteristics
            </div>

            <div className="mt-7 space-y-5">

              <div className="flex items-center justify-between border-b border-white/6 pb-5">

                <span className="text-xs text-white/35">
                  Terrain
                </span>

                <span className="text-xs text-white/70">
                  {land.terrain}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-white/6 pb-5">

                <span className="text-xs text-white/35">
                  Soil profile
                </span>

                <span className="text-xs text-white/70">
                  {land.soil}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-white/6 pb-5">

                <span className="text-xs text-white/35">
                  Development density
                </span>

                <span className="text-xs text-white/70">
                  {land.developmentDensity}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-xs text-white/35">
                  Solar exposure
                </span>

                <span className="text-xs text-white/70">
                  {land.solarExposure}
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              HIGHLIGHTS
          ================================================== */}

          <div className="rounded-3xl border border-white/8 bg-[#0A0D0B] p-7 sm:p-9">

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/30">

              <CircleCheck size={12} />

              Verified highlights

            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              {land.highlights.map(
                (highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.02] p-4"
                  >

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5">

                      <Check
                        size={13}
                        className="text-white/50"
                      />

                    </div>

                    <span className="text-xs text-white/50">
                      {highlight}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            DISCLAIMER
        ================================================== */}

        <div className="mt-6 rounded-2xl border border-white/6 bg-white/[0.015] p-5">

          <p className="text-[10px] leading-5 text-white/20">
            BhoomiSetu opportunity scores are
            informational estimates based on the
            currently available property data. They
            are not a substitute for legal verification,
            title checks, surveying, environmental
            assessment, financial advice or professional
            due diligence.
          </p>

        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <footer className="flex flex-col gap-4 py-10 text-[9px] uppercase tracking-[0.2em] text-white/20 sm:flex-row sm:items-center sm:justify-between">

          <span>
            BHOOMISETU · LAND INTELLIGENCE
          </span>

          <Link
            href="/explore"
            className="flex items-center gap-2 transition hover:text-white/50"
          >
            Explore more land

            <ArrowRight size={12} />

          </Link>

        </footer>

      </div>

    </main>
  );
}