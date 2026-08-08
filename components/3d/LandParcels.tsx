"use client";

import { Html } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as THREE from "three";

import { getTerrainHeight } from "./Terrain";

import {
  landListings,
  type LandListing,
} from "../data/land-data";

import LandIntelligenceCard from "./LandIntelligenceCard";

/* =========================================================
   PROPS
========================================================= */

type LandParcelsProps = {
  selectedLandId?: string | null;

  onLandSelect?: (
    landId: string
  ) => void;

  lands?: LandListing[];
};

/* =========================================================
   VISIBLE MAP AREA
========================================================= */

/*
 * These are VISUAL coordinates.
 *
 * We are not using kilometres here.
 *
 * We take the real GPS coordinates and
 * normalize them into this 3D area.
 */

const MAP_MIN_X = -5.5;
const MAP_MAX_X = 5.5;

const MAP_MIN_Z = -4.0;
const MAP_MAX_Z = 4.0;

/* =========================================================
   GET GPS BOUNDS
========================================================= */

function getCoordinateBounds(
  lands: LandListing[]
) {
  const withCoordinates =
    lands.filter(
      (land) =>
        typeof land.latitude ===
          "number" &&
        typeof land.longitude ===
          "number"
    );

  if (
    withCoordinates.length === 0
  ) {
    return null;
  }

  const latitudes =
    withCoordinates.map(
      (land) =>
        land.latitude as number
    );

  const longitudes =
    withCoordinates.map(
      (land) =>
        land.longitude as number
    );

  return {
    minLat:
      Math.min(...latitudes),

    maxLat:
      Math.max(...latitudes),

    minLon:
      Math.min(...longitudes),

    maxLon:
      Math.max(...longitudes),
  };
}

/* =========================================================
   GPS → VISIBLE 3D POSITION
========================================================= */

function coordinatesTo3D(
  land: LandListing,
  bounds: ReturnType<
    typeof getCoordinateBounds
  >
): [number, number] {

  /*
   * If coordinates aren't available,
   * use the existing visual position.
   */

  if (
    typeof land.latitude !==
      "number" ||
    typeof land.longitude !==
      "number" ||
    !bounds
  ) {
    return land.position;
  }

  const latRange =
    bounds.maxLat -
    bounds.minLat;

  const lonRange =
    bounds.maxLon -
    bounds.minLon;

  /*
   * Prevent division by zero.
   */

  const normalizedX =
    lonRange === 0
      ? 0.5
      : (land.longitude -
          bounds.minLon) /
        lonRange;

  const normalizedZ =
    latRange === 0
      ? 0.5
      : (land.latitude -
          bounds.minLat) /
        latRange;

  /*
   * Longitude:
   *
   * west  → left
   * east  → right
   */

  const x =
    MAP_MIN_X +
    normalizedX *
      (MAP_MAX_X -
        MAP_MIN_X);

  /*
   * Latitude:
   *
   * north → top
   * south → bottom
   *
   * Therefore Z is reversed.
   */

  const z =
    MAP_MAX_Z -
    normalizedZ *
      (MAP_MAX_Z -
        MAP_MIN_Z);

  return [
    x,
    z,
  ];
}

/* =========================================================
   PARCEL
========================================================= */

