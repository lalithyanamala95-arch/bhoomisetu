import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const publicLandFields = "id,title,location,area,land_type,latitude,longitude,best_use,suitability_score,verified,verification_level,image_urls,created_at";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("lands")
      .select(publicLandFields)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data?.length ?? 0, data: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to load lands." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.ownerId) return NextResponse.json({ success: false, message: "Owner information is missing. Please sign in again." }, { status: 401 });
    if (!body.title?.trim()) return NextResponse.json({ success: false, message: "Property title is required." }, { status: 400 });
    if (!body.location?.trim()) return NextResponse.json({ success: false, message: "Property location is required." }, { status: 400 });
    if (!body.area?.trim()) return NextResponse.json({ success: false, message: "Property area is required." }, { status: 400 });

    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return NextResponse.json({ success: false, message: "Invalid latitude." }, { status: 400 });
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return NextResponse.json({ success: false, message: "Invalid longitude." }, { status: 400 });

    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.filter((value: unknown): value is string => typeof value === "string").slice(0, 8)
      : [];
    const legalDocuments = Array.isArray(body.legalDocuments)
      ? body.legalDocuments.filter((value: unknown): value is string => typeof value === "string").slice(0, 8)
      : [];

    const landRecord = {
      id: `LAND-${Date.now()}`,
      owner_id: body.ownerId,
      title: body.title.trim(),
      location: body.location.trim(),
      area: body.area.trim(),
      land_type: body.landType || "Agriculture",
      latitude,
      longitude,
      width: Number(body.width) || 1,
      depth: Number(body.depth) || 1,
      best_use: body.purpose || "Pending Analysis",
      suitability_score: 0,
      estimated_revenue: "Pending Analysis",
      estimated_value: "Pending Valuation",
      price_per_acre: "Pending Valuation",
      highway_distance: body.nearbyHighway?.trim() || "Unknown",
      city_distance: "Unknown",
      road_access: body.roadAccess?.trim() || "Unknown",
      electricity: Boolean(body.electricity),
      water: Boolean(body.water),
      internet: Boolean(body.internet),
      terrain: "Pending Analysis",
      soil: "Pending Analysis",
      development_density: "Pending Analysis",
      solar_exposure: "Pending Analysis",
      verified: false,
      verification_level: "Pending Verification",
      highlights: ["Owner submitted", "Pending verification"],
      use_scores: { warehouse: 0, solarFarm: 0, commercial: 0, agriculture: 0 },
      image_urls: imageUrls,
      owner_phone: typeof body.ownerPhone === "string" ? body.ownerPhone.trim() : null,
      survey_number: typeof body.surveyNumber === "string" ? body.surveyNumber.trim() : null,
      legal_documents: legalDocuments,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("lands").insert(landRecord).select("*").single();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      return NextResponse.json({ success: false, message: error.message || "Unable to save property.", error: { code: error.code ?? null, details: error.details ?? null, hint: error.hint ?? null } }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Property submitted successfully.", data }, { status: 201 });
  } catch (error) {
    console.error("LAND POST ERROR:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Server error." }, { status: 500 });
  }
}
