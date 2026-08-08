"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import type { LandListing } from "../data/land-data";

/* =========================================================
   GOOGLE MAP
========================================================= */

const GoogleLandMap = dynamic(
  () => import("../maps/GoogleLandMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[600px] items-center justify-center bg-[#080B09]">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/30">
          Loading spatial map...
        </div>
      </div>
    ),
  }
);

/* =========================================================
   TYPES
========================================================= */

type ApiResponse = {
  success: boolean;
  count?: number;
  data?: LandListing[];
  error?: string;
};

/* =========================================================
   EXPLORE CLIENT
========================================================= */

export default function ExploreClient() {
  /* =======================================================
     LAND DATA
  ======================================================== */

  const [lands, setLands] =
    useState<LandListing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     SELECTED LAND
  ======================================================== */

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  /* =======================================================
     SEARCH
  ======================================================== */

  const [search, setSearch] =
    useState("");

  /* =======================================================
     LAND TYPE FILTER
  ======================================================== */

  const [landType, setLandType] =
    useState("All");

  /* =======================================================
     LOAD LANDS
  ======================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadLands() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/lands",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `Failed to load land (${response.status})`
          );
        }

        const result =
          (await response.json()) as ApiResponse;

        if (!result.success) {
          throw new Error(
            result.error ||
              "Failed to load land"
          );
        }

        if (!cancelled) {
          setLands(
            Array.isArray(result.data)
              ? result.data
              : []
          );
        }
      } catch (err) {
        console.error(
          "Failed to load lands:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load land"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLands();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     LAND TYPES
  ======================================================== */

  const landTypes =
    useMemo(() => {
      const types = new Set<string>();

      lands.forEach(
        (land) => {
          if (land.landType) {
            types.add(
              land.landType
            );
          }
        }
      );

      return [
        "All",
        ...Array.from(types),
      ];
    }, [lands]);

  /* =======================================================
     FILTERED LANDS
  ======================================================== */

  const filteredLands =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return lands.filter(
        (land) => {
          const matchesSearch =
            !query ||
            land.title
              .toLowerCase()
              .includes(query) ||
            land.location
              .toLowerCase()
              .includes(query) ||
            land.bestUse
              .toLowerCase()
              .includes(query);

          const matchesType =
            landType === "All" ||
            land.landType ===
              landType;

          return (
            matchesSearch &&
            matchesType
          );
        }
      );
    }, [
      lands,
      search,
      landType,
    ]);

  /* =======================================================
     SELECTED LAND
  ======================================================== */

  const selectedLand =
    lands.find(
      (land) =>
        land.id ===
        selectedId
    ) ?? null;

  /* =======================================================
     MAP SELECTION
  ======================================================== */

  function handleLandSelect(
    landId: string
  ) {
    if (!landId) {
      setSelectedId(null);
      return;
    }

    setSelectedId(
      landId
    );
  }

  /* =======================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070908] text-white">

        <div className="flex min-h-screen items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-white/10 border-t-white/70" />

            <div className="mt-4 text-[9px] uppercase tracking-[0.25em] text-white/30">
              Loading land intelligence
            </div>

          </div>

        </div>

      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-[#070908] text-white">

        <div className="flex min-h-screen items-center justify-center p-6">

          <div className="max-w-md rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-6 text-center">

            <div className="text-sm text-red-200/70">
              Unable to load land data
            </div>

            <div className="mt-3 text-xs leading-5 text-white/35">
              {error}
            </div>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-xl border border-white/10 px-5 py-2.5 text-[9px] uppercase tracking-[0.18em] text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              Retry
            </button>

          </div>

        </div>

      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================== */

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-white/[0.06] bg-[#070908]/95">

        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-4 lg:px-8">

          {/* BRAND */}

          <div className="shrink-0">

            <div className="text-[10px] uppercase tracking-[0.3em] text-white/35">
              BHOOMISETU
            </div>

            <div className="mt-1 text-sm font-medium text-white/80">
              Land Intelligence
            </div>

          </div>

          {/* SEARCH */}

          <div className="hidden max-w-md flex-1 md:block">

            <div className="relative">

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search land, location or use..."
                className="w-full rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-white/15"
              />

            </div>

          </div>

          {/* STATUS */}

          <div className="hidden items-center gap-2 sm:flex">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />

            <span className="text-[8px] uppercase tracking-[0.18em] text-white/30">
              {lands.length} verified parcels
            </span>

          </div>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">

        {/* =================================================
            MOBILE SEARCH
        ================================================= */}

        <div className="mb-4 md:hidden">

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search land, location or use..."
            className="w-full rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs text-white outline-none placeholder:text-white/20"
          />

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">

          {landTypes.map(
            (type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setLandType(
                    type
                  )
                }
                className={`shrink-0 rounded-full border px-4 py-2 text-[9px] uppercase tracking-[0.14em] transition ${
                  landType === type
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/8 bg-white/[0.02] text-white/30 hover:bg-white/[0.05] hover:text-white/60"
                }`}
              >
                {type}
              </button>
            )
          )}

        </div>

        {/* =================================================
            MAP + SIDE PANEL
        ================================================= */}

        <div className="grid min-h-[calc(100vh-150px)] gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">

          {/* =================================================
              REAL GOOGLE MAP
          ================================================= */}

          <section className="relative min-h-[650px] overflow-hidden rounded-2xl border border-white/[0.07]">

            <GoogleLandMap
              lands={
                filteredLands
              }
              selectedLandId={
                selectedId
              }
              onLandSelect={
                handleLandSelect
              }
            />

          </section>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="hidden overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] lg:block">

            <div className="border-b border-white/[0.06] px-5 py-4">

              <div className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                Available Land
              </div>

              <div className="mt-1 text-sm text-white/65">
                {filteredLands.length} parcels
              </div>

            </div>

            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">

              {filteredLands.length ===
                0 && (
                <div className="px-5 py-10 text-center">

                  <div className="text-xs text-white/35">
                    No land found
                  </div>

                  <div className="mt-2 text-[9px] text-white/20">
                    Try another search
                    or filter.
                  </div>

                </div>
              )}

              {filteredLands.map(
                (land) => {
                  const selected =
                    selectedId ===
                    land.id;

                  return (
                    <button
                      key={land.id}
                      type="button"
                      onClick={() =>
                        handleLandSelect(
                          land.id
                        )
                      }
                      className={`w-full border-b border-white/[0.05] p-5 text-left transition ${
                        selected
                          ? "bg-white/[0.07]"
                          : "hover:bg-white/[0.035]"
                      }`}
                    >

                      {/* TITLE */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <div className="truncate text-xs font-medium text-white/75">
                            {
                              land.title
                            }
                          </div>

                          <div className="mt-1 truncate text-[9px] text-white/25">
                            {
                              land.location
                            }
                          </div>

                        </div>

                        <div className="shrink-0 text-right">

                          <div className="text-sm text-white/70">
                            {
                              land.suitabilityScore
                            }%
                          </div>

                          <div className="text-[7px] uppercase tracking-[0.12em] text-white/20">
                            AI
                          </div>

                        </div>

                      </div>

                      {/* DATA */}

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div>

                          <div className="text-[7px] uppercase tracking-[0.12em] text-white/20">
                            Area
                          </div>

                          <div className="mt-1 text-[10px] text-white/45">
                            {
                              land.area
                            }
                          </div>

                        </div>

                        <div>

                          <div className="text-[7px] uppercase tracking-[0.12em] text-white/20">
                            Best use
                          </div>

                          <div className="mt-1 truncate text-[10px] text-white/45">
                            {
                              land.bestUse
                            }
                          </div>

                        </div>

                      </div>

                      {/* VERIFIED */}

                      {land.verified && (
                        <div className="mt-4 flex items-center gap-2">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                          <span className="text-[7px] uppercase tracking-[0.15em] text-white/25">
                            Verified
                          </span>

                        </div>
                      )}

                    </button>
                  );
                }
              )}

            </div>

          </aside>

        </div>

      </div>

      {/* =================================================
          SELECTED LAND SUMMARY
      ================================================= */}

      {selectedLand && (
        <div className="fixed bottom-5 left-5 z-50 max-w-[calc(100%-40px)] lg:hidden">

          <div className="rounded-2xl border border-white/10 bg-[#090C0A]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">

            <div className="flex items-center gap-3">

              <div className="min-w-0">

                <div className="truncate text-xs text-white/75">
                  {
                    selectedLand.title
                  }
                </div>

                <div className="mt-1 text-[9px] text-white/30">
                  {
                    selectedLand.bestUse
                  }{" "}
                  ·{" "}
                  {
                    selectedLand.suitabilityScore
                  }%
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedId(
                    null
                  )
                }
                className="shrink-0 text-[9px] uppercase tracking-[0.15em] text-white/30"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}