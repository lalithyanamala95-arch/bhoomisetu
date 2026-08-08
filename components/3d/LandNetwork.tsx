"use client";

import { Html, Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

import { getTerrainHeight } from "./Terrain";

/* =========================================================
   ROAD
========================================================= */

type RoadProps = {
  points: [number, number][];
  width?: number;
  opacity?: number;
};

function Road({
  points,
  width = 1,
  opacity = 0.28,
}: RoadProps) {
  const roadPoints = useMemo(() => {
    const curve =
      new THREE.CatmullRomCurve3(
        points.map(([x, z]) => {
          const y =
            getTerrainHeight(x, z) - 0.43;

          return new THREE.Vector3(
            x,
            y,
            z
          );
        })
      );

    return curve.getPoints(100);
  }, [points]);

  return (
    <Line
      points={roadPoints}
      color="#9AA89E"
      lineWidth={width}
      transparent
      opacity={opacity}
    />
  );
}

/* =========================================================
   ROAD GLOW / SECONDARY ROAD
========================================================= */

function SecondaryRoad({
  points,
}: {
  points: [number, number][];
}) {
  const roadPoints = useMemo(() => {
    const curve =
      new THREE.CatmullRomCurve3(
        points.map(([x, z]) => {
          const y =
            getTerrainHeight(x, z) - 0.42;

          return new THREE.Vector3(
            x,
            y,
            z
          );
        })
      );

    return curve.getPoints(100);
  }, [points]);

  return (
    <Line
      points={roadPoints}
      color="#65736A"
      lineWidth={0.65}
      transparent
      opacity={0.22}
    />
  );
}

/* =========================================================
   LOCATION NODE
========================================================= */

type LocationNodeProps = {
  position: [number, number];
  name: string;
};

function LocationNode({
  position,
  name,
}: LocationNodeProps) {
  const [x, z] = position;

  const y =
    getTerrainHeight(x, z) - 0.27;

  return (
    <group
      position={[
        x,
        y,
        z,
      ]}
    >
      {/* Main point */}
      <mesh>
        <sphereGeometry
          args={[
            0.075,
            20,
            20,
          ]}
        />

        <meshBasicMaterial
          color="#E5EEE8"
        />
      </mesh>

      {/* Outer ring */}
      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <ringGeometry
          args={[
            0.11,
            0.135,
            32,
          ]}
        />

        <meshBasicMaterial
          color="#B9C9BF"
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical signal */}
      <Line
        points={[
          [0, 0, 0],
          [0, 0.32, 0],
        ]}
        color="#C7D5CC"
        lineWidth={0.5}
        transparent
        opacity={0.22}
      />

      {/* Label */}
      <Html
        position={[
          0,
          0.42,
          0,
        ]}
        center
        distanceFactor={7}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div className="rounded-full border border-white/8 bg-black/45 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] whitespace-nowrap text-white/40 backdrop-blur-md">
          {name}
        </div>
      </Html>
    </group>
  );
}

/* =========================================================
   ROAD INTERSECTION NODE
========================================================= */

function IntersectionNode({
  position,
}: {
  position: [number, number];
}) {
  const [x, z] = position;

  const y =
    getTerrainHeight(x, z) - 0.25;

  return (
    <mesh
      position={[
        x,
        y,
        z,
      ]}
    >
      <sphereGeometry
        args={[
          0.045,
          16,
          16,
        ]}
      />

      <meshBasicMaterial
        color="#9BAAA0"
        transparent
        opacity={0.65}
      />
    </mesh>
  );
}

/* =========================================================
   LAND NETWORK
========================================================= */

export default function LandNetwork() {
  return (
    <group>
      {/* =================================================
          PRIMARY HIGHWAY
      ================================================== */}

      <Road
        points={[
          [-8, -4],
          [-6.2, -3.55],
          [-4.4, -3.05],
          [-2.4, -2.55],
          [-0.2, -1.9],
          [2, -1.25],
          [4.1, -0.55],
          [6, 0.45],
          [7.6, 1.5],
        ]}
        width={1.25}
        opacity={0.3}
      />

      {/* =================================================
          SECONDARY ROAD
      ================================================== */}

      <SecondaryRoad
        points={[
          [-5.3, 4.2],
          [-4.1, 3.35],
          [-2.9, 2.3],
          [-1.7, 1.2],
          [-0.4, 0.05],
          [0.9, -1.25],
          [2.1, -2.35],
          [3.3, -3.2],
          [4.9, -4.15],
        ]}
      />

      {/* =================================================
          THIRD CONNECTOR
      ================================================== */}

      <SecondaryRoad
        points={[
          [-6.5, 1.2],
          [-4.7, 1.4],
          [-2.8, 1.55],
          [-0.9, 1.65],
          [1.1, 1.55],
          [3.2, 1.35],
          [5.3, 1.55],
        ]}
      />

      {/* =================================================
          INTERSECTIONS
      ================================================== */}

      <IntersectionNode
        position={[-4.5, -3.05]}
      />

      <IntersectionNode
        position={[-1.7, 1.2]}
      />

      <IntersectionNode
        position={[2.1, -2.35]}
      />

      <IntersectionNode
        position={[3.2, 1.35]}
      />

      {/* =================================================
          LOCATION INTELLIGENCE
      ================================================== */}

      <LocationNode
        position={[-5.2, 3.6]}
        name="City"
      />

      <LocationNode
        position={[5.5, 1.4]}
        name="Highway"
      />

      <LocationNode
        position={[1.7, -3.6]}
        name="Industrial Zone"
      />
    </group>
  );
}