"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { LandListing } from "../data/land-data";

/* =========================================================
   TYPES
========================================================= */

type GoogleLandMapProps = {
  lands: LandListing[];
  selectedLandId?: string | null;
  onLandSelect?: (landId: string) => void;
};

/* =========================================================
   GOOGLE GLOBAL
========================================================= */

declare global {
  interface Window {
    google?: any;
  }
}

/* =========================================================
   DEFAULT CAMERA
========================================================= */

const DEFAULT_CENTER = {
  lat: 13.237625,
  lng: 77.736825,
  altitude: 1800,
};

const DEFAULT_TILT = 62;
const DEFAULT_HEADING = 15;
const DEFAULT_RANGE = 9000;

/* =========================================================
   SELECTED CAMERA
========================================================= */

const SELECTED_ALTITUDE = 700;
const SELECTED_TILT = 68;
const SELECTED_HEADING = 25;
const SELECTED_RANGE = 1800;

/* =========================================================
   GOOGLE MAPS 3D BOOTSTRAP LOADER
========================================================= */

function loadGoogleMaps3D(
  apiKey: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    /*
     * Already loaded correctly.
     */

    if (
      window.google?.maps?.importLibrary
    ) {
      resolve();
      return;
    }

    /*
     * If another part of the app is
     * already loading Google Maps,
     * wait for it.
     */

    const existing =
      document.querySelector(
        'script[data-bhoomisetu-google-bootstrap="true"]'
      );

    if (existing) {
      const check =
        window.setInterval(() => {
          if (
            window.google?.maps
              ?.importLibrary
          ) {
            window.clearInterval(
              check
            );

            resolve();
          }
        }, 50);

      window.setTimeout(() => {
        window.clearInterval(
          check
        );

        if (
          !window.google?.maps
            ?.importLibrary
        ) {
          reject(
            new Error(
              "Google Maps loader timed out."
            )
          );
        }
      }, 15000);

      return;
    }

    /*
     * This is Google's recommended
     * dynamic bootstrap loader.
     */

    const script =
      document.createElement(
        "script"
      );

    script.type =
      "text/javascript";

    script.dataset.bhoomisetuGoogleBootstrap =
      "true";

    script.textContent = `
      (g => {
        var h,
          a,
          k,
          p = "The Google Maps JavaScript API",
          c = "google",
          l = "importLibrary",
          q = "__ib__",
          m = document,
          b = window;

        b = b[c] || (b[c] = {});

        var d =
          b.maps ||
          (b.maps = {});

        var r = new Set();

        var e =
          new URLSearchParams();

        var u = () =>
          h ||
          (h = new Promise(
            async (f, n) => {
              await (
                a = m.createElement(
                  "script"
                )
              );

              e.set(
                "libraries",
                [...r] + ""
              );

              for (k in g) {
                e.set(
                  k.replace(
                    /[A-Z]/g,
                    t =>
                      "_" +
                      t[0].toLowerCase()
                  ),
                  g[k]
                );
              }

              e.set(
                "callback",
                c +
                  ".maps." +
                  q
              );

              a.src =
                "https://maps." +
                c +
                "apis.com/maps/api/js?" +
                e;

              d[q] = f;

              a.onerror = () =>
                (h = n(
                  Error(
                    p +
                      " could not load."
                  )
                ));

              a.nonce =
                m.querySelector(
                  "script[nonce]"
                )?.nonce || "";

              m.head.append(a);
            }
          ));

        d[l]
          ? console.warn(
              p +
                " only loads once. Ignoring:",
              g
            )
          : (d[l] = (
              f,
              ...n
            ) =>
              r.add(f) &&
              u().then(() =>
                d[l](
                  f,
                  ...n
                )
              ));
      })({
        key: "${apiKey}",
        v: "weekly"
      });
    `;

    /*
     * Add bootstrap loader.
     */

    document.head.appendChild(
      script
    );

    /*
     * Wait for importLibrary.
     */

    const check =
      window.setInterval(() => {
        if (
          window.google?.maps
            ?.importLibrary
        ) {
          window.clearInterval(
            check
          );

          resolve();
        }
      }, 50);

    window.setTimeout(() => {
      window.clearInterval(
        check
      );

      if (
        !window.google?.maps
          ?.importLibrary
      ) {
        reject(
          new Error(
            "Google Maps 3D loader timed out."
          )
        );
      }
    }, 15000);
  });
}

/* =========================================================
   VISUAL PARCEL POLYGON
========================================================= */

