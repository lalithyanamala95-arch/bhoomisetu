"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Role = "owner" | "buyer";

export default function SignUpPage() {
  const router = useRouter();

  const [role, setRole] =
    useState<Role>("owner");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  async function handleSignup(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      /* =========================================
         VALIDATION
      ========================================== */

      if (password.length < 6) {
        throw new Error(
          "Password must contain at least 6 characters."
        );
      }

      if (
        password !== confirmPassword
      ) {
        throw new Error(
          "Passwords do not match."
        );
      }

      if (!fullName.trim()) {
        throw new Error(
          "Please enter your full name."
        );
      }

      /* =========================================
         CREATE ACCOUNT
      ========================================== */

      const {
        data,
        error: signupError,
      } =
        await supabase.auth.signUp({
          email: email.trim(),
          password: password,

          options: {
            data: {
              full_name:
                fullName.trim(),

              phone:
                phone.trim(),

              role: role,
            },
          },
        });

      if (signupError) {
        throw signupError;
      }

      if (!data.user) {
        throw new Error(
          "Account creation failed."
        );
      }

      console.log(
        "Account created:",
        data.user.id
      );

      /* =========================================
         CHECK SESSION
      ========================================== */

      const {
        data: sessionData,
      } =
        await supabase.auth.getSession();

      /*
       * If email confirmation is enabled,
       * Supabase creates the user but doesn't
       * give us a session yet.
       */

      if (!sessionData.session) {
        setSuccess(true);
        return;
      }

      /* =========================================
         SESSION EXISTS
      ========================================== */

      if (role === "owner") {
        router.replace(
          "/dashboard/owner"
        );
      } else {
        router.replace(
          "/explore"
        );
      }

      router.refresh();

    } catch (err) {
      console.error(
        "SIGNUP ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ===========================================
     EMAIL CONFIRMATION SCREEN
  ============================================ */

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070908] px-6 text-white">

        <div className="w-full max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200/20 bg-emerald-200/[0.04]">

            <span className="text-xl text-emerald-200">
              ✓
            </span>

          </div>

          <div className="mt-8 text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
            Account created
          </div>

          <h1 className="mt-4 text-4xl font-light tracking-[-0.04em]">
            Check your email.
          </h1>

          <p className="mt-5 text-xs leading-6 text-white/30">
            Your BhoomiSetu account has
            been created. Please confirm
            your email before signing in.
          </p>

          <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">

            <div className="text-[8px] uppercase tracking-[0.2em] text-white/20">
              Email
            </div>

            <div className="mt-2 text-sm text-white/50">
              {email}
            </div>

          </div>

          <Link
            href="/signin"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-[8px] font-medium uppercase tracking-[0.2em] text-black"
          >
            Go to sign in
          </Link>

        </div>

      </main>
    );
  }

  /* ===========================================
     SIGNUP PAGE
  ============================================ */

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================
            LEFT
        ====================================== */}

        <section className="hidden border-r border-white/[0.06] lg:flex lg:flex-col lg:justify-between lg:p-12">

          <Link
            href="/"
            className="text-[12px] tracking-[0.3em]"
          >
            BHOOMISETU
          </Link>

          <div>

            <div className="text-[8px] uppercase tracking-[0.3em] text-white/20">
              Spatial intelligence
            </div>

            <h1 className="mt-5 text-6xl font-light leading-[0.95] tracking-[-0.06em]">
              Start your
              <br />
              journey with
              <br />

              <span className="text-white/30">
                BhoomiSetu.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-xs leading-6 text-white/30">
              Discover land, understand
              its potential, or bring your
              own property into the
              BhoomiSetu network.
            </p>

          </div>

          <div className="text-[7px] uppercase tracking-[0.25em] text-white/15">
            Land intelligence platform
          </div>

        </section>

        {/* =====================================
            RIGHT
        ====================================== */}

        <section className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-[500px]">

            <div className="mb-10 lg:hidden">

              <Link
                href="/"
                className="text-[12px] tracking-[0.3em]"
              >
                BHOOMISETU
              </Link>

            </div>

            <div>

              <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
                Create account
              </div>

              <h2 className="mt-4 text-4xl font-light tracking-[-0.04em]">
                Welcome to BhoomiSetu.
              </h2>

              <p className="mt-3 text-xs text-white/30">
                Tell us how you plan to
                use the platform.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4">

                <div className="text-[8px] uppercase tracking-[0.15em] text-red-300/70">
                  Something went wrong
                </div>

                <div className="mt-2 text-xs leading-5 text-red-200/60">
                  {error}
                </div>

              </div>
            )}

            <form
              onSubmit={handleSignup}
              className="mt-8 space-y-5"
            >

              {/* ROLE */}

              <div>

                <label className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                  I am here to
                </label>

                <div className="mt-2 grid grid-cols-2 gap-3">

                  <RoleCard
                    active={
                      role === "owner"
                    }
                    title="List land"
                    description="I own land"
                    onClick={() =>
                      setRole(
                        "owner"
                      )
                    }
                  />

                  <RoleCard
                    active={
                      role === "buyer"
                    }
                    title="Discover land"
                    description="I'm looking for land"
                    onClick={() =>
                      setRole(
                        "buyer"
                      )
                    }
                  />

                </div>

              </div>

              <Input
                label="Full name"
                placeholder="Your name"
                value={fullName}
                onChange={setFullName}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
                required
              />

              <Input
                label="Phone"
                placeholder="+91 XXXXX XXXXX"
                value={phone}
                onChange={setPhone}
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={setPassword}
                required
              />

              <Input
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={
                  setConfirmPassword
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && (
                  <span>→</span>
                )}

              </button>

            </form>

            <div className="mt-8 text-center">

              <span className="text-[9px] text-white/20">
                Already have an account?
              </span>

              <Link
                href="/signin"
                className="ml-2 text-[9px] text-white/60 hover:text-white"
              >
                Sign in
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>

      <label className="text-[8px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/15 focus:border-white/25"
      />

    </div>
  );
}

/* =========================================================
   ROLE CARD
========================================================= */

function RoleCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border p-5 text-left transition ${
        active
          ? "border-white/30 bg-white/[0.08]"
          : "border-white/[0.08] bg-white/[0.025] hover:border-white/20"
      }`}
    >

      <div className="flex items-center justify-between">

        <span className="text-xs text-white/70">
          {title}
        </span>

        <span
          className={`h-2 w-2 rounded-full ${
            active
              ? "bg-emerald-200"
              : "bg-white/15"
          }`}
        />

      </div>

      <div className="mt-2 text-[8px] text-white/25">
        {description}
      </div>

    </button>
  );
}