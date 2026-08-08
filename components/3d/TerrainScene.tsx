"use client";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Stars,
} from "@react-three/drei";

import {
  useRef,
} from "react";

import * as THREE from "three";

import Terrain from "./Terrain";
import TerrainAtmosphere from "./TerrainAtmosphere";
import LandParcels from "./LandParcels";
import LandNetwork from "./LandNetwork";

import type {
  LandListing,
} from "../data/land-data";

/* =========================================================
   PROPS
========================================================= */

type TerrainSceneProps = {
  selectedLandId?: string | null;

  onLandSelect?: (
    landId: string
  ) => void;

  lands?: LandListing[];
};

/* =========================================================
   3D WORLD
========================================================= */

function SceneContent({
  selectedLandId,
  onLandSelect,
  lands,
}: TerrainSceneProps) {
  const worldRef =
    useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!worldRef.current) {
      return;
    }

    const time =
      state.clock.getElapsedTime();

    /*
     * Extremely subtle movement.
     * The terrain should feel like
     * a premium spatial intelligence map.
     */

    worldRef.current.rotation.y =
      Math.sin(
        time * 0.05
      ) * 0.018;

    worldRef.current.rotation.x =
      Math.sin(
        time * 0.035
      ) * 0.003;
  });

  return (
    <>
      {/* =================================================
          LIGHTING
      ================================================= */}

      <ambientLight
        intensity={0.7}
      />

      <directionalLight
        position={[
          5,
          10,
          6,
        ]}
        intensity={2}
      />

      <directionalLight
        position={[
          -5,
          5,
          -5,
        ]}
        intensity={0.35}
      />

      <pointLight
        position={[
          0,
          5,
          2,
        ]}
        intensity={0.8}
        distance={25}
      />

      {/* =================================================
          ATMOSPHERE
      ================================================= */}

      <fog
        attach="fog"
        args={[
          "#070908",
          12,
          30,
        ]}
      />

      <Stars
        radius={45}
        depth={30}
        count={160}
        factor={0.65}
        saturation={0}
        fade
        speed={0.05}
      />

      {/* =================================================
          LAND WORLD
      ================================================= */}

      <group
        ref={worldRef}
        position={[
          0,
          -0.15,
          0,
        ]}
      >
        <Terrain />

        <TerrainAtmosphere />

        {/* ACTUAL SUPABASE LAND DATA */}

        <LandParcels
          lands={lands}
          selectedLandId={
            selectedLandId
          }
          onLandSelect={
            onLandSelect
          }
        />

        <LandNetwork />
      </group>
    </>
  );
}

/* =========================================================
   CANVAS
========================================================= */

export default function TerrainScene({
  selectedLandId = null,
  onLandSelect,
  lands = [],
}: TerrainSceneProps) {
  return (
    <Canvas
      camera={{
        position: [
          0,
          7.2,
          9.8,
        ],
        fov: 48,
        near: 0.1,
        far: 100,
      }}
      dpr={[
        1,
        1.75,
      ]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference:
          "high-performance",
      }}
    >
      <SceneContent
        lands={lands}
        selectedLandId={
          selectedLandId
        }
        onLandSelect={
          onLandSelect
        }
      />
    </Canvas>
  );
}