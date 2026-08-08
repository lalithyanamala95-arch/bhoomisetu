"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, MapPin, ShieldCheck, UploadCloud, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type FormState = {
  title: string; location: string; area: string; landType: string; purpose: string;
  latitude: string; longitude: string; roadAccess: string; nearbyHighway: string;
  water: boolean; electricity: boolean; internet: boolean;
  ownerPhone: string; surveyNumber: string;
};

const initialForm: FormState = {
  title: "", location: "", area: "", landType: "Agriculture", purpose: "Commercial",
  latitude: "", longitude: "", roadAccess: "", nearbyHighway: "", water: false, electricity: false, internet: false, ownerPhone: "", surveyNumber: "",
};

export default function OwnerDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [legalFiles, setLegalFiles] = useState<File[]>([]);
  const [legalNames, setLegalNames] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  async function checkAuth() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { setLoggedIn(false); return; }
      setLoggedIn(true); setUserId(user.id); setUserEmail(user.email ?? "");
    } catch { setLoggedIn(false); }
    finally { setCheckingAuth(false); }
  }

  function updateField(field: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function getLocation() {
    setError("");
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setForm((current) => ({ ...current, latitude: String(position.coords.latitude), longitude: String(position.coords.longitude) }));
        setMessage("Location captured successfully.");
      },
      () => setError("Unable to get your location. Enter latitude and longitude manually.")
    );
  }

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    const selected = Array.from(event.target.files || []);
    const valid = selected.filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024).slice(0, 8);
    if (valid.length !== selected.length) setError("Use image files only, up to 5 MB each. Maximum 8 images.");
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFiles(valid);
    setPreviewUrls(valid.map((file) => URL.createObjectURL(file)));
  }

  function removeImage(index: number) {
    const nextFiles = files.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewUrls[index]);
    setFiles(nextFiles);
    setPreviewUrls(nextFiles.map((file) => URL.createObjectURL(file)));
  }

  async function uploadImages(landId: string, uid: string) {
    const urls: string[] = [];
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${uid}/${landId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("land-images").upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
      const { data } = supabase.storage.from("land-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  function chooseLegalFiles(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    const selected = Array.from(event.target.files || []);
    const valid = selected.filter((file) => file.size <= 10 * 1024 * 1024).slice(0, 8);
    if (valid.length !== selected.length) setError("Legal documents must be 10 MB or smaller. Maximum 8 documents.");
    setLegalFiles(valid);
    setLegalNames(valid.map((file) => file.name));
  }

  async function uploadLegalDocuments(landId: string, uid: string) {
    const paths: string[] = [];
    for (const file of legalFiles) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${uid}/${landId}/${crypto.randomUUID()}-${safeName || `document.${extension}`}`;
      const { error: uploadError } = await supabase.storage.from("land-documents").upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
      if (uploadError) throw new Error(`Legal document upload failed: ${uploadError.message}`);
      paths.push(path);
    }
    return paths;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage("");
    if (!loggedIn || !userId) return setError("Please sign in before listing a property.");
    if (!form.title.trim() || !form.location.trim() || !form.area.trim()) return setError("Title, location and area are required.");
    if (!form.latitude || !form.longitude) return setError("Please enter the land coordinates or use current location.");
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Your session has expired. Please sign in again.");

      const response = await fetch("/api/lands", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          ownerId: session.user.id, title: form.title.trim(), location: form.location.trim(), area: form.area.trim(),
          landType: form.landType, purpose: form.purpose, latitude: Number(form.latitude), longitude: Number(form.longitude),
          width: 1, depth: 1, roadAccess: form.roadAccess.trim(), nearbyHighway: form.nearbyHighway.trim(),
          water: form.water, electricity: form.electricity, internet: form.internet,
          ownerPhone: form.ownerPhone.trim(), surveyNumber: form.surveyNumber.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || "Submission failed.");

      let uploadedImageUrls: string[] = [];

      if (files.length && result.data?.id) {
        uploadedImageUrls = await uploadImages(result.data.id, session.user.id);
      }

      let uploadedLegalDocuments: string[] = [];

      if (legalFiles.length && result.data?.id) {
        uploadedLegalDocuments = await uploadLegalDocuments(result.data.id, session.user.id);
      }

      if (result.data?.id && (files.length || legalFiles.length || form.ownerPhone.trim() || form.surveyNumber.trim())) {
        const patch = await fetch(`/api/lands/${encodeURIComponent(result.data.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({
            imageUrls: uploadedImageUrls,
            legalDocuments: uploadedLegalDocuments,
            ownerPhone: form.ownerPhone.trim(),
            surveyNumber: form.surveyNumber.trim(),
          }),
        });
        const patchResult = await patch.json();
        if (!patch.ok) throw new Error(patchResult?.message || "Property saved but additional property details could not be attached.");
      }

      setMessage("Property submitted successfully. It is now in the verification queue.");
      setForm(initialForm); setFiles([]); setLegalFiles([]); setLegalNames([]); previewUrls.forEach((url) => URL.revokeObjectURL(url)); setPreviewUrls([]);
    } catch (err) {
      console.error("PROPERTY SUBMISSION ERROR:", err);
      setError(err instanceof Error ? err.message : "Unable to submit property.");
    } finally { setSubmitting(false); }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/signin");
  }

  if (checkingAuth) return <Loading />;

  return (
    <main className="min-h-screen bg-[#070908] text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070908]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3"><img src="/bhoomisetu-logo.png" alt="BhoomiSetu" className="h-11 w-11 object-contain" /><div><div className="text-[12px] tracking-[0.3em]">BHOOMISETU</div><div className="mt-1 text-[7px] uppercase tracking-[0.25em] text-white/25">Owner workspace</div></div></Link>
          <div className="flex items-center gap-2"><Link href="/dashboard/owner/properties" className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.15em] text-white/45">My properties</Link>{loggedIn ? <button onClick={handleSignOut} className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[0.15em] text-white/45">Sign out</button> : <Link href="/signin" className="rounded-full bg-white px-4 py-2 text-[8px] uppercase tracking-[0.15em] text-black">Sign in</Link>}</div>
        </div>
      </header>

      <section className="mx-auto max-w-[1150px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="text-[8px] uppercase tracking-[0.3em] text-emerald-200/40">Owner workspace</div><h1 className="mt-4 text-5xl font-light tracking-[-0.06em]">Bring land into the network.</h1><p className="mt-5 max-w-2xl text-xs leading-6 text-white/30">Capture the property, location, infrastructure and photographs. Every listing enters a verification queue before becoming a trusted BhoomiSetu parcel.</p>{loggedIn && <div className="mt-4 text-[9px] text-white/25">Signed in as <span className="text-white/50">{userEmail}</span></div>}</div><div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"><div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-emerald-200/50"><ShieldCheck size={12} /> Verification workflow</div><div className="mt-2 text-[10px] text-white/30">Submitted → reviewed → verified → discoverable</div></div></div>

        {!loggedIn ? <div className="mt-10 rounded-3xl border border-amber-200/10 bg-amber-200/[0.025] p-7"><div className="text-sm text-white/65">Sign in to list a property.</div><Link href="/signin" className="mt-5 inline-flex rounded-full bg-white px-6 py-3 text-[8px] uppercase tracking-[0.18em] text-black">Sign in</Link></div> : <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><SectionNumber number="01" title="Property identity" /><div className="grid gap-5 md:grid-cols-2"><Field label="Property title" placeholder="Bengaluru Rural Estate" value={form.title} onChange={(v) => updateField("title", v)} /><Field label="Location" placeholder="Devanahalli, Karnataka" value={form.location} onChange={(v) => updateField("location", v)} /><Field label="Area" placeholder="10.5 acres" value={form.area} onChange={(v) => updateField("area", v)} /><Select label="Land type" value={form.landType} onChange={(v) => updateField("landType", v)} options={["Agriculture","Commercial","Industrial","Residential","Renewable Energy"]} /><Select label="Potential use" value={form.purpose} onChange={(v) => updateField("purpose", v)} options={["Commercial","Warehouse","Solar Farm","Agriculture","Industrial","Residential"]} /></div></section>

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><SectionNumber number="02" title="Ownership & premium contact details" /><p className="mt-2 max-w-2xl text-xs leading-6 text-white/25">These details stay hidden from public viewers. After a buyer completes the ₹99 premium unlock, the phone number, survey number and uploaded legal papers become available for that property.</p><div className="mt-6 grid gap-5 md:grid-cols-2"><Field label="Owner phone number" placeholder="+91 7996631113" value={form.ownerPhone} onChange={(v) => updateField("ownerPhone", v)} /><Field label="Survey number" placeholder="Survey No. 42/3A" value={form.surveyNumber} onChange={(v) => updateField("surveyNumber", v)} /></div></section>

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><SectionNumber number="03" title="Legal documents" /><p className="mt-2 max-w-2xl text-xs leading-6 text-white/25">Upload ownership and verification papers such as sale deed, RTC, EC, survey sketch or other relevant documents. These files are stored privately and are released only after premium access is verified.</p><label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center transition hover:border-white/20"><span className="text-[9px] uppercase tracking-[0.2em] text-white/45">Choose legal documents</span><span className="mt-2 text-[8px] text-white/20">PDF, JPG, PNG · max 10 MB each · maximum 8</span><input type="file" accept="application/pdf,image/*" multiple className="hidden" onChange={chooseLegalFiles} /></label>{legalNames.length > 0 && <div className="mt-5 space-y-2">{legalNames.map((name) => <div key={name} className="rounded-xl border border-white/7 bg-white/[0.02] px-4 py-3 text-xs text-white/45">{name}</div>)}</div>}</section>

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><SectionNumber number="04" title="Spatial location" /><div className="grid gap-5 md:grid-cols-2"><Field label="Latitude" placeholder="13.1986" value={form.latitude} onChange={(v) => updateField("latitude", v)} /><Field label="Longitude" placeholder="77.7066" value={form.longitude} onChange={(v) => updateField("longitude", v)} /></div><button type="button" onClick={getLocation} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-[8px] uppercase tracking-[0.18em] text-white/40"><MapPin size={12} /> Use current location</button></section>

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><SectionNumber number="05" title="Access & infrastructure" /><div className="grid gap-5 md:grid-cols-2"><Field label="Road access" placeholder="30 ft road" value={form.roadAccess} onChange={(v) => updateField("roadAccess", v)} /><Field label="Nearest highway" placeholder="NH 44 — 2 km" value={form.nearbyHighway} onChange={(v) => updateField("nearbyHighway", v)} /></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><Toggle title="Water" active={form.water} onClick={() => updateField("water", !form.water)} /><Toggle title="Electricity" active={form.electricity} onClick={() => updateField("electricity", !form.electricity)} /><Toggle title="Internet" active={form.internet} onClick={() => updateField("internet", !form.internet)} /></div></section>

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><SectionNumber number="06" title="Property photography" /><p className="mt-2 max-w-xl text-xs leading-6 text-white/25">Add up to 8 clear property photographs. These become part of the listing and help the verification team review the submission.</p><label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center transition hover:border-white/20"><UploadCloud size={22} className="text-white/35" /><span className="mt-3 text-[9px] uppercase tracking-[0.2em] text-white/45">Choose property images</span><span className="mt-2 text-[8px] text-white/20">JPG, PNG, WEBP · max 5 MB each</span><input type="file" accept="image/*" multiple className="hidden" onChange={chooseFiles} /></label>{previewUrls.length > 0 && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{previewUrls.map((url, index) => <div key={url} className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"><img src={url} alt="Property preview" className="h-full w-full object-cover" /><button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white/70"><X size={12} /></button></div>)}</div>}</section>

          {message && <div className="rounded-2xl border border-emerald-200/10 bg-emerald-200/[0.03] p-5 text-sm text-emerald-100/65">{message}</div>}
          {error && <div className="rounded-2xl border border-red-300/10 bg-red-300/[0.03] p-5 text-sm text-red-100/65">{error}</div>}

          <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/20"><ImagePlus size={12} /> Ready for verification</div><h2 className="mt-2 text-lg font-light">Submit property</h2><p className="mt-2 text-xs text-white/25">Your listing starts as Pending Verification.</p></div><button type="submit" disabled={submitting} className="rounded-xl bg-white px-8 py-4 text-[9px] uppercase tracking-[0.2em] text-black disabled:opacity-40">{submitting ? "Submitting…" : "Submit property →"}</button></div></section>
        </form>}
      </section>
    </main>
  );
}

function Loading() { return <main className="flex min-h-screen items-center justify-center bg-[#070908] text-white"><div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border border-white/10 border-t-white" /><p className="mt-4 text-[9px] uppercase tracking-[0.25em] text-white/30">Loading workspace</p></div></main>; }
function SectionNumber({ number, title }: { number: string; title: string }) { return <div className="mb-7"><div className="text-[8px] uppercase tracking-[0.25em] text-white/20">{number}</div><h2 className="mt-2 text-xl font-light">{title}</h2></div>; }
function Field({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) { return <div><label className="text-[8px] uppercase tracking-[0.2em] text-white/25">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/15 focus:border-white/25" /></div>; }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <div><label className="text-[8px] uppercase tracking-[0.2em] text-white/25">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#0b0f0c] px-4 py-3.5 text-sm text-white outline-none focus:border-white/25">{options.map((option) => <option key={option}>{option}</option>)}</select></div>; }
function Toggle({ title, active, onClick }: { title: string; active: boolean; onClick: () => void }) { return <button type="button" onClick={onClick} className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition ${active ? "border-emerald-200/20 bg-emerald-200/[0.06]" : "border-white/[0.08] bg-white/[0.02]"}`}><span className="text-xs text-white/55">{title}</span><span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-300" : "bg-white/15"}`} /></button>; }
