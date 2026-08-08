"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Land = {
  id: string;
  title: string;
  location: string;
  area: string;
  land_type: string;

  latitude: number;
  longitude: number;

  width: number | null;
  depth: number | null;

  best_use: string | null;
  suitability_score: number | null;

  estimated_revenue: string | null;
  estimated_value: string | null;
  price_per_acre: string | null;

  highway_distance: string | null;
  city_distance: string | null;

  road_access: string | null;

  electricity: boolean;
  water: boolean;
  internet: boolean;

  terrain: string | null;
  soil: string | null;
  development_density: string | null;
  solar_exposure: string | null;

  verified: boolean;
  verification_level: string | null;

  highlights: string[] | null;

  use_scores: {
    warehouse?: number;
    solarFarm?: number;
    commercial?: number;
    agriculture?: number;
  } | null;

  created_at: string;
};

export default function LandDetailsPage() {
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [land, setLand] =
    useState<Land | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!id) return;

    loadLand();
  }, [id]);

  async function loadLand() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `/api/lands/${encodeURIComponent(id)}`
        );

      const result =
        await response.json();

      console.log(
        "LAND DETAILS:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Land not found."
        );
      }

      setLand(
        result?.data ?? null
      );

    } catch (error) {
      console.error(
        "LAND DETAILS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load property."
      );

    } finally {
      setLoading(false);
    }
  }

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070908] text-white">

        <div className="text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border border-white/10 border-t-white" />

          <p className="mt-5 text-[9px] uppercase tracking-[0.25em] text-white/30">
            Loading property
          </p>

        </div>

      </main>
    );
  }

  /* ========================================================
     ERROR
  ======================================================== */

  if (error || !land) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070908] px-5 text-white">

        <div className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-white/[0.025] p-10 text-center">

          <div className="text-[9px] uppercase tracking-[0.3em] text-red-300/40">
            Property unavailable
          </div>

          <h1 className="mt-5 text-3xl font-light">
            Land not found
          </h1>

          <p className="mt-4 text-xs leading-6 text-white/30">
            {error ||
              "This property could not be found."}
          </p>

          <Link
            href="/dashboard/owner/properties"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-[8px] uppercase tracking-[0.2em] text-black"
          >
            Back to properties
          </Link>

        </div>

      </main>
    );
  }

  /* ========================================================
     MAIN
  ======================================================== */

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070908]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1300px] items-center justify-between px-5">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10">
              B
            </div>

            <div>

              <div className="text-[12px] tracking-[0.28em]">
                BHOOMISETU
              </div>

              <div className="mt-1 text-[7px] uppercase tracking-[0.3em] text-white/20">
                Land Intelligence
              </div>

            </div>

          </Link>

          <Link
            href="/dashboard/owner/properties"
            className="rounded-full border border-white/10 px-5 py-2.5 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-white/20 hover:text-white"
          >
            ← My Properties
          </Link>

        </div>

      </header>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="mx-auto max-w-[1300px] px-5 py-10 sm:py-14">

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
              Land intelligence
            </div>

            <h1 className="mt-4 text-4xl font-light tracking-[-0.05em] sm:text-6xl">
              {land.title}
            </h1>

            <p className="mt-4 text-xs text-white/30">
              {land.location}
            </p>

          </div>

          <div>

            <span
              className={`rounded-full border px-4 py-2 text-[8px] uppercase tracking-[0.18em] ${
                land.verified
                  ? "border-emerald-200/20 bg-emerald-200/[0.05] text-emerald-200/70"
                  : "border-amber-200/15 bg-amber-200/[0.04] text-amber-200/60"
              }`}
            >
              {land.verified
                ? "Verified"
                : land.verification_level ||
                  "Pending Verification"}
            </span>

          </div>

        </div>

        {/* =================================================
            MAP / LOCATION
        ================================================= */}

        <section className="mt-10 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">

          <div className="relative h-[360px] overflow-hidden bg-gradient-to-br from-[#101513] via-[#0b0e0d] to-[#070908]">

            {/* Grid */}

            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize:
                  "45px 45px",
              }}
            />

            {/* Circles */}

            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

            {/* Location marker */}

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

              <div className="relative">

                <div className="absolute -inset-5 animate-ping rounded-full border border-emerald-200/20" />

                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200/30 bg-emerald-200/[0.08]">

                  <div className="h-3 w-3 rounded-full bg-emerald-200" />

                </div>

              </div>

            </div>

            {/* Coordinates */}

            <div className="absolute bottom-6 left-6">

              <div className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                Coordinates
              </div>

              <div className="mt-2 text-xs text-white/50">
                {land.latitude.toFixed(6)}
                {" , "}
                {land.longitude.toFixed(6)}
              </div>

            </div>

            <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[7px] uppercase tracking-[0.18em] text-white/30">
              Property location
            </div>

          </div>

        </section>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            label="Land area"
            value={land.area}
          />

          <Stat
            label="Land type"
            value={
              land.land_type
            }
          />

          <Stat
            label="Suitability"
            value={
              land.suitability_score !==
              null
                ? `${land.suitability_score}/100`
                : "Pending"
            }
          />

          <Stat
            label="Best use"
            value={
              land.best_use ||
              "Pending"
            }
          />

        </div>

        {/* =================================================
            INTELLIGENCE
        ================================================= */}

        <div className="mt-8 grid gap-5 lg:grid-cols-2">

          {/* VALUATION */}

          <Panel title="Valuation">

            <InfoRow
              label="Estimated value"
              value={
                land.estimated_value ||
                "Pending analysis"
              }
            />

            <InfoRow
              label="Price / acre"
              value={
                land.price_per_acre ||
                "Pending analysis"
              }
            />

            <InfoRow
              label="Estimated revenue"
              value={
                land.estimated_revenue ||
                "Pending analysis"
              }
            />

          </Panel>

          {/* LOCATION */}

          <Panel title="Location intelligence">

            <InfoRow
              label="Highway distance"
              value={
                land.highway_distance ||
                "Unknown"
              }
            />

            <InfoRow
              label="City distance"
              value={
                land.city_distance ||
                "Unknown"
              }
            />

            <InfoRow
              label="Road access"
              value={
                land.road_access ||
                "Unknown"
              }
            />

          </Panel>

        </div>

        {/* =================================================
            PHYSICAL
        ================================================= */}

        <div className="mt-5">

          <Panel title="Physical characteristics">

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <MiniCard
                label="Terrain"
                value={
                  land.terrain ||
                  "Pending"
                }
              />

              <MiniCard
                label="Soil"
                value={
                  land.soil ||
                  "Pending"
                }
              />

              <MiniCard
                label="Solar exposure"
                value={
                  land.solar_exposure ||
                  "Pending"
                }
              />

              <MiniCard
                label="Development density"
                value={
                  land.development_density ||
                  "Pending"
                }
              />

            </div>

          </Panel>

        </div>

        {/* =================================================
            INFRASTRUCTURE
        ================================================= */}

        <div className="mt-5">

          <Panel title="Infrastructure">

            <div className="grid gap-4 sm:grid-cols-3">

              <Infrastructure
                title="Electricity"
                active={
                  land.electricity
                }
              />

              <Infrastructure
                title="Water"
                active={
                  land.water
                }
              />

              <Infrastructure
                title="Internet"
                active={
                  land.internet
                }
              />

            </div>

          </Panel>

        </div>

        {/* =================================================
            USE SCORES
        ================================================= */}

        {land.use_scores && (
          <div className="mt-5">

            <Panel title="Potential use">

              <div className="space-y-4">

                <Score
                  label="Warehouse"
                  value={
                    land.use_scores
                      .warehouse ??
                    0
                  }
                />

                <Score
                  label="Solar Farm"
                  value={
                    land.use_scores
                      .solarFarm ??
                    0
                  }
                />

                <Score
                  label="Commercial"
                  value={
                    land.use_scores
                      .commercial ??
                    0
                  }
                />

                <Score
                  label="Agriculture"
                  value={
                    land.use_scores
                      .agriculture ??
                    0
                  }
                />

              </div>

            </Panel>

          </div>
        )}

        {/* =================================================
            HIGHLIGHTS
        ================================================= */}

        {land.highlights &&
          land.highlights.length > 0 && (
            <div className="mt-5">

              <Panel title="Highlights">

                <div className="flex flex-wrap gap-2">

                  {land.highlights.map(
                    (highlight, index) => (
                      <span
                        key={`${highlight}-${index}`}
                        className="rounded-full border border-white/[0.08] px-4 py-2 text-[8px] uppercase tracking-[0.14em] text-white/40"
                      >
                        {highlight}
                      </span>
                    )
                  )}

                </div>

              </Panel>

            </div>
          )}

        {/* =================================================
            ID
        ================================================= */}

        <div className="mt-8 border-t border-white/[0.06] pt-6">

          <div className="text-[7px] uppercase tracking-[0.2em] text-white/15">
            Property ID
          </div>

          <div className="mt-2 font-mono text-[9px] text-white/25">
            {land.id}
          </div>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   STAT
