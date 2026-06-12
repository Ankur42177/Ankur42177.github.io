"use client";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#050505",
          },
        },
        particles: {
          color: {
            value: "#FFD700",
          },
          links: {
            color: "#FFD700",
            distance: 150,
            enable: true,
            opacity: 0.2,
          },
          move: {
            enable: true,
            speed: 1,
          },
          number: {
            value: 50,
          },
          opacity: {
            value: 0.2,
          },
          size: {
            value: 2,
          },
        },
      }}
    />
  );
}