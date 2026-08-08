"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock3, ExternalLink, ShieldCheck, Users, WalletCards, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Recent = { id: string; title: string; location: string; area: string; land_type: string; verified: boolean; verification_level: string | null; created_at: string; image_urls?: string[] | null };

type Stats = { total: number; verified: number; pending: number; purchases: number; revenueInr: number };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, pending: 0, purchases: 0, revenueInr: 0 });
  const [recent, setRecent] = useState<Recent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Please sign in with the configured admin account.");
      const response = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Admin access denied.");
      setStats(result.stats);
      setRecent(result.recent || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load admin dashboard.");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function toggleVerified(land: Recent) {
    setUpdating(land.id);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || "";
      const response = await fetch("/api/admin/lands", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: land.id, verified: !land.verified }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to update property.");
      setRecent((items) => items.map((item) => item.id === land.id ? { ...item, verified: result.data.verified, verification_level: result.data.verification_level } : item));
      setStats((current) => ({ ...current, verified: current.verified + (land.verified ? -1 : 1), pending: current.pending + (land.verified ? 1 : -1) }));
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to update property."); }
    finally { setUpdating(null); }
  }

  return (
    <main className="min-h-screen bg-[#070908] text-white">
      <header className="border-b border-white/[0.06] bg-[#070908]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/bhoomisetu-logo.png" alt="BhoomiSetu" className="h-10 w-10 object-contain" />
            <div><div className="text-[12px] tracking-[0.3em]">BHOOMISETU</div><div className="mt-1 text-[7px] uppercase tracking-[0.25em] text-white/25">Control room</div></div>
          </Link>
          <div className="flex items-center gap-2"><Link href="/explore" className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.16em] text-white/40">Open platform</Link><button onClick={() => supabase.auth.signOut()} className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.16em] text-white/40">Sign out</button></div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div><div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-emerald-200/40"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Operations</div><h1 className="mt-4 text-5xl font-light tracking-[-0.06em]">Admin control room.</h1><p className="mt-4 max-w-2xl text-xs leading-6 text-white/30">Monitor submissions, verification, customer unlocks and platform activity without opening Supabase.</p></div>
          <button onClick={load} className="rounded-full border border-white/10 px-5 py-3 text-[8px] uppercase tracking-[0.18em] text-white/45">Refresh data</button>
        </div>

        {error && <div className="mt-7 rounded-2xl border border-red-300/10 bg-red-300/[0.03] p-5 text-xs text-red-100/60">{error}</div>}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={Users} label="Total listings" value={stats.total} />
          <Stat icon={ShieldCheck} label="Verified" value={stats.verified} />
          <Stat icon={Clock3} label="Awaiting review" value={stats.pending} />
          <Stat icon={WalletCards} label="Premium unlocks" value={stats.purchases} /><Stat icon={WalletCards} label="Premium revenue" value={stats.revenueInr} prefix="₹" />
        </div>

        <section className="mt-10 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5"><div><div className="text-[8px] uppercase tracking-[0.25em] text-white/20">Live queue</div><h2 className="mt-2 text-xl font-light">Recent land entries</h2></div><span className="text-[8px] uppercase tracking-[0.18em] text-white/20">Latest 12</span></div>
          {loading ? <div className="p-10 text-xs text-white/25">Loading operations…</div> : <div className="divide-y divide-white/[0.05]">{recent.map((land) => <div key={land.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[1.5fr_1fr_auto] lg:items-center"><div className="flex items-center gap-4"><div className="h-12 w-16 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">{land.image_urls?.[0] ? <img src={land.image_urls[0]} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[8px] text-white/20">NO IMAGE</div>}</div><div><div className="text-sm text-white/75">{land.title}</div><div className="mt-1 text-[9px] text-white/25">{land.location} · {land.area}</div></div></div><div><div className="text-[7px] uppercase tracking-[0.18em] text-white/20">Status</div><div className={`mt-1 text-xs ${land.verified ? "text-emerald-200/65" : "text-amber-200/55"}`}>{land.verified ? land.verification_level || "Verified" : "Pending verification"}</div></div><div className="flex items-center gap-2"><button disabled={updating === land.id} onClick={() => toggleVerified(land)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.16em] text-white/45 disabled:opacity-40"><Check size={11} /> {land.verified ? "Unverify" : "Verify"}</button><Link href={`/explore/${land.id}`} className="rounded-full border border-white/10 p-2.5 text-white/35"><ExternalLink size={13} /></Link></div></div>)}</div>}
        </section>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value, prefix = "" }: { icon: LucideIcon; label: string; value: number; prefix?: string }) {
  return <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03]"><Icon size={15} className="text-white/40" /></div><div className="mt-5 text-[8px] uppercase tracking-[0.2em] text-white/20">{label}</div><div className="mt-2 text-3xl font-light">{prefix}{value.toLocaleString("en-IN")}</div></div>;
}
