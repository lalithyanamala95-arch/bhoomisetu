"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers3, LocateFixed, Rotate3d, Satellite } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import type { LandListing } from "@/components/data/land-data";

const TerrainScene = dynamic(() => import("@/components/3d/TerrainScene"), { ssr: false, loading: () => <div className="flex h-full items-center justify-center bg-[#070908]"><div className="text-[8px] uppercase tracking-[0.25em] text-white/25">Building 3D terrain…</div></div> });

type ApiLand = {
  id: string; title: string; location: string; area: string; land_type: string; latitude?: number; longitude?: number;
  best_use?: string | null; suitability_score?: number | null; verified?: boolean; verification_level?: string | null;
  image_urls?: string[];
};

export default function ThreeDExplorePage() {
  const [lands, setLands] = useState<ApiLand[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lands", { cache: "no-store" }).then((response) => response.json()).then((result) => setLands(Array.isArray(result.data) ? result.data : [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const sceneLands = useMemo<LandListing[]>(() => {
    if (!lands.length) return [];
    const valid = lands.filter((land) => typeof land.latitude === "number" && typeof land.longitude === "number");
    const minLat = Math.min(...valid.map((l) => l.latitude as number));
    const maxLat = Math.max(...valid.map((l) => l.latitude as number));
    const minLon = Math.min(...valid.map((l) => l.longitude as number));
    const maxLon = Math.max(...valid.map((l) => l.longitude as number));
    return lands.map((land, index) => {
      const x = typeof land.longitude === "number" && maxLon !== minLon ? -5 + (((land.longitude - minLon) / (maxLon - minLon)) * 10) : -4 + (index % 5) * 2;
      const z = typeof land.latitude === "number" && maxLat !== minLat ? 4 - (((land.latitude - minLat) / (maxLat - minLat)) * 8) : -3 + (Math.floor(index / 5) % 4) * 2;
      return {
        id: land.id, title: land.title, location: land.location, area: land.area, landType: land.land_type,
        latitude: land.latitude, longitude: land.longitude, position: [x, z], width: 1.4, depth: 1.05,
        bestUse: land.best_use || "Pending", suitabilityScore: land.suitability_score || 0,
        useScores: { warehouse: 0, solarFarm: 0, commercial: 0, agriculture: 0 },
        estimatedRevenue: "Premium", estimatedValue: "Premium", pricePerAcre: "Premium",
        highwayDistance: "Premium", cityDistance: "Premium", roadAccess: "Premium",
        electricity: false, water: false, internet: false, terrain: "Premium", soil: "Premium", developmentDensity: "Premium", solarExposure: "Premium",
        verified: Boolean(land.verified), verificationLevel: land.verification_level || "Pending", highlights: [],
      };
    });
  }, [lands]);

  return <main className="min-h-screen bg-[#070908] text-white"><SiteHeader /><section className="px-4 pb-5 pt-[94px]"><div className="mx-auto max-w-[1600px]">
    <div className="mb-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><Link href="/explore" className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-white/25"><ArrowLeft size={11} /> Back to explore</Link><div className="mt-5 flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-emerald-200/45"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Spatial command view</div><h1 className="mt-3 text-4xl font-light tracking-[-0.06em] sm:text-6xl">Land, in three dimensions.</h1><p className="mt-3 max-w-2xl text-xs leading-6 text-white/25">A terrain-first view of the BhoomiSetu network. Parcels rise from the terrain, labels stay readable, and selecting a parcel opens its intelligence profile.</p></div><div className="flex flex-wrap gap-2"><Badge icon={Rotate3d} text="Orbit" /><Badge icon={Layers3} text="Terrain" /><Badge icon={Satellite} text="Spatial" /><Badge icon={LocateFixed} text={`${lands.length} parcels`} /></div></div>
    <div className="relative h-[calc(100vh-210px)] min-h-[620px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#070908] shadow-2xl">
      {loading ? <div className="flex h-full items-center justify-center"><div className="text-[8px] uppercase tracking-[0.25em] text-white/25">Loading land network…</div></div> : <TerrainScene lands={sceneLands} selectedLandId={selected} onLandSelect={(id) => setSelected(id)} />}
      <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl"><div className="text-[8px] uppercase tracking-[0.2em] text-white/55">BHOOMISETU</div><div className="mt-1 text-[7px] uppercase tracking-[0.18em] text-white/20">3D spatial network</div></div>
      {selected && <Link href={`/explore/${encodeURIComponent(selected)}`} className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-[8px] font-medium uppercase tracking-[0.18em] text-black shadow-2xl">Open selected land →</Link>}
    </div>
  </div></section></main>;
}

function Badge({ icon: Icon, text }: { icon: typeof Rotate3d; text: string }) { return <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-[8px] uppercase tracking-[0.16em] text-white/35"><Icon size={12} /> {text}</div>; }
