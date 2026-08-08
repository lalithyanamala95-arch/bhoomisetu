"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSignIn(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const {
        data,
        error: signInError,
      } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error(
          "No user was returned."
        );
      }

      /*
       * Make absolutely sure a session exists
       */

      const {
        data: sessionResult,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!sessionResult.session) {
        throw new Error(
          "Login succeeded, but no authentication session was created."
        );
      }

      console.log(
        "Logged in user:",
        data.user.id
      );

      console.log(
        "Session created successfully"
      );

      /*
       * For now all successful logins go
       * to the owner dashboard.
       *
       * We'll add Owner/Buyer routing next.
       */

      router.replace(
        "/dashboard/owner"
      );

      router.refresh();

    } catch (err) {
      console.error(
        "SIGN IN ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            LEFT PANEL
        ====================================================== */}

        <section className="hidden border-r border-white/[0.06] lg:flex lg:flex-col lg:justify-between lg:p-12">

          <Link
            href="/"
            className="text-[12px] tracking-[0.3em]"
          >
            BHOOMISETU
          </Link>

          <div>

            <div className="text-[8px] uppercase tracking-[0.3em] text-white/20">
              Land intelligence
            </div>

            <h1 className="mt-5 text-6xl font-light leading-[0.95] tracking-[-0.06em]">
              Welcome
              <br />

              <span className="text-white/30">
                back.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-xs leading-6 text-white/30">
              Continue exploring land,
              manage your properties and
              discover what each parcel
              could become.
            </p>

          </div>

          <div className="text-[7px] uppercase tracking-[0.25em] text-white/15">
            Spatial intelligence for land
          </div>

        </section>

        {/* =====================================================
            RIGHT PANEL
        ====================================================== */}

        <section className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-[440px]">

            {/* Mobile logo */}

            <div className="mb-12 lg:hidden">

              <Link
                href="/"
                className="text-[12px] tracking-[0.3em]"
              >
                BHOOMISETU
              </Link>

            </div>

            {/* Header */}

            <div>

              <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
                Sign in
              </div>

              <h2 className="mt-4 text-4xl font-light tracking-[-0.04em]">
                Welcome back.
              </h2>

              <p className="mt-3 text-xs text-white/30">
                Sign in to continue to
                BhoomiSetu.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4">

                <div className="text-[8px] uppercase tracking-[0.15em] text-red-300/70">
                  Sign in failed
                </div>

                <div className="mt-2 text-xs leading-5 text-red-200/60">
                  {error}
                </div>

              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSignIn}
              className="mt-8 space-y-5"
            >

              {/* Email */}

              <div>

                <label className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-4 text-sm text-white outline-none placeholder:text-white/15 focus:border-white/25"
                />

              </div>

              {/* Password */}

              <div>

                <label className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-4 text-sm text-white outline-none placeholder:text-white/15 focus:border-white/25"
                />

              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading
                  ? "Signing in..."
                  : "Sign in"}

                {!loading && (
                  <span>→</span>
                )}

              </button>

            </form>

            {/* Signup */}

            <div className="mt-8 text-center">

              <span className="text-[9px] text-white/20">
                Don't have an account?
              </span>

              <Link
                href="/signup"
                className="ml-2 text-[9px] text-white/60 hover:text-white"
              >
                Create account
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}