========================================================= */

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

      <div className="text-[7px] uppercase tracking-[0.2em] text-white/20">
        {label}
      </div>

      <div className="mt-3 truncate text-lg font-light text-white/70">
        {value}
      </div>

    </div>
  );
}


/* =========================================================
   PANEL
========================================================= */

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

      <h2 className="mb-6 text-[9px] uppercase tracking-[0.22em] text-white/30">
        {title}
      </h2>

      {children}

    </section>
  );
}


/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/[0.05] py-4 last:border-0">

      <span className="text-xs text-white/25">
        {label}
      </span>

      <span className="text-right text-xs text-white/60">
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   MINI CARD
========================================================= */

function MiniCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

      <div className="text-[7px] uppercase tracking-[0.16em] text-white/20">
        {label}
      </div>

      <div className="mt-2 text-xs text-white/50">
        {value}
      </div>

    </div>
  );
}


/* =========================================================
   INFRASTRUCTURE
========================================================= */

function Infrastructure({
  title,
  active,
}: {
  title: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

      <span className="text-xs text-white/40">
        {title}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-[7px] uppercase tracking-[0.15em] ${
          active
            ? "border border-emerald-200/20 bg-emerald-200/[0.05] text-emerald-200/60"
            : "border border-white/[0.06] text-white/20"
        }`}
      >
        {active
          ? "Available"
          : "Not available"}
      </span>

    </div>
  );
}


/* =========================================================
   SCORE
========================================================= */

function Score({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, value)
  );

  return (
    <div>

      <div className="flex justify-between">

        <span className="text-xs text-white/40">
          {label}
        </span>

        <span className="text-xs text-white/50">
          {safeValue}/100
        </span>

      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className="h-full rounded-full bg-white/40 transition-all"
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>
  );
}