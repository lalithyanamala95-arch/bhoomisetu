"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";

type Land = {
  id: string;
  title: string;
  location: string;
  area: string;
  land_type: string;
  best_use: string;
  suitability_score: number;
  estimated_value: string;
  price_per_acre: string;
  verified: boolean;
  latitude: number;
  longitude: number;
};

export default function ExplorePage() {
  const [lands, setLands] =
    useState<Land[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadLands();
  }, []);

  async function loadLands() {
    try {
      const response =
        await fetch("/api/lands");

      const result =
        await response.json();

      setLands(
        result?.data ?? []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    lands.filter((land) => {
      const q =
        search.toLowerCase();

      return (
        land.title
          ?.toLowerCase()
          .includes(q) ||
        land.location
          ?.toLowerCase()
          .includes(q) ||
        land.best_use
          ?.toLowerCase()
          .includes(q)
      );
    });

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      <SiteHeader />

      <section className="px-5 pb-20 pt-32 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-[1500px]">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div>

              <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
                Marketplace
              </div>

              <h1 className="mt-4 text-5xl font-light tracking-[-0.06em] sm:text-7xl">
                Explore land.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/30">
                Discover parcels using location,
                purpose and land intelligence.
              </p>

            </div>


            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search land, location or use..."
              className="w-full rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 text-xs text-white outline-none placeholder:text-white/20 lg:w-[380px]"
            />

          </div>


          {/* MAP PLACEHOLDER / 3D ENTRY */}

          <Link
            href="/explore/3d"
            className="mt-12 flex min-h-[260px] items-center justify-center overflow-hidden rounded-3xl border border-white/[0.07] bg-[radial-gradient(circle_at_center,rgba(42,95,58,.15),transparent_55%)] transition hover:border-white/15"
          >

            <div className="text-center">

              <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
                Spatial intelligence
              </div>

              <div className="mt-4 text-3xl font-light">
                Open 3D Land Map
              </div>

              <div className="mt-3 text-xs text-white/20">
                Satellite · Terrain · Parcels
              </div>

            </div>

          </Link>


          {/* LISTINGS */}

          <div className="mt-10">

            <div className="mb-5 flex items-center justify-between">

              <span className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                Available land
              </span>

              <span className="text-[8px] text-white/20">
                {filtered.length} parcels
              </span>

            </div>


            {loading ? (

              <div className="py-20 text-center text-xs text-white/20">
                Loading land...
              </div>

            ) : (

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {filtered.map(
                  (land) => (

                    <Link
                      key={land.id}
                      href={`/explore/${land.id}`}
                      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.15]"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h2 className="text-lg font-light">
                            {land.title}
                          </h2>

                          <p className="mt-1 text-[9px] text-white/25">
                            {land.location}
                          </p>

                        </div>

                        {land.verified && (
                          <span className="rounded-full border border-emerald-200/15 px-2 py-1 text-[6px] uppercase tracking-[0.15em] text-emerald-200/50">
                            Verified
                          </span>
                        )}

                      </div>


                      <div className="mt-8 grid grid-cols-2 gap-4">

                        <Data
                          label="Area"
                          value={land.area}
                        />

                        <Data
                          label="Best use"
                          value={
                            land.best_use ||
                            "Pending"
                          }
                        />

                        <Data
                          label="Suitability"
                          value={`${land.suitability_score ?? 0}%`}
                        />

                        <Data
                          label="Value"
                          value={
                            land.estimated_value ||
                            "Pending"
                          }
                        />

                      </div>


                      <div className="mt-8 text-[8px] uppercase tracking-[0.18em] text-white/25 transition group-hover:text-white/60">
                        View intelligence →
                      </div>

                    </Link>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}


function Data({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <div className="text-[7px] uppercase tracking-[0.16em] text-white/15">
        {label}
      </div>

      <div className="mt-2 truncate text-xs text-white/50">
        {value}
      </div>

    </div>
  );
}