"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

import Terrain from "../3d/Terrain";
import TerrainAtmosphere from "../3d/TerrainAtmosphere";

/* =========================================================
   CINEMATIC LANDING WORLD
========================================================= */

function LandingWorld() {
  const worldRef =
    useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!worldRef.current) {
      return;
    }

    const time =
      state.clock.getElapsedTime();

    worldRef.current.rotation.y =
      Math.sin(time * 0.035) * 0.012;

    worldRef.current.rotation.x =
      Math.sin(time * 0.025) * 0.002;

    worldRef.current.position.y =
      -0.15 +
      Math.sin(time * 0.3) * 0.015;
  });

  return (
    <>
      {/* LIGHTING */}

      <ambientLight
        intensity={0.55}
      />

      <directionalLight
        position={[
          5,
          10,
          6,
        ]}
        intensity={1.7}
      />

      <directionalLight
        position={[
          -6,
          5,
          -5,
        ]}
        intensity={0.3}
      />

      <pointLight
        position={[
          0,
          4,
          2,
        ]}
        intensity={0.7}
        distance={25}
      />

      {/* ATMOSPHERE */}

      <fog
        attach="fog"
        args={[
          "#070908",
          10,
          30,
        ]}
      />

      <Stars
        radius={40}
        depth={25}
        count={120}
        factor={0.55}
        saturation={0}
        fade
        speed={0.025}
      />

      {/* TERRAIN */}

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
      </group>
    </>
  );
}

/* =========================================================
   LANDING TERRAIN
========================================================= */

export default function LandingTerrain() {
  return (
    <Canvas
      camera={{
        position: [
          0,
          6.8,
          10.5,
        ],
        fov: 48,
        near: 0.1,
        far: 100,
      }}
      dpr={[
        1,
        1.5,
      ]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference:
          "high-performance",
      }}
    >
      <LandingWorld />
    </Canvas>
  );
}