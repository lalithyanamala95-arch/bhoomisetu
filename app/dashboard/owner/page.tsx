"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type FormState = {
  title: string;
  location: string;
  area: string;
  landType: string;
  purpose: string;
  latitude: string;
  longitude: string;
  roadAccess: string;
  nearbyHighway: string;
  water: boolean;
  electricity: boolean;
  internet: boolean;
};

const initialForm: FormState = {
  title: "",
  location: "",
  area: "",
  landType: "Agriculture",
  purpose: "Commercial",
  latitude: "",
  longitude: "",
  roadAccess: "",
  nearbyHighway: "",
  water: false,
  electricity: false,
  internet: false,
};

export default function OwnerDashboard() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* ========================================================
     CHECK AUTH
  ======================================================== */

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(
          "AUTH CHECK ERROR:",
          error
        );

        setLoggedIn(false);
        return;
      }

      if (user) {
        setLoggedIn(true);
        setUserEmail(user.email ?? "");
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error(
        "AUTH CHECK ERROR:",
        error
      );

      setLoggedIn(false);
    } finally {
      setCheckingAuth(false);
    }
  }

  /* ========================================================
     UPDATE FORM
  ======================================================== */

  function updateField(
    field: keyof FormState,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* ========================================================
     GET CURRENT LOCATION
  ======================================================== */

  function getLocation() {
    setError("");
    setMessage("");

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude:
            position.coords.latitude.toString(),
          longitude:
            position.coords.longitude.toString(),
        }));

        setMessage(
          "Location captured successfully."
        );
      },
      () => {
        setError(
          "Unable to get your location. Enter latitude and longitude manually."
        );
      }
    );
  }

  /* ========================================================
     SUBMIT PROPERTY
  ======================================================== */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!loggedIn) {
      setError(
        "Please sign in before listing a property."
      );
      return;
    }

    if (!form.title.trim()) {
      setError(
        "Please enter a property title."
      );
      return;
    }

    if (!form.location.trim()) {
      setError(
        "Please enter the property location."
      );
      return;
    }

    if (!form.area.trim()) {
      setError(
        "Please enter the land area."
      );
      return;
    }

    if (
      !form.latitude ||
      !form.longitude
    ) {
      setError(
        "Please enter the land coordinates."
      );
      return;
    }

    setSubmitting(true);

    try {
      /* ====================================================
         GET CURRENT SESSION
      ==================================================== */

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          sessionError.message
        );
      }

      if (!session) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      console.log(
        "CURRENT USER:",
        session.user.id
      );

      /* ====================================================
         PAYLOAD
      ==================================================== */

      const payload = {
        ownerId:
          session.user.id,

        title:
          form.title.trim(),

        location:
          form.location.trim(),

        area:
          form.area.trim(),

        landType:
          form.landType,

        purpose:
          form.purpose,

        latitude:
          Number(form.latitude),

        longitude:
          Number(form.longitude),

        width: 1,

        depth: 1,

        roadAccess:
          form.roadAccess.trim(),

        nearbyHighway:
          form.nearbyHighway.trim(),

        water:
          form.water,

        electricity:
          form.electricity,

        internet:
          form.internet,
      };

      console.log(
        "SUBMITTING LAND:",
        payload
      );

      /* ====================================================
         SEND TO API
      ==================================================== */

      const response =
        await fetch(
          "/api/lands",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      /* ====================================================
         READ RESPONSE
      ==================================================== */

      const text =
        await response.text();

      let result: any = null;

      try {
        result = text
          ? JSON.parse(text)
          : null;
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      console.log(
        "LAND API RESPONSE:",
        result
      );

      /* ====================================================
         HANDLE API ERROR
      ==================================================== */

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error?.message ||
            `Submission failed (${response.status}).`
        );
      }

      /* ====================================================
         SUCCESS
      ==================================================== */

      setMessage(
        "Property submitted successfully. Pending verification."
      );

      setForm(
        initialForm
      );

    } catch (error) {
      console.error(
        "PROPERTY SUBMISSION ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit property."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ========================================================
     SIGN OUT
  ======================================================== */

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();

      setLoggedIn(false);
      setUserEmail("");

      router.refresh();
    } catch (error) {
      console.error(
        "SIGN OUT ERROR:",
        error
      );
    }
  }

  /* ========================================================
     LOADING
  ======================================================== */

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070908] text-white">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-white/10 border-t-white" />

          <p className="mt-4 text-[9px] uppercase tracking-[0.25em] text-white/30">
            Loading dashboard
          </p>

        </div>

      </main>
    );
  }

  /* ========================================================
     DASHBOARD
  ======================================================== */

  return (
    <main className="min-h-screen bg-[#070908] text-white">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070908]/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1300px] items-center justify-between px-5">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm">
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

          <div className="flex items-center gap-2">

            <Link
              href="/dashboard/owner/properties"
              className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.15em] text-white/40 transition hover:border-white/20 hover:text-white"
            >
              My Properties
            </Link>

            {loggedIn ? (
              <button
                type="button"
                onClick={
                  handleSignOut
                }
                className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.15em] text-white/40 transition hover:border-white/20 hover:text-white"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/signup"
                className="rounded-full bg-white px-4 py-2 text-[8px] uppercase tracking-[0.15em] text-black"
              >
                Sign in
              </Link>
            )}

          </div>

        </div>

      </header>

      {/* ====================================================
          MAIN CONTENT
      ==================================================== */}

      <section className="mx-auto max-w-[1100px] px-5 py-12 sm:py-16">

        {/* HEADER */}

        <div>

          <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
            Owner dashboard
          </div>

          <h1 className="mt-4 text-4xl font-light tracking-[-0.05em] sm:text-6xl">
            List your land.
          </h1>

          <p className="mt-5 max-w-2xl text-xs leading-6 text-white/30">
            Add your property information
            and location. Your listing will
            enter verification before being
            presented to buyers.
          </p>

          {loggedIn && (
            <div className="mt-5 text-[9px] text-white/25">
              Signed in as{" "}
              <span className="text-white/50">
                {userEmail}
              </span>
            </div>
          )}

        </div>

        {/* ==================================================
            NOT LOGGED IN
        ================================================== */}

        {!loggedIn && (
          <div className="mt-10 rounded-2xl border border-amber-200/10 bg-amber-200/[0.025] p-6">

            <div className="text-sm text-white/60">
              Sign in to list a property.
            </div>

            <p className="mt-2 text-xs leading-5 text-white/25">
              You need an authenticated
              BhoomiSetu owner account before
              submitting land.
            </p>

            <Link
              href="/signup"
              className="mt-5 inline-flex rounded-xl bg-white px-6 py-3 text-[8px] uppercase tracking-[0.18em] text-black"
            >
              Go to sign in
            </Link>

          </div>
        )}

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (
          <div className="mt-8 rounded-2xl border border-emerald-200/15 bg-emerald-200/[0.04] p-5">

            <div className="text-[8px] uppercase tracking-[0.2em] text-emerald-200/50">
              Success
            </div>

            <div className="mt-2 text-sm text-emerald-100/70">
              {message}
            </div>

            <Link
              href="/dashboard/owner/properties"
              className="mt-4 inline-block text-[8px] uppercase tracking-[0.18em] text-white/50 underline underline-offset-4"
            >
              View my properties →
            </Link>

          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-5">

            <div className="text-[8px] uppercase tracking-[0.2em] text-red-300/50">
              Error
            </div>

            <div className="mt-2 text-sm text-red-100/70">
              {error}
            </div>

          </div>
        )}

        {/* ==================================================
            FORM
        ================================================== */}

        {loggedIn && (
          <form
            onSubmit={
              handleSubmit
            }
            className="mt-10 space-y-5"
          >

            {/* =================================================
                PROPERTY DETAILS
            ================================================= */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">

              <div className="mb-7">

                <div className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                  01
                </div>

                <h2 className="mt-2 text-xl font-light">
                  Property details
                </h2>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <Field
                  label="Property title"
                  placeholder="Bengaluru Rural Estate"
                  value={
                    form.title
                  }
                  onChange={(value) =>
                    updateField(
                      "title",
                      value
                    )
                  }
                />

                <Field
                  label="Location"
                  placeholder="Devanahalli, Karnataka"
                  value={
                    form.location
                  }
                  onChange={(value) =>
                    updateField(
                      "location",
                      value
                    )
                  }
                />

                <Field
                  label="Area"
                  placeholder="10.5 acres"
                  value={
                    form.area
                  }
                  onChange={(value) =>
                    updateField(
                      "area",
                      value
                    )
                  }
                />

                <Select
                  label="Land type"
                  value={
                    form.landType
                  }
                  onChange={(value) =>
                    updateField(
                      "landType",
                      value
                    )
                  }
                  options={[
                    "Agriculture",
                    "Commercial",
                    "Industrial",
                    "Residential",
                    "Renewable Energy",
                  ]}
                />

                <Select
                  label="Potential use"
                  value={
                    form.purpose
                  }
                  onChange={(value) =>
                    updateField(
                      "purpose",
                      value
                    )
                  }
                  options={[
                    "Commercial",
                    "Warehouse",
                    "Solar Farm",
                    "Agriculture",
                    "Industrial",
                    "Residential",
                  ]}
                />

              </div>

            </section>

            {/* =================================================
                LOCATION
            ================================================= */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">

              <div className="mb-7">

                <div className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                  02
                </div>

                <h2 className="mt-2 text-xl font-light">
                  Exact location
                </h2>

                <p className="mt-2 text-xs text-white/25">
                  This is where your property
                  will appear on the map.
                </p>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <Field
                  label="Latitude"
                  placeholder="13.1986"
                  value={
                    form.latitude
                  }
                  onChange={(value) =>
                    updateField(
                      "latitude",
                      value
                    )
                  }
                />

                <Field
                  label="Longitude"
                  placeholder="77.7066"
                  value={
                    form.longitude
                  }
                  onChange={(value) =>
                    updateField(
                      "longitude",
                      value
                    )
                  }
                />

              </div>

              <button
                type="button"
                onClick={
                  getLocation
                }
                className="mt-5 rounded-xl border border-white/10 px-5 py-3 text-[8px] uppercase tracking-[0.18em] text-white/40 transition hover:border-white/20 hover:text-white"
              >
                Use current location
              </button>

            </section>

            {/* =================================================
                ACCESS
            ================================================= */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">

              <div className="mb-7">

                <div className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                  03
                </div>

                <h2 className="mt-2 text-xl font-light">
                  Access & infrastructure
                </h2>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <Field
                  label="Road access"
                  placeholder="30 ft road"
                  value={
                    form.roadAccess
                  }
                  onChange={(value) =>
                    updateField(
                      "roadAccess",
                      value
                    )
                  }
                />

                <Field
                  label="Nearest highway"
                  placeholder="NH 44 — 2 km"
                  value={
                    form.nearbyHighway
                  }
                  onChange={(value) =>
                    updateField(
                      "nearbyHighway",
                      value
                    )
                  }
                />

              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">

                <Toggle
                  title="Water"
                  active={
                    form.water
                  }
                  onClick={() =>
                    updateField(
                      "water",
                      !form.water
                    )
                  }
                />

                <Toggle
                  title="Electricity"
                  active={
                    form.electricity
                  }
                  onClick={() =>
                    updateField(
                      "electricity",
                      !form.electricity
                    )
                  }
                />

                <Toggle
                  title="Internet"
                  active={
                    form.internet
                  }
                  onClick={() =>
                    updateField(
                      "internet",
                      !form.internet
                    )
                  }
                />

              </div>

            </section>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                    Verification
                  </div>

                  <h2 className="mt-2 text-lg font-light">
                    Submit property
                  </h2>

                  <p className="mt-2 text-xs text-white/25">
                    Your property will start
                    as Pending Verification.
                  </p>

                </div>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="rounded-xl bg-white px-8 py-4 text-[9px] uppercase tracking-[0.2em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Property →"}
                </button>

              </div>

            </section>

          </form>
        )}

      </section>

    </main>
  );
}


/* =========================================================
   INPUT FIELD
========================================================= */

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="text-[8px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/15 focus:border-white/25"
      />

    </div>
  );
}


/* =========================================================
   SELECT
========================================================= */

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
}) {
  return (
    <div>

      <label className="text-[8px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#0b0d0c] px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>

    </div>
  );
}


/* =========================================================
   TOGGLE
========================================================= */

function Toggle({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-emerald-200/25 bg-emerald-200/[0.05]"
          : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >

      <div className="flex items-center justify-between">

        <span className="text-xs text-white/50">
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

    </button>
  );
}