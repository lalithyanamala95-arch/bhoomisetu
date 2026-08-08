"use client";

import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

/* =========================================================
   TERRAIN HEIGHT FUNCTION
========================================================= */

export function getTerrainHeight(
  x: number,
  z: number
) {
  const broad =
    Math.sin(x * 0.42) * 0.42 +
    Math.cos(z * 0.36) * 0.32;

  const detail =
    Math.sin((x + z) * 0.72) * 0.14 +
    Math.cos((x - z) * 0.55) * 0.12;

  const valley =
    Math.sin(x * 0.22 + z * 0.18) * 0.18;

  return broad + detail + valley;
}

/* =========================================================
   TERRAIN COLOR
========================================================= */

function getTerrainColor(
  height: number
) {
  const normalized =
    THREE.MathUtils.clamp(
      (height + 1) / 2,
      0,
      1
    );

  const low =
    new THREE.Color("#0D120F");

  const middle =
    new THREE.Color("#1F2B23");

  const high =
    new THREE.Color("#3E5145");

  const color =
    new THREE.Color();

  if (normalized < 0.5) {
    color.lerpColors(
      low,
      middle,
      normalized * 2
    );
  } else {
    color.lerpColors(
      middle,
      high,
      (normalized - 0.5) * 2
    );
  }

  return color;
}

/* =========================================================
   SOLID TERRAIN
========================================================= */

function TerrainSurface() {
  const geometry = useMemo(() => {
    const geo =
      new THREE.PlaneGeometry(
        18,
        18,
        100,
        100
      );

    const position =
      geo.attributes.position;

    const colors: number[] = [];

    for (
      let i = 0;
      i < position.count;
      i++
    ) {
      const x =
        position.getX(i);

      const z =
        position.getY(i);

      const height =
        getTerrainHeight(
          x,
          z
        );

      position.setZ(
        i,
        height
      );

      const color =
        getTerrainColor(
          height
        );

      colors.push(
        color.r,
        color.g,
        color.b
      );
    }

    geo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(
        colors,
        3
      )
    );

    position.needsUpdate = true;

    geo.computeVertexNormals();

    return geo;
  }, []);

  return (
    <mesh
      geometry={geometry}
      position={[
        0,
        -0.52,
        0,
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        0,
      ]}
      receiveShadow
    >
      <meshStandardMaterial
        vertexColors
        roughness={1}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* =========================================================
   TOPOGRAPHIC CONTOURS

   These are NOT a rectangular graph.
   They are subtle contour marks following
   the terrain elevation.
========================================================= */

function Contours() {
  const contours =
    useMemo(() => {
      const result: THREE.Vector3[][] =
        [];

      const levels = [
        -0.45,
        -0.2,
        0.05,
        0.3,
        0.55,
      ];

      const size = 8;

      /*
       * Horizontal terrain contour sampling.
       */

      for (
        const level of levels
      ) {
        let current:
          THREE.Vector3[] = [];

        for (
          let x = -size;
          x <= size;
          x += 0.08
        ) {
          const zValues: number[] =
            [];

          for (
            let z = -size;
            z <= size;
            z += 0.12
          ) {
            const height =
              getTerrainHeight(
                x,
                z
              );

            if (
              Math.abs(
                height - level
              ) < 0.025
            ) {
              zValues.push(z);
            }
          }

          if (
            zValues.length > 0
          ) {
            const z =
              zValues[
                Math.floor(
                  zValues.length / 2
                )
              ];

            current.push(
              new THREE.Vector3(
                x,
                level - 0.47,
                z
              )
            );
          } else {
            if (
              current.length > 3
            ) {
              result.push(
                current
              );
            }

            current = [];
          }
        }

        if (
          current.length > 3
        ) {
          result.push(current);
        }
      }

      return result;
    }, []);

  return (
    <group>
      {contours.map(
        (points, index) => (
          <Line
            key={index}
            points={points}
            color="#8A9A8E"
            lineWidth={0.55}
            transparent
            opacity={0.1}
          />
        )
      )}
    </group>
  );
}

/* =========================================================
   MAIN TERRAIN
========================================================= */

export default function Terrain() {
  return (
    <group>
      <TerrainSurface />

      <Contours />
    </group>
  );
}