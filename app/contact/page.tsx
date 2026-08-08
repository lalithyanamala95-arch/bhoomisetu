"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";

export default function ContactPage() {
  const [sent, setSent] =
    useState(false);

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      <SiteHeader />

      <section className="px-5 pb-24 pt-32 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-[900px]">

          <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
            Contact
          </div>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.06em] sm:text-7xl">
            Let's talk
            <br />
            about land.
          </h1>


          {sent ? (

            <div className="mt-12 rounded-2xl border border-emerald-200/15 bg-emerald-200/[0.03] p-7">

              <div className="text-lg font-light">
                Message received.
              </div>

              <p className="mt-2 text-xs text-white/25">
                Thank you for contacting
                BhoomiSetu.
              </p>

            </div>

          ) : (

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-12 space-y-4"
            >

              <input
                required
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-sm outline-none placeholder:text-white/15"
              />

              <input
                required
                type="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-sm outline-none placeholder:text-white/15"
              />

              <textarea
                required
                rows={7}
                placeholder="Tell us what you need..."
                className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-sm outline-none placeholder:text-white/15"
              />

              <button
                type="submit"
                className="rounded-full bg-white px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-black"
              >
                Send message →
              </button>

            </form>

          )}

        </div>

      </section>

    </main>
  );
}