function Parcel({
  land,
  position,
  selected,
  onSelect,
}: {
  land: LandListing;

  position: [number, number];

  selected: boolean;

  onSelect: () => void;
}) {
  const [
    hovered,
    setHovered,
  ] = useState(false);

  const [
    x,
    z,
  ] = position;

  const y =
    getTerrainHeight(
      x,
      z
    ) - 0.45;

  /* =======================================================
     GEOMETRY
  ======================================================== */

  const geometry =
    useMemo(
      () =>
        new THREE.PlaneGeometry(
          land.width,
          land.depth
        ),
      [
        land.width,
        land.depth,
      ]
    );

  const edges =
    useMemo(
      () =>
        new THREE.EdgesGeometry(
          geometry
        ),
      [geometry]
    );

  const active =
    hovered || selected;

  return (
    <group
      position={[
        x,
        y,
        z,
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        0,
      ]}
    >
      {/* =================================================
          PARCEL SURFACE
      ================================================= */}

      <mesh
        geometry={geometry}
        onPointerEnter={(
          event
        ) => {
          event.stopPropagation();

          setHovered(true);

          document.body.style.cursor =
            "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);

          document.body.style.cursor =
            "default";
        }}
        onClick={(
          event
        ) => {
          event.stopPropagation();

          onSelect();
        }}
      >
        <meshBasicMaterial
          color={
            selected
              ? "#E8F3EA"
              : hovered
              ? "#C9D8CE"
              : "#91A297"
          }
          transparent
          opacity={
            selected
              ? 0.28
              : hovered
              ? 0.18
              : 0.08
          }
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      {/* =================================================
          BOUNDARY
      ================================================= */}

      <lineSegments
        geometry={edges}
      >
        <lineBasicMaterial
          color={
            selected
              ? "#FFFFFF"
              : hovered
              ? "#DCE8DE"
              : "#A8B8AD"
          }
          transparent
          opacity={
            selected
              ? 1
              : hovered
              ? 0.85
              : 0.5
          }
        />
      </lineSegments>

      {/* =================================================
          LAND LABEL
      ================================================= */}

      {!selected && (
        <Html
          position={[
            0,
            0.18,
            0,
          ]}
          center
          distanceFactor={6}
          style={{
            pointerEvents:
              "none",
            userSelect:
              "none",
          }}
        >
          <div className="rounded-full border border-white/10 bg-black/65 px-3 py-1.5 text-[9px] whitespace-nowrap text-white/75 shadow-xl backdrop-blur-md">

            <span className="mr-2 text-white/40">
              {land.bestUse}
            </span>

            <span className="font-medium text-white">
              {
                land.suitabilityScore
              }
              %
            </span>

          </div>
        </Html>
      )}

      {/* =================================================
          SELECTED LAND INTELLIGENCE
      ================================================= */}

      {selected && (
        <Html
          position={[
            0,
            0.8,
            0,
          ]}
          center
          distanceFactor={6}
          zIndexRange={[
            100,
            0,
          ]}
        >
          <div
            onClick={(
              event
            ) => {
              event.stopPropagation();
            }}
          >
            <LandIntelligenceCard
              land={land}
            />
          </div>
        </Html>
      )}
    </group>
  );
}

/* =========================================================
   LAND PARCELS
========================================================= */

export default function LandParcels({
  selectedLandId = null,
  onLandSelect,
  lands,
}: LandParcelsProps) {

  const [
    localSelectedId,
    setLocalSelectedId,
  ] = useState<
    string | null
  >(null);

  /*
   * Use the actual Supabase data.
   */

  const displayLands =
    lands &&
    lands.length > 0
      ? lands
      : landListings;

  /*
   * Calculate the GPS bounds once.
   */

  const coordinateBounds =
    useMemo(
      () =>
        getCoordinateBounds(
          displayLands
        ),
      [displayLands]
    );

  /*
   * Convert every land into a
   * visible 3D position.
   */

  const positionedLands =
    useMemo(() => {
      return displayLands.map(
        (land) => ({
          land,

          position:
            coordinatesTo3D(
              land,
              coordinateBounds
            ),
        })
      );
    }, [
      displayLands,
      coordinateBounds,
    ]);

  /*
   * Parent selection has priority.
   */

  const activeSelectedId =
    selectedLandId ??
    localSelectedId;

  /* =======================================================
     SELECT LAND
  ======================================================== */

  const selectLand = (
    landId: string
  ) => {
    setLocalSelectedId(
      landId
    );

    onLandSelect?.(
      landId
    );
  };

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <group>
      {positionedLands.map(
        ({
          land,
          position,
        }) => (
          <Parcel
            key={land.id}
            land={land}
            position={position}
            selected={
              activeSelectedId ===
              land.id
            }
            onSelect={() =>
              selectLand(
                land.id
              )
            }
          />
        )
      )}
    </group>
  );
}