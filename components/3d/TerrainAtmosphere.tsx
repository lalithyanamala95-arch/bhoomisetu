"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/* =========================================================
   SLOW INTELLIGENCE SCAN
========================================================= */

function ScanLine() {
  const lineRef =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!lineRef.current) {
      return;
    }

    const time =
      state.clock.getElapsedTime();

    const progress =
      (time * 0.025) % 1;

    lineRef.current.position.z =
      -8 + progress * 16;
  });

  return (
    <mesh
      ref={lineRef}
      position={[
        0,
        0.02,
        -8,
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        0,
      ]}
    >
      <planeGeometry
        args={[
          17,
          0.018,
        ]}
      />

      <meshBasicMaterial
        color="#C7D4CB"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* =========================================================
   SUBTLE GROUND GLOW
========================================================= */

function GroundGlow() {
  return (
    <mesh
      position={[
        0,
        -0.49,
        0,
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        0,
      ]}
    >
      <circleGeometry
        args={[
          10,
          96,
        ]}
      />

      <meshBasicMaterial
        color="#26352B"
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </mesh>
  );
}

/* =========================================================
   ATMOSPHERE
========================================================= */

export default function TerrainAtmosphere() {
  return (
    <group>
      <GroundGlow />

      <ScanLine />
    </group>
  );
}