import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#070908] text-white">

      <SiteHeader />

      <section className="px-5 pb-24 pt-32 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-[1100px]">

          <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
            About BhoomiSetu
          </div>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.06em] sm:text-7xl">
            Making land
            <br />
            easier to understand.
          </h1>

          <div className="mt-12 max-w-3xl text-sm leading-8 text-white/30">

            <p>
              BhoomiSetu is envisioned as a
              land-tech ecosystem connecting
              landowners with businesses,
              farmers, investors, developers and
              renewable-energy companies.
            </p>

            <p className="mt-7">
              The platform combines discovery,
              verification, spatial intelligence
              and AI-assisted decision making into
              one experience.
            </p>

          </div>


          <div className="mt-20 grid gap-4 sm:grid-cols-3">

            <Box
              title="Discover"
              text="Find land based on real-world requirements."
            />

            <Box
              title="Understand"
              text="Turn raw land information into actionable intelligence."
            />

            <Box
              title="Connect"
              text="Bring landowners and opportunity seekers together."
            />

          </div>

        </div>

      </section>

    </main>
  );
}


function Box({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7">

      <h2 className="text-xl font-light">
        {title}
      </h2>

      <p className="mt-4 text-xs leading-6 text-white/25">
        {text}
      </p>

    </div>
  );
}