import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";

export default function IntelligencePage() {
  return (
    <main className="min-h-screen bg-[#070908] text-white">

      <SiteHeader />

      <section className="px-5 pb-24 pt-32 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-[1300px]">

          <div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">
            AI + GIS
          </div>

          <h1 className="mt-5 max-w-4xl text-5xl font-light tracking-[-0.06em] sm:text-7xl">
            Understand what
            <br />
            your land can become.
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-8 text-white/30">
            BhoomiSetu combines land attributes,
            infrastructure, geography and
            satellite/GIS information to generate
            potential use recommendations.
          </p>


          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <Card
              number="01"
              title="Suitability"
              text="Score potential land uses from available property and spatial data."
            />

            <Card
              number="02"
              title="Revenue"
              text="Estimate potential monthly revenue for selected land use cases."
            />

            <Card
              number="03"
              title="Valuation"
              text="Feed land intelligence into estimated property valuation."
            />

            <Card
              number="04"
              title="Infrastructure"
              text="Understand road, electricity, water and internet access."
            />

            <Card
              number="05"
              title="Satellite"
              text="Use satellite imagery for terrain, vegetation and development context."
            />

            <Card
              number="06"
              title="3D GIS"
              text="Explore land spatially with an immersive 3D map."
            />

          </div>


          <div className="mt-10 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8">

            <div className="text-[8px] uppercase tracking-[0.2em] text-white/20">
              Example
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

              <Example label="Area" value="10 acres" />

              <Example label="Highway" value="2 km" />

              <Example label="Road" value="30 ft" />

              <Example label="Water" value="Yes" />

              <Example label="Electricity" value="Yes" />

            </div>

          </div>


          <Link
            href="/explore"
            className="mt-10 inline-flex rounded-full bg-white px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-black"
          >
            Explore real parcels →
          </Link>

        </div>

      </section>

    </main>
  );
}


function Card({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7">

      <div className="text-[8px] text-white/15">
        {number}
      </div>

      <h2 className="mt-10 text-xl font-light">
        {title}
      </h2>

      <p className="mt-4 text-xs leading-6 text-white/25">
        {text}
      </p>

    </div>
  );
}


function Example({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <div className="text-[7px] uppercase tracking-[0.15em] text-white/15">
        {label}
      </div>

      <div className="mt-2 text-sm text-white/50">
        {value}
      </div>

    </div>
  );
}