import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function publicData(data: Record<string, any>) {
  return {
    id: data.id,
    title: data.title,
    location: data.location,
    area: data.area,
    land_type: data.land_type,
    latitude: data.latitude,
    longitude: data.longitude,
    best_use: data.best_use,
    suitability_score: data.suitability_score,
    verified: data.verified,
    verification_level: data.verification_level,
    image_urls: data.image_urls ?? [],
    created_at: data.created_at,
  };
}

async function premiumData(data: Record<string, any>) {
  const useScores = {
    warehouse: data.use_scores?.warehouse ?? 0,
    solarFarm: data.use_scores?.solarFarm ?? 0,
    commercial: data.use_scores?.commercial ?? 0,
    agriculture: data.use_scores?.agriculture ?? 0,
  };

  const rankedUses = [
    { name: "Warehouse", score: useScores.warehouse },
    { name: "Solar Farm", score: useScores.solarFarm },
    { name: "Commercial", score: useScores.commercial },
    { name: "Agriculture", score: useScores.agriculture },
  ].sort((a, b) => b.score - a.score);

  let legalDocuments: Array<{ name: string; url: string }> = [];

  if (Array.isArray(data.legal_documents) && data.legal_documents.length) {
    try {
      const admin = getSupabaseAdmin();
      const signed = await Promise.all(
        data.legal_documents.map(async (path: string) => {
          const { data: signedData } = await admin.storage.from("land-documents").createSignedUrl(path, 60 * 60);
          return signedData?.signedUrl ? { name: path.split("/").pop() || "Legal document", url: signedData.signedUrl } : null;
        })
      );
      legalDocuments = signed.filter(Boolean) as Array<{ name: string; url: string }>;
    } catch (error) {
      console.error("Legal document signing error:", error);
    }
  }

  return {
    owner_contact: {
      phone: data.owner_phone ?? null,
      surveyNumber: data.survey_number ?? null,
    },
    legal_documents: legalDocuments,
    width: data.width,
    depth: data.depth,
    estimated_revenue: data.estimated_revenue,
    estimated_value: data.estimated_value,
    price_per_acre: data.price_per_acre,
    highway_distance: data.highway_distance,
    city_distance: data.city_distance,
    road_access: data.road_access,
    electricity: data.electricity ?? false,
    water: data.water ?? false,
    internet: data.internet ?? false,
    terrain: data.terrain,
    soil: data.soil,
    development_density: data.development_density,
    solar_exposure: data.solar_exposure,
    highlights: data.highlights ?? [],
    use_scores: useScores,
    intelligence: {
      overallScore: data.suitability_score ?? 0,
      bestUse: rankedUses[0],
      rankedUses,
      infrastructure: {
        electricity: data.electricity ?? false,
        water: data.water ?? false,
        internet: data.internet ?? false,
        roadAccess: data.road_access ?? "Unknown",
      },
      location: {
        highwayDistance: data.highway_distance ?? "Unknown",
        cityDistance: data.city_distance ?? "Unknown",
      },
      physical: {
        terrain: data.terrain ?? "Unknown",
        soil: data.soil ?? "Unknown",
        solarExposure: data.solar_exposure ?? "Unknown",
        developmentDensity: data.development_density ?? "Unknown",
      },
    },
  };
}

async function hasPremiumAccess(request: NextRequest, landId: string, ownerId: string | null) {
  const user = await getAuthenticatedUser(request);
  if (!user) return false;
  if (ownerId && user.id === ownerId) return true;

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (adminEmails.includes((user.email || "").toLowerCase())) return true;

  const { data } = await supabase
    .from("land_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("land_id", landId)
    .eq("status", "paid")
    .maybeSingle();

  return Boolean(data);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from("lands").select("*").eq("id", id).single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: "Land not found" }, { status: 404 });
    }

    const unlocked = await hasPremiumAccess(request, id, data.owner_id ?? null);

    return NextResponse.json({
      success: true,
      access: { premiumUnlocked: unlocked },
      data: {
        ...publicData(data),
        ...(unlocked ? await premiumData(data) : {}),
      },
    });
  } catch (error) {
    console.error("Land details API error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

    const { data: existing, error: existingError } = await supabase.from("lands").select("owner_id").eq("id", id).single();
    if (existingError || !existing || existing.owner_id !== user.id) {
      return NextResponse.json({ success: false, message: "You do not have permission to update this property." }, { status: 403 });
    }

    const body = await request.json();
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.filter((value: unknown): value is string => typeof value === "string").slice(0, 8)
      : [];
    const legalDocuments = Array.isArray(body.legalDocuments)
      ? body.legalDocuments.filter((value: unknown): value is string => typeof value === "string").slice(0, 8)
      : undefined;

    const updates: Record<string, unknown> = {
      image_urls: imageUrls,
      updated_at: new Date().toISOString(),
    };
    if (typeof body.ownerPhone === "string") updates.owner_phone = body.ownerPhone.trim();
    if (typeof body.surveyNumber === "string") updates.survey_number = body.surveyNumber.trim();
    if (legalDocuments !== undefined) updates.legal_documents = legalDocuments;

    const { data, error } = await supabase
      .from("lands")
      .update(updates)
      .eq("id", id)
      .eq("owner_id", user.id)
      .select("id,image_urls,owner_phone,survey_number,legal_documents")
      .single();

    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to update property." }, { status: 500 });
  }
}
