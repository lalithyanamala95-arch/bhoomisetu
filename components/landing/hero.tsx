"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Map,
  Sparkles,
} from "lucide-react";

const TerrainScene = dynamic(
  () => import("../3d/TerrainScene"),
  {
    ssr: false,
  }
);

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#070908] text-white">

      <div className="absolute inset-0 opacity-80">
        <TerrainScene />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(7,9,8,0.35)_35%,#070908_82%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,9,8,0.35),transparent_35%,#070908_100%)]" />

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">

        <motion.a
          href="/"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
            <span className="text-xs font-semibold">
              B
            </span>
          </div>

          <span className="text-sm font-medium tracking-[0.3em]">
            BHOOMISETU
          </span>
        </motion.a>

        <div className="hidden items-center gap-9 text-sm text-white/50 md:flex">

          <a
            href="#intelligence"
            className="transition-colors hover:text-white"
          >
            Intelligence
          </a>

          <a
            href="/explore"
            className="transition-colors hover:text-white"
          >
            Explore
          </a>

          <a
            href="#platform"
            className="transition-colors hover:text-white"
          >
            Platform
          </a>

        </div>

        <a
          href="/login"
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm backdrop-blur-xl transition-all hover:border-white/25 hover:bg-white/10"
        >
          Sign in
        </a>

      </nav>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-90px)] max-w-[1400px] items-center px-6 pb-24 sm:px-10 lg:px-14">

        <div className="max-w-5xl">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-7 flex items-center gap-3"
          >
            <span className="h-px w-9 bg-white/40" />

            <span className="text-[11px] uppercase tracking-[0.32em] text-white/45">
              Land Intelligence Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-[clamp(4rem,9vw,9rem)] font-medium leading-[0.86] tracking-[-0.065em]"
          >
            Connecting
            <br />

            <span className="text-white/40">
              Land
            </span>{" "}
            to
            <br />

            Opportunity.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.35,
            }}
            className="mt-9 max-w-xl text-base leading-7 text-white/50 sm:text-lg"
          >
            Discover land. Understand its potential.
            Connect it with the right opportunity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
            }}
            className="mt-9 flex flex-wrap gap-3"
          >

            <a
              href="/explore"
              className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition-all hover:scale-[1.025]"
            >
              <Map size={16} />

              Explore Land

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href="#intelligence"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm text-white/85 backdrop-blur-xl transition-all hover:border-white/25 hover:bg-white/10"
            >
              <Sparkles size={16} />

              Discover your land's potential
            </a>

          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-7 left-6 right-6 z-20 flex items-end justify-between sm:left-10 sm:right-10 lg:left-14 lg:right-14">

        <div className="hidden md:block">

          <div className="text-[10px] uppercase tracking-[0.3em] text-white/25">
            Discover
          </div>

          <div className="mt-2 text-xs text-white/35">
            Verify · Understand · Connect
          </div>

        </div>

        <a
          href="/explore"
          className="group flex flex-col items-center gap-3"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">
            Scroll to explore
          </span>

          <ArrowDown
            size={15}
            className="animate-bounce text-white/35"
          />
        </a>

      </div>

    </section>
  );
}