function createParcelPolygon(
  land: LandListing
) {
  const lat =
    land.latitude!;

  const lng =
    land.longitude!;

  /*
   * Visual approximation only.
   *
   * NOT legal cadastral boundaries.
   */

  const width =
    0.006 *
    (land.width / 2);

  const height =
    0.004 *
    (land.depth / 1.5);

  return [
    {
      lat:
        lat + height * 1.0,
      lng:
        lng - width * 0.85,
    },

    {
      lat:
        lat + height * 0.85,
      lng:
        lng + width * 0.95,
    },

    {
      lat:
        lat + height * 0.15,
      lng:
        lng + width * 1.05,
    },

    {
      lat:
        lat - height * 0.9,
      lng:
        lng + width * 0.7,
    },

    {
      lat:
        lat - height * 1.05,
      lng:
        lng - width * 0.8,
    },

    {
      lat:
        lat - height * 0.25,
      lng:
        lng - width * 1.05,
    },
  ];
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GoogleLandMap({
  lands,
  selectedLandId = null,
  onLandSelect,
}: GoogleLandMapProps) {
  /* =======================================================
     REFERENCES
  ======================================================== */

  const mapContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const mapRef =
    useRef<any>(null);

  const overlaysRef =
    useRef<any[]>([]);

  /* =======================================================
     STATE
  ======================================================== */

  const [
    ready,
    setReady,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    mapMode,
    setMapMode,
  ] = useState<
    "HYBRID" | "SATELLITE"
  >("HYBRID");

  const [
    hoveredLandId,
    setHoveredLandId,
  ] = useState<
    string | null
  >(null);

  /* =======================================================
     API KEY
  ======================================================== */

  const apiKey =
    process.env
      .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  /* =======================================================
     INITIALIZE 3D MAP
  ======================================================== */

  useEffect(() => {
    if (!apiKey) {
      setError(
        "Google Maps API key is missing."
      );

      return;
    }

    let cancelled = false;

    const apiKeyValue = apiKey;

    async function initializeMap() {
      try {
        /*
         * Load Google's official
         * dynamic bootstrap loader.
         */

        await loadGoogleMaps3D(
          apiKeyValue
        );

        if (cancelled) {
          return;
        }

        /*
         * Now import the 3D library.
         */

        const {
          Map3DElement,
        } =
          await window.google.maps.importLibrary(
            "maps3d"
          );

        if (cancelled) {
          return;
        }

        if (
          !mapContainerRef.current
        ) {
          return;
        }

        /*
         * Create 3D map.
         */

        const map =
          new Map3DElement({
            center:
              DEFAULT_CENTER,

            tilt:
              DEFAULT_TILT,

            heading:
              DEFAULT_HEADING,

            range:
              DEFAULT_RANGE,

            mode:
              mapMode,

            gestureHandling:
              "GREEDY",

            defaultUIHidden:
              false,

            fov: 45,

            maxTilt: 85,

            minTilt: 0,
          });

        map.style.width =
          "100%";

        map.style.height =
          "100%";

        map.style.display =
          "block";

        /*
         * Save map.
         */

        mapRef.current =
          map;

        /*
         * Insert into page.
         */

        mapContainerRef.current.appendChild(
          map
        );

        setReady(true);
      } catch (err) {
        console.error(
          "Google 3D map error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Google 3D map failed to load."
        );
      }
    }

    initializeMap();

    return () => {
      cancelled = true;

      /*
       * Remove map.
       */

      if (
        mapRef.current &&
        mapContainerRef.current
      ) {
        try {
          mapContainerRef.current.removeChild(
            mapRef.current
          );
        } catch {
          // Already removed.
        }
      }

      mapRef.current =
        null;
    };
  }, [apiKey]);

  /* =======================================================
     MAP MODE
======================================================= */

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.mode =
      mapMode;
  }, [mapMode]);

  /* =======================================================
     DRAW 3D LAND PARCELS
======================================================= */

  useEffect(() => {
    if (
      !ready ||
      !mapRef.current
    ) {
      return;
    }

    let cancelled = false;

    async function drawParcels() {
      try {
        const {
          Polygon3DInteractiveElement,
          Marker3DInteractiveElement,
        } =
          await window.google.maps.importLibrary(
            "maps3d"
          );

        if (cancelled) {
          return;
        }

        /*
         * Remove previous overlays.
         */

        overlaysRef.current.forEach(
          (overlay) => {
            try {
              overlay.remove();
            } catch {
              // Already removed.
            }
          }
        );

        overlaysRef.current =
          [];

        /*
         * Only lands with GPS.
         */

        const mappedLands =
          lands.filter(
            (land) =>
              typeof land.latitude ===
                "number" &&
              typeof land.longitude ===
                "number"
          );

        /*
         * Create overlays.
         */

        mappedLands.forEach(
          (land) => {
            const selected =
              selectedLandId ===
              land.id;

            const hovered =
              hoveredLandId ===
              land.id;

            const polygon =
              createParcelPolygon(
                land
              );

            /* ==========================================
               3D PARCEL
            ========================================== */

            const parcel =
              new Polygon3DInteractiveElement(
                {
                  fillColor:
                    selected
                      ? "#E5EEE850"
                      : hovered
                      ? "#B8C9BE22"
                      : "#91A29712",

                  strokeColor:
                    selected
                      ? "#FFFFFF"
                      : hovered
                      ? "#DCE8DE"
                      : "#A8B8AD",

                  strokeWidth:
                    selected
                      ? 8
                      : hovered
                      ? 5
                      : 3,

                  drawsOccludedSegments:
                    false,

                  zIndex:
                    selected
                      ? 100
                      : hovered
                      ? 50
                      : 1,

                  altitudeMode:
                    "CLAMP_TO_GROUND",
                }
              );

            parcel.path =
              polygon;

            /*
             * Hover.
             */

            parcel.addEventListener(
              "mouseenter",
              () => {
                setHoveredLandId(
                  land.id
                );
              }
            );

            parcel.addEventListener(
              "mouseleave",
              () => {
                setHoveredLandId(
                  null
                );
              }
            );

            /*
             * Click.
             */

            parcel.addEventListener(
              "gmp-click",
              () => {
                onLandSelect?.(
                  land.id
                );

                setHoveredLandId(
                  null
                );
              }
            );

            mapRef.current.appendChild(
              parcel
            );

            overlaysRef.current.push(
              parcel
            );

            /* ==========================================
               3D MARKER

               NO LABEL.
            ========================================== */

            const marker =
              new Marker3DInteractiveElement(
                {
                  position: {
                    lat:
                      land.latitude!,

                    lng:
                      land.longitude!,
                  },

                  altitudeMode:
                    "CLAMP_TO_GROUND",

                  sizePreserved:
                    true,

                  extruded:
                    false,
                }
              );

            /*
             * Marker click.
             */

            marker.addEventListener(
              "gmp-click",
              () => {
                onLandSelect?.(
                  land.id
                );

                setHoveredLandId(
                  null
                );
              }
            );

            mapRef.current.appendChild(
              marker
            );

            overlaysRef.current.push(
              marker
            );
          }
        );
      } catch (err) {
        console.error(
          "3D parcel error:",
          err
        );
      }
    }

    drawParcels();

    return () => {
      cancelled = true;
    };
  }, [
    ready,
    lands,
    selectedLandId,
    hoveredLandId,
    onLandSelect,
  ]);

  /* =======================================================
     CAMERA
======================================================= */

  useEffect(() => {
    if (
      !mapRef.current ||
      !ready
    ) {
      return;
    }

    /*
     * No selected land.
     */

    if (!selectedLandId) {
      mapRef.current.center =
        DEFAULT_CENTER;

      mapRef.current.tilt =
        DEFAULT_TILT;

      mapRef.current.heading =
        DEFAULT_HEADING;

      mapRef.current.range =
        DEFAULT_RANGE;

      return;
    }

    /*
     * Find selected land.
     */

    const selectedLand =
      lands.find(
        (land) =>
          land.id ===
          selectedLandId
      );

    if (
      !selectedLand ||
      typeof selectedLand.latitude !==
        "number" ||
      typeof selectedLand.longitude !==
        "number"
    ) {
      return;
    }

    /*
     * Move camera.
     */

    mapRef.current.center = {
      lat:
        selectedLand.latitude,

      lng:
        selectedLand.longitude,

      altitude:
        SELECTED_ALTITUDE,
    };

    mapRef.current.tilt =
      SELECTED_TILT;

    mapRef.current.heading =
      SELECTED_HEADING;

    mapRef.current.range =
      SELECTED_RANGE;
  }, [
    selectedLandId,
    lands,
    ready,
  ]);

  /* =======================================================
     CLOSE INTELLIGENCE
======================================================= */

  const closeIntelligence =
    () => {
      onLandSelect?.("");

      setHoveredLandId(
        null
      );
    };

  /* =======================================================
     ERROR
======================================================= */

  if (error) {
    return (
      <div className="flex h-full min-h-[600px] items-center justify-center bg-[#070908]">

        <div className="max-w-md rounded-2xl border border-red-400/10 bg-red-400/[0.03] px-6 py-5 text-center">

          <div className="text-sm text-red-200/70">
            3D map could not load
          </div>

          <div className="mt-2 text-xs leading-5 text-white/30">
            {error}
          </div>

        </div>

      </div>
    );
  }

  /* =======================================================
     SELECTED LAND
======================================================= */

  const selectedLand =
    lands.find(
      (land) =>
        land.id ===
        selectedLandId
    ) ?? null;

  /* =======================================================
     UI
======================================================= */

  return (
    <div className="relative h-full min-h-[600px] w-full overflow-hidden bg-[#070908]">

      {/* =================================================
          GOOGLE 3D MAP
      ================================================= */}

      <div
        ref={
          mapContainerRef
        }
        className="absolute inset-0"
      />

      {/* =================================================
          LOADING
      ================================================= */}

      {!ready && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#070908]">

          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-white/10 border-t-white/70" />

            <div className="mt-4 text-[9px] uppercase tracking-[0.25em] text-white/30">
              Building 3D terrain
            </div>

          </div>

        </div>
      )}

      {/* =================================================
          BRAND
      ================================================= */}

      <div className="pointer-events-none absolute left-5 top-5 z-40">

        <div className="rounded-xl border border-white/10 bg-black/55 px-4 py-3 shadow-2xl backdrop-blur-xl">

          <div className="flex items-center gap-2">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />

            <span className="text-[9px] uppercase tracking-[0.2em] text-white/70">
              BhoomiSetu
            </span>

          </div>

          <div className="mt-1 text-xs text-white/40">
            3D Spatial Intelligence
          </div>

        </div>

      </div>

      {/* =================================================
          SATELLITE / HYBRID
      ================================================= */}

      <div className="absolute right-5 top-5 z-40">

        <button
          type="button"
          onClick={() =>
            setMapMode(
              mapMode ===
                "HYBRID"
                ? "SATELLITE"
                : "HYBRID"
            )
          }
          className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-[9px] uppercase tracking-[0.15em] text-white/65 shadow-2xl backdrop-blur-xl transition hover:bg-black/80 hover:text-white"
        >
          {mapMode ===
          "HYBRID"
            ? "Satellite"
            : "Hybrid"}
        </button>

      </div>

      {/* =================================================
          3D HINT
      ================================================= */}

      {!selectedLand &&
        ready && (
          <div className="pointer-events-none absolute bottom-5 right-5 z-40">

            <div className="rounded-xl border border-white/8 bg-black/45 px-4 py-3 backdrop-blur-xl">

              <div className="text-[8px] uppercase tracking-[0.18em] text-white/35">
                3D terrain
              </div>

              <div className="mt-1 text-[9px] text-white/20">
                Drag to rotate · scroll to zoom
              </div>

            </div>

          </div>
        )}

      {/* =================================================
          INTELLIGENCE CARD
      ================================================= */}

      {selectedLand && (
        <div
          className="absolute bottom-5 left-5 z-50 w-[min(400px,calc(100%-40px))]"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          <div className="rounded-2xl border border-white/10 bg-[#090C0A]/95 p-5 shadow-2xl backdrop-blur-2xl">

            <div className="flex items-start justify-between gap-5">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                    BhoomiSetu Verified
                  </span>

                </div>

                <h2 className="mt-2 truncate text-lg font-medium text-white">
                  {selectedLand.title}
                </h2>

                <p className="mt-1 truncate text-[10px] text-white/35">
                  {selectedLand.location}
                </p>

              </div>

              <div className="shrink-0 text-right">

                <div className="text-2xl font-medium text-white">
                  {
                    selectedLand.suitabilityScore
                  }
                  %
                </div>

                <div className="text-[8px] uppercase tracking-[0.18em] text-white/25">
                  AI Score
                </div>

              </div>

            </div>

            <div className="my-5 h-px bg-white/8" />

            <div className="grid grid-cols-3 gap-3">

              <div>

                <div className="text-[8px] uppercase tracking-[0.15em] text-white/25">
                  Area
                </div>

                <div className="mt-1 text-xs text-white/70">
                  {selectedLand.area}
                </div>

              </div>

              <div>

                <div className="text-[8px] uppercase tracking-[0.15em] text-white/25">
                  Best use
                </div>

                <div className="mt-1 truncate text-xs text-white/70">
                  {selectedLand.bestUse}
                </div>

              </div>

              <div>

                <div className="text-[8px] uppercase tracking-[0.15em] text-white/25">
                  Value
                </div>

                <div className="mt-1 truncate text-xs text-white/70">
                  {selectedLand.estimatedValue}
                </div>

              </div>

            </div>

            <div className="mt-4 rounded-xl border border-white/6 bg-white/[0.025] p-3">

              <div className="flex items-center justify-between gap-4">

                <span className="text-[8px] uppercase tracking-[0.15em] text-white/25">
                  Estimated monthly revenue
                </span>

                <span className="text-xs text-white/70">
                  {
                    selectedLand.estimatedRevenue
                  }
                </span>

              </div>

            </div>

            <button
              type="button"
              onClick={
                closeIntelligence
              }
              className="mt-4 w-full rounded-xl border border-white/8 py-3 text-[9px] uppercase tracking-[0.18em] text-white/35 transition hover:bg-white/5 hover:text-white/60"
            >
              Close intelligence
            </button>

          </div>

        </div>
      )}

    </div>
  );
}