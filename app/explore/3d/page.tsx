"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import BhoomiSetu3DMap from "@/components/maps/BhoomiSetu3DMap";

type Land = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  suitability_score?: number | null;
};

export default function ThreeDExplorePage() {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLands() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/lands", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              result?.error ||
              "Unable to load land listings."
          );
        }

        if (!cancelled) {
          setLands(
            Array.isArray(result?.data)
              ? result.data
              : []
          );
        }
      } catch (err) {
        console.error(
          "Land loading error:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load land."
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

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      <SiteHeader />

      <section className="px-4 pb-5 pt-[96px]">

        <div className="mx-auto max-w-[1600px]">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />

                <span className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
                  BhoomiSetu Spatial Intelligence
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-light tracking-[-0.05em] sm:text-4xl">
                3D Land Explorer
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-6 text-white/25">
                Explore available land parcels in
                immersive 3D.
              </p>

            </div>


            {/* ==================================================
                STATS
            ================================================== */}

            <div className="flex gap-3">

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3">

                <div className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                  Parcels
                </div>

                <div className="mt-1 text-sm text-white/60">
                  {lands.length}
                </div>

              </div>


              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3">

                <div className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                  Mode
                </div>

                <div className="mt-1 text-sm text-emerald-200/60">
                  3D
                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              DATA ERROR
          ================================================== */}

          {error && (

            <div className="mb-5 rounded-2xl border border-red-200/10 bg-red-200/[0.03] px-5 py-4">

              <div className="text-[8px] uppercase tracking-[0.2em] text-red-200/50">
                Land data error
              </div>

              <div className="mt-2 text-xs text-white/30">
                {error}
              </div>

            </div>

          )}


          {/* ==================================================
              3D MAP
          ================================================== */}

          <div className="relative h-[calc(100vh-175px)] min-h-[600px] overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl">

            {loading ? (

              <div className="flex h-full items-center justify-center bg-[#080B09]">

                <div className="text-center">

                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border border-white/10 border-t-white/70" />

                  <div className="mt-5 text-[8px] uppercase tracking-[0.25em] text-white/25">
                    Loading land intelligence...
                  </div>

                </div>

              </div>

            ) : (

              <BhoomiSetu3DMap
                lands={lands}
              />

            )}

          </div>

        </div>

      </section>

    </main>
  );
}