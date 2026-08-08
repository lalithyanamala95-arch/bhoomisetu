import SiteHeader from "@/components/SiteHeader";

export default function InvestmentPage() {
  return (
    <main className="min-h-screen bg-[#070908] text-white">

      <SiteHeader />

      <section className="px-5 pb-24 pt-32 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-[1300px]">

          <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
            Investor marketplace
          </div>

          <h1 className="mt-5 max-w-4xl text-5xl font-light tracking-[-0.06em] sm:text-7xl">
            Invest in land-backed
            <br />
            opportunity.
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-8 text-white/30">
            Explore opportunities across renewable
            energy, agriculture and commercial
            development.
          </p>


          <div className="mt-16 grid gap-4 md:grid-cols-3">

            <InvestmentCard
              title="Solar"
              description="Land positioned for renewable-energy development."
              metric="AI suitability"
              value="85%"
            />

            <InvestmentCard
              title="Agriculture"
              description="Productive land with agricultural potential."
              metric="Projected opportunity"
              value="High"
            />

            <InvestmentCard
              title="Commercial"
              description="Strategic parcels for business and development."
              metric="Market potential"
              value="75%"
            />

          </div>

        </div>

      </section>

    </main>
  );
}


function InvestmentCard({
  title,
  description,
  metric,
  value,
}: {
  title: string;
  description: string;
  metric: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-7">

      <div className="text-[8px] uppercase tracking-[0.2em] text-white/20">
        Opportunity
      </div>

      <h2 className="mt-10 text-2xl font-light">
        {title}
      </h2>

      <p className="mt-4 text-xs leading-6 text-white/25">
        {description}
      </p>

      <div className="mt-10 border-t border-white/[0.06] pt-5">

        <div className="text-[7px] uppercase tracking-[0.15em] text-white/15">
          {metric}
        </div>

        <div className="mt-2 text-2xl font-light">
          {value}
        </div>

      </div>

    </div>
  );
}