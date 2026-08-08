import Link from "next/link";

type Land = {
  id: string;
  title: string;
  location: string;
  area: string;
  land_type: string;

  best_use: string;
  suitability_score: number;

  estimated_revenue: string;
  estimated_value: string;
  price_per_acre: string;

  highway_distance: string;
  city_distance: string;
  road_access: string;

  electricity: boolean;
  water: boolean;
  internet: boolean;

  terrain: string;
  soil: string;
  development_density: string;
  solar_exposure: string;

  verified: boolean;
  verification_level: string;

  highlights: string[];

  use_scores: {
    warehouse: number;
    solarFarm: number;
    commercial: number;
    agriculture: number;
  };
};

async function getLand(id: string): Promise<Land | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/lands/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  if (!result.success) {
    return null;
  }

  return result.data;
}

function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-400">
          {label}
        </span>

        <span className="font-medium text-white">
          {score}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-medium text-white">
        {value}
      </p>
    </div>
  );
}

export default async function LandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const land = await getLand(id);

  if (!land) {
    return (
      <main className="min-h-screen bg-[#050706] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/explore"
            className="text-sm text-neutral-400 hover:text-white"
          >
            ← Back to Explore
          </Link>

          <div className="mt-16 rounded-3xl border border-red-500/20 bg-red-500/5 p-10">
            <h1 className="text-3xl font-medium">
              Land not found
            </h1>

            <p className="mt-3 text-neutral-400">
              We couldn't find the land parcel you're
              looking for.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050706] text-white">
      {/* NAVBAR */}

      <nav className="flex h-20 items-center justify-between border-b border-white/10 px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm">
            B
          </span>

          <span className="text-sm font-medium tracking-[0.35em]">
            BHOOMISETU
          </span>
        </Link>

        <Link
          href="/explore"
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-neutral-300 transition hover:bg-white hover:text-black"
        >
          ← Explore Land
        </Link>
      </nav>

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(95,150,110,0.18),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-16 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-8 bg-white/40" />

                <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                  Land Intelligence
                </span>
              </div>

              <h1 className="max-w-5xl text-5xl font-medium tracking-[-0.05em] md:text-7xl lg:text-8xl">
                {land.title}
              </h1>

              <p className="mt-6 text-lg text-neutral-400">
                {land.location}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-neutral-300">
                  {land.land_type}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-neutral-300">
                  {land.area}
                </span>

                {land.verified && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                    ✓ {land.verification_level}
                  </span>
                )}
              </div>
            </div>

            {/* SCORE */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Suitability Score
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-7xl font-medium tracking-[-0.06em]">
                  {land.suitability_score}
                </span>

                <span className="mb-3 text-neutral-500">
                  / 100
                </span>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white"
                  style={{
                    width: `${land.suitability_score}%`,
                  }}
                />
              </div>

              <p className="mt-5 text-sm text-neutral-400">
                Highest potential use
              </p>

              <p className="mt-1 text-xl text-white">
                {land.best_use}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE OVERVIEW */}

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            label="Estimated Value"
            value={land.estimated_value}
          />

          <InfoCard
            label="Potential Revenue"
            value={land.estimated_revenue}
          />

          <InfoCard
            label="Price / Acre"
            value={land.price_per_acre}
          />

          <InfoCard
            label="Best Use"
            value={land.best_use}
          />
        </div>
      </section>

      {/* INTELLIGENCE */}

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* USE SCORE */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-9">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Opportunity Analysis
              </p>

              <h2 className="mt-2 text-2xl font-medium">
                Best use analysis
              </h2>
            </div>

            <div className="space-y-7">
              <ScoreBar
                label="Warehouse"
                score={land.use_scores.warehouse}
              />

              <ScoreBar
                label="Solar Farm"
                score={land.use_scores.solarFarm}
              />

              <ScoreBar
                label="Commercial"
                score={land.use_scores.commercial}
              />

              <ScoreBar
                label="Agriculture"
                score={land.use_scores.agriculture}
              />
            </div>
          </div>

          {/* LOCATION */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-9">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Location Intelligence
              </p>

              <h2 className="mt-2 text-2xl font-medium">
                Connectivity
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                label="Highway"
                value={land.highway_distance}
              />

              <InfoCard
                label="City"
                value={land.city_distance}
              />

              <InfoCard
                label="Road Access"
                value={land.road_access}
              />

              <InfoCard
                label="Terrain"
                value={land.terrain}
              />
            </div>
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE */}

      <section className="border-y border-white/10 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Infrastructure
            </p>

            <h2 className="mt-2 text-3xl font-medium">
              What the land already has
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Electricity", land.electricity],
              ["Water", land.water],
              ["Internet", land.internet],
            ].map(([label, available]) => (
              <div
                key={label as string}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">
                    {label as string}
                  </span>

                  <span
                    className={
                      available
                        ? "text-emerald-400"
                        : "text-neutral-600"
                    }
                  >
                    {available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHYSICAL CHARACTERISTICS */}

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Land Profile
            </p>

            <h2 className="mt-3 text-4xl font-medium tracking-tight">
              Understand the land.
            </h2>

            <p className="mt-5 max-w-md leading-7 text-neutral-400">
              BhoomiSetu combines location, infrastructure
              and physical characteristics to help identify
              the most suitable opportunities for this parcel.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              label="Soil"
              value={land.soil}
            />

            <InfoCard
              label="Solar Exposure"
              value={land.solar_exposure}
            />

            <InfoCard
              label="Development Density"
              value={land.development_density}
            />

            <InfoCard
              label="Terrain"
              value={land.terrain}
            />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Verified Highlights
            </p>

            <h2 className="mt-2 text-3xl font-medium">
              Why this parcel stands out
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {land.highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-neutral-300"
              >
                <span className="mr-3 text-emerald-400">
                  +
                </span>

                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            BhoomiSetu Intelligence
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
            Turn land information into opportunity.
          </h2>

          <Link
            href="/explore"
            className="mt-10 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:scale-105"
          >
            Explore more land →
          </Link>
        </div>
      </section>
    </main>
  );
}