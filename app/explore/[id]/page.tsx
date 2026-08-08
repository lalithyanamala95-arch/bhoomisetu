"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import PremiumUnlock from "@/components/payments/PremiumUnlock";

type Land = {
  id: string; title: string; location: string; area: string; land_type: string;
  latitude: number; longitude: number; best_use: string | null; suitability_score: number | null;
  verified: boolean; verification_level: string | null; image_urls?: string[];
  width?: number; depth?: number; estimated_revenue?: string; estimated_value?: string; price_per_acre?: string;
  highway_distance?: string; city_distance?: string; road_access?: string; electricity?: boolean; water?: boolean; internet?: boolean;
  terrain?: string; soil?: string; development_density?: string; solar_exposure?: string; highlights?: string[];
  use_scores?: { warehouse?: number; solarFarm?: number; commercial?: number; agriculture?: number };
  owner_contact?: { phone?: string | null; surveyNumber?: string | null };
  legal_documents?: { name: string; url: string }[];
};

export default function LandDetailsPage() {
  const [id, setId] = useState("");
  const [land, setLand] = useState<Land | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    const currentId = decodeURIComponent(parts[parts.length - 1] || "");
    setId(currentId);
    if (currentId) void loadLand(currentId);
  }, []);

  async function loadLand(currentId: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/lands/${encodeURIComponent(currentId)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Land not found.");
      setLand(result.data);
      setUnlocked(Boolean(result.access?.premiumUnlocked));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load property.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (!land || error) return <main className="flex min-h-screen items-center justify-center bg-[#070908] px-5 text-white"><div className="text-center"><div className="text-[8px] uppercase tracking-[0.3em] text-red-200/40">Property unavailable</div><h1 className="mt-4 text-4xl font-light">Land not found.</h1><p className="mt-4 text-xs text-white/30">{error}</p><Link href="/explore" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-[8px] uppercase tracking-[0.18em] text-black">Back to explore</Link></div></main>;

  const premium = <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-3"><Info label="Estimated value" value={land.estimated_value || "Pending"} /><Info label="Price / acre" value={land.price_per_acre || "Pending"} /><Info label="Potential revenue" value={land.estimated_revenue || "Pending"} /></div>
    <div className="grid gap-5 lg:grid-cols-2"><Panel title="Location intelligence"><Row label="Highway distance" value={land.highway_distance || "Unknown"} /><Row label="City distance" value={land.city_distance || "Unknown"} /><Row label="Road access" value={land.road_access || "Unknown"} /></Panel><Panel title="Infrastructure"><div className="grid grid-cols-3 gap-3"><Mini label="Water" active={land.water} /><Mini label="Electricity" active={land.electricity} /><Mini label="Internet" active={land.internet} /></div></Panel></div>
    <Panel title="Physical characteristics"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Info label="Terrain" value={land.terrain || "Pending"} /><Info label="Soil" value={land.soil || "Pending"} /><Info label="Solar" value={land.solar_exposure || "Pending"} /><Info label="Development" value={land.development_density || "Pending"} /></div></Panel>
    <Panel title="Potential use scores"><div className="space-y-4"><Score label="Warehouse" value={land.use_scores?.warehouse ?? 0} /><Score label="Solar Farm" value={land.use_scores?.solarFarm ?? 0} /><Score label="Commercial" value={land.use_scores?.commercial ?? 0} /><Score label="Agriculture" value={land.use_scores?.agriculture ?? 0} /></div></Panel>
    <Panel title="Owner contact & legal access"><div className="grid gap-3 sm:grid-cols-2"><Info label="Owner phone" value={land.owner_contact?.phone || "Not provided"} /><Info label="Survey number" value={land.owner_contact?.surveyNumber || "Not provided"} /></div><div className="mt-5"><div className="text-[8px] uppercase tracking-[0.18em] text-white/20">Legal documents</div><div className="mt-3 flex flex-wrap gap-2">{(land.legal_documents || []).map((doc) => <a key={doc.url} href={doc.url} target="_blank" rel="noreferrer" className="rounded-full border border-emerald-200/10 bg-emerald-200/[0.03] px-4 py-2 text-[8px] uppercase tracking-[0.14em] text-emerald-100/55">{doc.name} ↗</a>)}{!(land.legal_documents || []).length && <span className="text-xs text-white/30">No legal documents uploaded yet.</span>}</div></div></Panel><Panel title="Analysis highlights"><div className="flex flex-wrap gap-2">{(land.highlights || []).map((item) => <span key={item} className="rounded-full border border-white/8 px-4 py-2 text-[8px] uppercase tracking-[0.14em] text-white/40">{item}</span>)}</div></Panel>
  </div>;

  return <main className="min-h-screen bg-[#070908] text-white">
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070908]/90 backdrop-blur-xl"><div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-8"><Link href="/" className="flex items-center gap-3"><img src="/bhoomisetu-logo.png" alt="BhoomiSetu" className="h-10 w-10 object-contain" /><div><div className="text-[12px] tracking-[0.3em]">BHOOMISETU</div><div className="mt-1 text-[7px] uppercase tracking-[0.25em] text-white/25">Land intelligence</div></div></Link><Link href="/explore" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.16em] text-white/45"><ArrowLeft size={12} /> Explore</Link></div></header>

    <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="relative min-h-[500px] overflow-hidden rounded-3xl border border-white/8 bg-[#0a0f0c]">
          {land.image_urls?.[0] ? <img src={land.image_urls[0]} alt={land.title} className="absolute inset-0 h-full w-full object-cover opacity-70" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(100,145,110,.22),transparent_55%),linear-gradient(145deg,#142018,#070908)]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-[#070908]/20 to-transparent" />
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[8px] uppercase tracking-[0.18em] text-white/45 backdrop-blur-xl"><MapPin size={11} /> {land.latitude.toFixed(5)}, {land.longitude.toFixed(5)}</div>
          <div className="absolute bottom-6 left-6 right-6"><div className="text-[8px] uppercase tracking-[0.25em] text-white/30">Spatial parcel</div><h1 className="mt-2 text-4xl font-light tracking-[-0.05em] sm:text-6xl">{land.title}</h1><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/45"><MapPin size={13} /> {land.location}<span className="text-white/15">·</span>{land.area}</div></div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-[#0a0d0b] p-7 sm:p-9">
          <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.25em] text-emerald-200/45"><ShieldCheck size={12} /> Public opportunity profile</div>
          <div className="mt-5 flex items-end justify-between gap-5"><div><div className="text-[8px] uppercase tracking-[0.18em] text-white/20">Suitability</div><div className="mt-2 text-6xl font-light tracking-[-0.06em]">{land.suitability_score ?? 0}%</div></div><div className="text-right"><div className="text-[8px] uppercase tracking-[0.18em] text-white/20">Best use</div><div className="mt-2 text-sm text-white/65">{land.best_use || "Pending"}</div></div></div>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-emerald-200/70" style={{ width: `${Math.min(100, Math.max(0, land.suitability_score || 0))}%` }} /></div>
          <div className="mt-8 grid grid-cols-2 gap-3"><Info label="Land type" value={land.land_type} /><Info label="Verification" value={land.verified ? land.verification_level || "Verified" : "Pending"} /></div>
          {land.verified && <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200/10 bg-emerald-200/[0.03] px-4 py-3 text-[9px] text-emerald-100/55"><CheckCircle2 size={13} /> Verified by the BhoomiSetu review workflow.</div>}
        </div>
      </div>

      <div className="mt-8"><PremiumUnlock landId={id} onUnlocked={() => loadLand(id)}>{premium}</PremiumUnlock></div>
      {!unlocked && <div className="mt-5 text-center text-[8px] uppercase tracking-[0.2em] text-white/15">Public view is intentionally limited. Unlocking reveals the full report.</div>}
    </section>
  </main>;
}

