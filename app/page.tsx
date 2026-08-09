"use client";

import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070908] text-white">
      <SiteHeader />

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative min-h-screen pt-[76px]">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[50%] top-[45%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
          <div className="absolute left-[50%] top-[45%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
          <div className="absolute left-[50%] top-[45%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(39,100,55,0.16),transparent_45%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-[1500px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          {/* =================================================
              LEFT
          ================================================= */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              <span className="text-[8px] uppercase tracking-[0.3em] text-white/30">
                Spatial Intelligence Platform
              </span>
            </div>

            <h1 className="max-w-4xl text-6xl font-light leading-[0.88] tracking-[-0.07em] sm:text-7xl lg:text-[96px]">
              Land.
              <br />
              <span className="text-white/30">Understood.</span>
            </h1>

            <p className="mt-9 max-w-xl text-sm leading-7 text-white/35 sm:text-base">
              BhoomiSetu connects landowners,
              businesses, farmers, investors and
              developers through intelligent land
              discovery, GIS mapping and AI-powered
              land insights.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="rounded-full bg-white px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-black transition hover:scale-[1.02]"
              >
                Explore Land →
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/10 px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-white/45 transition hover:border-white/25 hover:text-white"
              >
                List Your Land
              </Link>
            </div>

            {/* Metrics */}
            <div className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-white/[0.07] pt-7">
              <Metric value="GIS" label="Spatial intelligence" />
              <Metric value="AI" label="Suitability analysis" />
              <Metric value="3D" label="Terrain mapping" />
            </div>
          </div>

          {/* =================================================
              RIGHT LOGO
          ================================================= */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute h-[420px] w-[420px] rounded-full bg-emerald-400/[0.05] blur-[120px]" />
            <div className="relative">
              <div className="absolute inset-8 rounded-full border border-white/[0.04] animate-[spin_35s_linear_infinite]" />
              <Image
                src="/bhoomisetu-logo.png"
                alt="BhoomiSetu"
                width={650}
                height={650}
                priority
                className="relative w-[320px] object-contain sm:w-[430px] lg:w-[540px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          WHAT IS BHOOMISETU
      ================================================== */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
                The platform
              </div>
              <h2 className="mt-5 max-w-2xl text-4xl font-light tracking-[-0.05em] sm:text-6xl">
                Connecting land
                <br />
                to opportunity.
              </h2>
            </div>

            <div className="lg:pt-8">
              <p className="text-sm leading-8 text-white/35">
                BhoomiSetu is designed as a complete
                land-tech ecosystem — from discovery
                and verification to intelligent
                recommendations, negotiation and
                eventual transaction.
              </p>
              <Link
                href="/how-it-works"
                className="mt-7 inline-block text-[8px] uppercase tracking-[0.2em] text-white/50 underline underline-offset-8"
              >
                Discover how it works →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          FEATURES
      ================================================== */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-10">
          <div className="text-[8px] uppercase tracking-[0.3em] text-white/20">
            Platform capabilities
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Feature number="01" title="Discover" text="Search land by location, purpose, area and suitability." />
            <Feature number="02" title="Understand" text="AI and GIS intelligence reveals the potential of each parcel." />
            <Feature number="03" title="Verify" text="Listings move through verification before receiving trust status." />
            <Feature number="04" title="Connect" text="Connect owners with businesses, investors and developers." />
          </div>
        </div>
      </section>

      {/* ==================================================
          CTA
      ================================================== */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1500px] px-5 py-28 text-center sm:px-8">
          <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
            Begin
          </div>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-light tracking-[-0.05em] sm:text-6xl">
            The right land can change
            everything.
          </h2>
          <div className="mt-9 flex justify-center gap-3">
            <Link
              href="/explore"
              className="rounded-full bg-white px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-black"
            >
              Explore Land
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/10 px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-white/40"
            >
              Join BhoomiSetu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="text-xl font-light">{value}</div>
      <div className="mt-2 text-[7px] uppercase tracking-[0.15em] text-white/20">
        {label}
      </div>
    </div>
  );
}

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/[0.14]">
      <div className="text-[8px] text-white/15">{number}</div>
      <h3 className="mt-12 text-xl font-light">{title}</h3>
      <p className="mt-4 text-xs leading-6 text-white/25">{text}</p>
    </div>
  );
}
