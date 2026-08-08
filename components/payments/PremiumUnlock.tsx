"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Props = { landId: string; children: ReactNode; onUnlocked?: () => void };

export default function PremiumUnlock({ landId, children, onUnlocked }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState("₹99");

  useEffect(() => {
    checkStatus();
  }, [landId]);

  async function getToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  }

  async function checkStatus() {
    try {
      const token = await getToken();
      const response = await fetch(`/api/payments/status?landId=${encodeURIComponent(landId)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      });
      const result = await response.json();
      setUnlocked(Boolean(result.unlocked));
    } finally {
      setLoading(false);
    }
  }

  async function loadCheckout() {
    if (window.Razorpay) return;
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-razorpay="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Payment checkout could not load.")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.dataset.razorpay = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Payment checkout could not load."));
      document.body.appendChild(script);
    });
  }

  async function unlock() {
    setError("");
    setPaying(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in before purchasing a report.");

      await loadCheckout();

      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ landId }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order.message || "Unable to start payment.");

      if (order.alreadyUnlocked) {
        setUnlocked(true);
        onUnlocked?.();
        return;
      }

      setPrice(`₹${Math.round(order.amount / 100)}`);

      if (!window.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "BhoomiSetu",
        description: `Premium land intelligence — ${order.productName}`,
        order_id: order.orderId,
        image: `${window.location.origin}/bhoomisetu-logo.png`,
        theme: { color: "#6D8F77" },
        handler: async (payment: Record<string, string>) => {
          const verify = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ landId, ...payment }),
          });
          const result = await verify.json();
          if (!verify.ok || !result.unlocked) {
            setError(result.message || "Payment could not be verified.");
            return;
          }
          setUnlocked(true);
          onUnlocked?.();
        },
        modal: { confirm_close: true },
      });

      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to unlock report.");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-xs text-white/30">Checking report access…</div>;
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0E0B] p-7 sm:p-9">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-300/[0.06] blur-3xl" />
      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <LockKeyhole size={17} className="text-white/50" />
        </div>
        <div className="mt-6 flex items-center gap-2 text-[8px] uppercase tracking-[0.24em] text-emerald-200/50">
          <Sparkles size={11} /> Premium intelligence
        </div>
        <h2 className="mt-3 text-2xl font-light tracking-[-0.04em]">Unlock the complete land report.</h2>
        <p className="mt-3 max-w-xl text-xs leading-6 text-white/30">
          Public visitors see the essential opportunity summary. The paid report reveals valuation, revenue potential, infrastructure, connectivity, physical characteristics and detailed use scoring.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {["Estimated value & revenue", "Infrastructure & connectivity", "Terrain, soil & solar analysis", "Detailed use scores & highlights"].map((item) => (
            <div key={item} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[10px] text-white/40">{item}</div>
          ))}
        </div>
        <button onClick={unlock} disabled={paying} className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[8px] font-medium uppercase tracking-[0.18em] text-black disabled:opacity-50">
          <ShieldCheck size={13} /> {paying ? "Opening secure checkout…" : `Unlock for ${price}`}
        </button>
        {error && <div className="mt-4 text-xs text-red-200/60">{error}</div>}
        <div className="mt-4 text-[8px] text-white/20">Secure checkout powered by Razorpay. Payment is verified server-side before access is granted.</div>
      </div>
    </div>
  );
}
