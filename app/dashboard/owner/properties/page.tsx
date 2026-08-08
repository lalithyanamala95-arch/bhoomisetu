"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Land = {
  id: string;
  title: string;
  location: string;
  area: string;
  land_type: string;
  latitude: number;
  longitude: number;
  best_use: string | null;
  suitability_score: number | null;
  estimated_value: string | null;
  price_per_acre: string | null;
  road_access: string | null;
  electricity: boolean;
  water: boolean;
  internet: boolean;
  verified: boolean;
  verification_level: string | null;
  highlights: string[] | null;
  created_at: string;
};

export default function MyPropertiesPage() {
  const router = useRouter();

  const [lands, setLands] =
    useState<Land[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleting, setDeleting] =
    useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        router.replace("/signin");
        return;
      }

      /*
       * Your current `lands` table does not yet contain
       * owner_id, so we cannot safely filter by owner
       * yet.
       *
       * For now we load the current land records.
       *
       * Once we add owner_id, this becomes:
       *
       * .eq("owner_id", user.id)
       */

      const response =
        await fetch("/api/lands");

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load properties."
        );
      }

      setLands(
        result?.data ?? []
      );

    } catch (err) {
      console.error(
        "MY PROPERTIES ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load properties."
      );

    } finally {
      setLoading(false);
    }
  }

  async function deleteProperty(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this property?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(id);

      const response =
        await fetch(
          `/api/lands/${id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to delete property."
        );
      }

      setLands(
        (current) =>
          current.filter(
            (land) =>
              land.id !== id
          )
      );

    } catch (err) {
      console.error(
        "DELETE PROPERTY ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Unable to delete property."
      );

    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070908] text-white">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-white/10 border-t-white/70" />

          <div className="mt-5 text-[9px] uppercase tracking-[0.25em] text-white/30">
            Loading properties
          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      {/* NAV */}

      <header className="border-b border-white/[0.06]">

        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8">

          <Link
            href="/"
            className="text-[12px] tracking-[0.3em]"
          >
            BHOOMISETU
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/dashboard/owner"
              className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-white/20 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/owner"
              className="rounded-full bg-white px-4 py-2 text-[8px] uppercase tracking-[0.18em] text-black"
            >
              + List Land
            </Link>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
              Owner
            </div>

            <h1 className="mt-4 text-4xl font-light tracking-[-0.05em] sm:text-5xl">
              My Properties
            </h1>

            <p className="mt-4 max-w-xl text-xs leading-6 text-white/30">
              Manage the land you've
              submitted to BhoomiSetu.
            </p>

          </div>

          <div className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-white/30">
            {lands.length}{" "}
            {lands.length === 1
              ? "Property"
              : "Properties"}
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-8 rounded-xl border border-red-400/15 bg-red-400/[0.04] p-5">

            <div className="text-[8px] uppercase tracking-[0.2em] text-red-300/60">
              Error
            </div>

            <div className="mt-2 text-xs text-red-100/60">
              {error}
            </div>

          </div>
        )}

        {/* EMPTY */}

        {lands.length === 0 &&
          !error && (
            <div className="mt-12 rounded-2xl border border-dashed border-white/10 p-16 text-center">

              <div className="text-3xl text-white/10">
                ◇
              </div>

              <h2 className="mt-5 text-lg font-light text-white/60">
                No properties yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-white/25">
                Add your first property and
                start the verification process.
              </p>

              <Link
                href="/dashboard/owner"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-[8px] uppercase tracking-[0.2em] text-black"
              >
                List your land
              </Link>

            </div>
          )}

        {/* PROPERTY GRID */}

        {lands.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {lands.map(
              (land) => (
                <PropertyCard
                  key={land.id}
                  land={land}
                  deleting={
                    deleting ===
                    land.id
                  }
                  onDelete={
                    deleteProperty
                  }
                />
              )
            )}

          </div>
        )}

      </section>

    </main>
  );
}


/* =========================================================
   PROPERTY CARD
========================================================= */

function PropertyCard({
  land,
  deleting,
  onDelete,
}: {
  land: Land;
  deleting: boolean;
  onDelete: (
    id: string
  ) => void;
}) {
  const status =
    land.verified
      ? "Verified"
      : land.verification_level ||
        "Pending Verification";

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] transition hover:border-white/[0.14]">

      {/* TOP VISUAL */}

      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-white/[0.08] via-white/[0.025] to-transparent">

        <div className="absolute inset-0 opacity-20">

          <div className="absolute left-[15%] top-[25%] h-24 w-24 rounded-full border border-white/20" />

          <div className="absolute right-[15%] bottom-[15%] h-32 w-32 rounded-full border border-white/10" />

        </div>

        <div className="absolute left-5 top-5">

          <span
            className={`rounded-full border px-3 py-1.5 text-[7px] uppercase tracking-[0.16em] ${
              land.verified
                ? "border-emerald-200/20 bg-emerald-200/[0.06] text-emerald-200/70"
                : "border-amber-200/15 bg-amber-200/[0.04] text-amber-200/60"
            }`}
          >
            {status}
          </span>

        </div>

        <div className="absolute bottom-5 left-5">

          <div className="text-[8px] uppercase tracking-[0.2em] text-white/25">
            {land.land_type}
          </div>

          <div className="mt-1 text-2xl font-light tracking-[-0.04em]">
            {land.area}
          </div>

        </div>

      </div>

      {/* DETAILS */}

      <div className="p-5">

        <h2 className="truncate text-lg font-light text-white/80">
          {land.title}
        </h2>

        <p className="mt-2 truncate text-[10px] text-white/30">
          {land.location}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">

          <Info
            label="Best use"
            value={
              land.best_use ||
              "Pending"
            }
          />

          <Info
            label="Score"
            value={
              land.suitability_score
                ? `${land.suitability_score}/100`
                : "Pending"
            }
          />

          <Info
            label="Value"
            value={
              land.estimated_value ||
              "Pending"
            }
          />

          <Info
            label="Road"
            value={
              land.road_access ||
              "Unknown"
            }
          />

        </div>

        {/* INFRASTRUCTURE */}

        <div className="mt-5 flex flex-wrap gap-2">

          {land.electricity && (
            <Tag>
              Electricity
            </Tag>
          )}

          {land.water && (
            <Tag>
              Water
            </Tag>
          )}

          {land.internet && (
            <Tag>
              Internet
            </Tag>
          )}

        </div>

        {/* ACTIONS */}

        <div className="mt-6 flex gap-2 border-t border-white/[0.06] pt-5">

          <Link
            href={`/explore/${land.id}`}
            className="flex-1 rounded-xl border border-white/10 py-3 text-center text-[8px] uppercase tracking-[0.16em] text-white/40 transition hover:border-white/20 hover:text-white"
          >
            View
          </Link>

          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              onDelete(
                land.id
              )
            }
            className="rounded-xl border border-red-300/10 px-4 py-3 text-[8px] uppercase tracking-[0.16em] text-red-200/40 transition hover:border-red-300/20 hover:text-red-200/70 disabled:opacity-30"
          >
            {deleting
              ? "..."
              : "Delete"}
          </button>

        </div>

      </div>

    </article>
  );
}


/* =========================================================
   INFO
========================================================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">

      <div className="text-[7px] uppercase tracking-[0.16em] text-white/20">
        {label}
      </div>

      <div className="mt-1 truncate text-[10px] text-white/50">
        {value}
      </div>

    </div>
  );
}


/* =========================================================
   TAG
========================================================= */

function Tag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[7px] uppercase tracking-[0.12em] text-white/30">
      {children}
    </span>
  );
}