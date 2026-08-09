"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type Land = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  suitability_score?: number | null;
};

type Props = {
  lands?: Land[];
};

export default function BhoomiSetu3DMap({
  lands = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) {
      return;
    }

    initializedRef.current = true;

    let cancelled = false;

    async function initializeMap() {
      try {
        /* ==================================================
           GOOGLE MAPS API KEY
        ================================================== */

        const apiKey =
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          throw new Error(
            "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing from .env.local"
          );
        }

        /* ==================================================
           LOAD GOOGLE MAPS
        ================================================== */

        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places"],
        });

        const { Map } = await loader.importLibrary("maps");

        if (cancelled || !containerRef.current) {
          return;
        }

        /* ==================================================
           CREATE MAP
        ================================================== */

        const map = new Map(containerRef.current, {
          zoom: 10,
          center: {
            lat: 13.1986,
            lng: 77.7066,
          },
          mapTypeId: "satellite",
          styles: [
            {
              elementType: "geometry",
              stylers: [
                {
                  color: "#1d2c4d",
                },
              ],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [
                {
                  color: "#8bc34a",
                },
              ],
            },
            {
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#ffffff",
                },
              ],
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#4b6741",
                },
              ],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [
                {
                  color: "#0a1929",
                },
              ],
            },
          ],
        });

        mapRef.current = map;

        /* ==================================================
           CLEAR OLD MARKERS
        ================================================== */

        markersRef.current.forEach((marker) =>
          marker.setMap(null)
        );
        markersRef.current = [];

        /* ==================================================
           ADD LAND MARKERS
        ================================================== */

        for (const land of lands) {
          if (cancelled) {
            break;
          }

          /* Validate coordinates */
          if (
            typeof land.latitude !== "number" ||
            !Number.isFinite(land.latitude) ||
            typeof land.longitude !== "number" ||
            !Number.isFinite(land.longitude)
          ) {
            console.warn(
              "Skipping land with invalid coordinates:",
              land
            );
            continue;
          }

          /* Create marker */
          const marker = new google.maps.Marker({
            position: {
              lat: land.latitude,
              lng: land.longitude,
            },
            map: map,
            title: land.title || "Land",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4ade80",
              fillOpacity: 0.8,
              strokeColor: "#22c55e",
              strokeWeight: 2,
            },
          });

          /* Marker click handler */
          marker.addListener("click", () => {
            window.location.href = `/explore/${encodeURIComponent(
              land.id
            )}`;
          });

          /* Info window */
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="color: #000; font-family: Arial, sans-serif; padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${land.title || "Land"}</h3>
                <p style="margin: 0; font-size: 12px;">Suitability: ${land.suitability_score || "N/A"}%</p>
              </div>
            `,
          });

          marker.addListener("mouseover", () => {
            infoWindow.open(map, marker);
          });

          marker.addListener("mouseout", () => {
            infoWindow.close();
          });

          markersRef.current.push(marker);
        }

        /* Auto-fit bounds if there are markers */
        if (lands.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          lands.forEach((land) => {
            if (
              Number.isFinite(land.latitude) &&
              Number.isFinite(land.longitude)
            ) {
              bounds.extend({
                lat: land.latitude,
                lng: land.longitude,
              });
            }
          });
          map.fitBounds(bounds);
        }

        console.log(
          "BhoomiSetu Map loaded successfully.",
          {
            lands: lands.length,
          }
        );
      } catch (error) {
        console.error("BhoomiSetu Map Error:", error);

        initializedRef.current = false;

        if (cancelled || !containerRef.current) {
          return;
        }

        containerRef.current.innerHTML = "";

        /* Error UI */
        const errorBox = document.createElement("div");
        errorBox.className =
          "flex h-full min-h-[600px] items-center justify-center bg-[#080B09]";

        const content = document.createElement("div");
        content.className = "max-w-md px-6 text-center";

        const title = document.createElement("div");
        title.className = "text-sm text-red-200/70";
        title.textContent = "Unable to load map";

        const description = document.createElement("div");
        description.className =
          "mt-3 text-xs leading-6 text-white/30";
        description.textContent =
          error instanceof Error
            ? error.message
            : "Check your Google Maps configuration.";

        content.appendChild(title);
        content.appendChild(description);
        errorBox.appendChild(content);
        containerRef.current.appendChild(errorBox);
      }
    }

    initializeMap();

    return () => {
      cancelled = true;
      initializedRef.current = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [lands]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#080B09]">
      {/* ==================================================
          GOOGLE MAP
      ================================================== */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* ==================================================
          BHOOMISETU BRAND
      ================================================== */}
      <div className="pointer-events-none absolute left-5 top-5 z-20">
        <div className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
            <span className="text-[9px] uppercase tracking-[0.22em] text-white/65">
              BHOOMISETU
            </span>
          </div>
          <div className="mt-1 text-[8px] text-white/30">
            Land Intelligence Map
          </div>
        </div>
      </div>

      {/* ==================================================
          LAND COUNT
      ================================================== */}
      <div className="pointer-events-none absolute bottom-5 right-5 z-20 hidden sm:block">
        <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-xl">
          <div className="text-[7px] uppercase tracking-[0.2em] text-white/25">
            Indexed land
          </div>
          <div className="mt-1 text-sm text-white/60">
            {lands.length}
          </div>
        </div>
      </div>
    </div>
  );
}