function Loading() { return <main className="flex min-h-screen items-center justify-center bg-[#070908] text-white"><div className="h-8 w-8 animate-spin rounded-full border border-white/10 border-t-white" /></main>; }
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border border-white/7 bg-white/[0.025] p-6"><h2 className="mb-5 text-[8px] uppercase tracking-[0.22em] text-white/25">{title}</h2>{children}</section>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-white/[0.05] py-3 last:border-0"><span className="text-xs text-white/30">{label}</span><span className="text-xs text-white/65">{value}</span></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-white/7 bg-white/[0.02] p-4"><div className="text-[7px] uppercase tracking-[0.18em] text-white/20">{label}</div><div className="mt-2 truncate text-sm text-white/65">{value}</div></div>; }
function Mini({ label, active }: { label: string; active?: boolean }) { return <div className={`rounded-xl border p-4 text-center ${active ? "border-emerald-200/15 bg-emerald-200/[0.04]" : "border-white/7 bg-white/[0.02]"}`}><div className={`mx-auto h-2 w-2 rounded-full ${active ? "bg-emerald-300" : "bg-white/15"}`} /><div className="mt-3 text-[8px] uppercase tracking-[0.14em] text-white/35">{label}</div></div>; }
function Score({ label, value }: { label: string; value: number }) { return <div><div className="flex justify-between text-xs"><span className="text-white/35">{label}</span><span className="text-white/60">{value}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-white/60" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div></div>; }
