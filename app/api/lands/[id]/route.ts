import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("lands")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Land API error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Land not found",
          error: error.message,
        },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Land not found",
        },
        { status: 404 }
      );
    }

    const useScores = {
      warehouse: data.use_scores?.warehouse ?? 0,
      solarFarm: data.use_scores?.solarFarm ?? 0,
      commercial: data.use_scores?.commercial ?? 0,
      agriculture: data.use_scores?.agriculture ?? 0,
    };

    const rankedUses = [
      {
        name: "Warehouse",
        score: useScores.warehouse,
      },
      {
        name: "Solar Farm",
        score: useScores.solarFarm,
      },
      {
        name: "Commercial",
        score: useScores.commercial,
      },
      {
        name: "Agriculture",
        score: useScores.agriculture,
      },
    ].sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      data: {
        ...data,

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
            highwayDistance:
              data.highway_distance ?? "Unknown",
            cityDistance:
              data.city_distance ?? "Unknown",
          },

          physical: {
            terrain: data.terrain ?? "Unknown",
            soil: data.soil ?? "Unknown",
            solarExposure:
              data.solar_exposure ?? "Unknown",
            developmentDensity:
              data.development_density ?? "Unknown",
          },
        },
      },
    });
  } catch (error) {
    console.error("Land details API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}