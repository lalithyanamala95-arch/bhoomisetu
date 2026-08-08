"use client";

import { useEffect, useRef } from "react";
import {
  setOptions,
  importLibrary,
} from "@googlemaps/js-api-loader";

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
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const initializedRef =
    useRef(false);

  useEffect(() => {
    if (
      initializedRef.current ||
      !containerRef.current
    ) {
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
          process.env
            .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          throw new Error(
            "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing from .env.local"
          );
        }

        /* ==================================================
           CONFIGURE GOOGLE MAPS LOADER
        ================================================== */

        setOptions({
          key: apiKey,
          v: "weekly",
        });

        /* ==================================================
           LOAD GOOGLE MAPS 3D LIBRARY
        ================================================== */

        const library =
          await importLibrary(
            "maps3d"
          );

        if (cancelled) {
          return;
        }

        /*
         * Do NOT use google.maps.Maps3DLibrary here.
         *
         * We intentionally use a local TypeScript type
         * so there is no "Cannot find namespace google"
         * error.
         */

        const {
          Map3DElement,
          Marker3DElement,
        } = library as unknown as {
          Map3DElement: any;
          Marker3DElement: any;
        };

        if (
          !Map3DElement ||
          !Marker3DElement
        ) {
          throw new Error(
            "Google Maps 3D library loaded, but Map3DElement or Marker3DElement is unavailable."
          );
        }

        if (!containerRef.current) {
          return;
        }

        /* ==================================================
           CLEAR OLD MAP
        ================================================== */

        containerRef.current.innerHTML = "";

        /* ==================================================
           CREATE 3D MAP
        ================================================== */

        const map =
          new Map3DElement({
            center: {
              lat: 13.1986,
              lng: 77.7066,
              altitude: 1500,
            },

            range: 15000,

            tilt: 60,

            heading: 0,

            mode: "HYBRID",

            gestureHandling:
              "GREEDY",
          });

        /* ==================================================
           MAP STYLING
        ================================================== */

        map.style.width = "100%";

        map.style.height = "100%";

        map.style.display = "block";

        map.style.position = "absolute";

        map.style.inset = "0";

        /* ==================================================
           INSERT MAP
        ================================================== */

        containerRef.current.appendChild(
          map
        );

        /* ==================================================
           ADD LAND MARKERS
        ================================================== */

        for (const land of lands) {
          if (cancelled) {
            break;
          }

          /*
           * Validate coordinates.
           */

          if (
            typeof land.latitude !==
              "number" ||
            !Number.isFinite(
              land.latitude
            ) ||
            typeof land.longitude !==
              "number" ||
            !Number.isFinite(
              land.longitude
            )
          ) {
            console.warn(
              "Skipping land with invalid coordinates:",
              land
            );

            continue;
          }

          /*
           * IMPORTANT:
           *
           * label MUST NOT be an empty string.
           *
           * This fixes your previous:
           *
           * Cannot set property "label"
           * to empty string
           */

          const marker =
            new Marker3DElement({
              position: {
                lat:
                  land.latitude,

                lng:
                  land.longitude,

                altitude: 50,
              },

              altitudeMode:
                "CLAMP_TO_GROUND",

              extruded: true,

              drawsWhenOccluded:
                true,

              label:
                land.title?.trim() ||
                "Land",
            });

          /* ==================================================
             MARKER CLICK
          ================================================== */

          marker.addEventListener(
            "gmp-click",
            () => {
              window.location.href =
                `/explore/${encodeURIComponent(
                  land.id
                )}`;
            }
          );

          /*
           * Add marker to map.
           */

          map.appendChild(
            marker
          );
        }

        console.log(
          "BhoomiSetu 3D Map loaded successfully.",
          {
            lands: lands.length,
          }
        );
      } catch (error) {
        console.error(
          "BhoomiSetu 3D Map Error:",
          error
        );

        initializedRef.current =
          false;

        if (
          cancelled ||
          !containerRef.current
        ) {
          return;
        }

        containerRef.current.innerHTML = "";

        /*
         * Error UI
         */

        const errorBox =
          document.createElement(
            "div"
          );

        errorBox.className =
          "flex h-full min-h-[600px] items-center justify-center bg-[#080B09]";

        const content =
          document.createElement(
            "div"
          );

        content.className =
          "max-w-md px-6 text-center";

        const title =
          document.createElement(
            "div"
          );

        title.className =
          "text-sm text-red-200/70";

        title.textContent =
          "Unable to load 3D map";

        const description =
          document.createElement(
            "div"
          );

        description.className =
          "mt-3 text-xs leading-6 text-white/30";

        description.textContent =
          error instanceof Error
            ? error.message
            : "Check your Google Maps configuration.";

        content.appendChild(
          title
        );

        content.appendChild(
          description
        );

        errorBox.appendChild(
          content
        );

        containerRef.current.appendChild(
          errorBox
        );
      }
    }

    initializeMap();

    return () => {
      cancelled = true;

      initializedRef.current =
        false;

      if (
        containerRef.current
      ) {
        containerRef.current.innerHTML =
          "";
      }
    };
  }, [lands]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#080B09]">

      {/* ==================================================
          3D MAP
      ================================================== */}

      <div
        ref={containerRef}
        className="absolute inset-0"
      />


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
            3D Spatial Intelligence
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