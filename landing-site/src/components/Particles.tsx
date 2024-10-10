"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const SEPARATION = 60;
const AMOUNTX = 100; // Reduced for a smaller area
const AMOUNTY = 50; // Reduced for a smaller area
const SPEED = 0.05;
const WAVE_AMPLITUDE = 30; // Reduced for subtler waves

export const Particles: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let camera: THREE.PerspectiveCamera;
        let scene: THREE.Scene;
        let renderer: THREE.WebGLRenderer;
        let particles: THREE.Points;
        let positions: Float32Array;
        let count = 0;

        const init = () => {
            camera = new THREE.PerspectiveCamera(
                30,
                window.innerWidth / window.innerHeight,
                1,
                10000,
            );
            camera.position.y = 200;
            camera.position.z = -100;
            camera.rotation.x = -0.3;

            scene = new THREE.Scene();

            const numParticles = AMOUNTX * AMOUNTY;
            const geometry = new THREE.BufferGeometry();
            positions = new Float32Array(numParticles * 3);

            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                    positions[i + 1] = 0;
                    positions[i + 2] =
                        iy * SEPARATION - (AMOUNTY * SEPARATION - 10);
                    i += 3;
                }
            }

            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3),
            );

            const material = new THREE.PointsMaterial({
                color: new THREE.Color(0.5, 0.5, 1), // Blueish color
                opacity: 0.5,
                size: 2,
                blending: THREE.AdditiveBlending,
                transparent: true,
                sizeAttenuation: false,
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            });
            renderer.setSize(window.innerWidth, window.innerHeight / 2); // Half the height
            renderer.setClearColor(0x000000, 0);
            containerRef.current!.appendChild(renderer.domElement);

            window.addEventListener("resize", onWindowResize, false);
        };

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / (window.innerHeight / 2);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight / 2);
        };

        const animate = () => {
            requestAnimationFrame(animate);
            render();
        };

        const render = () => {
            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    positions[i + 1] =
                        Math.sin((ix + count) * 0.3) * WAVE_AMPLITUDE +
                        Math.sin((iy + count) * 0.5) * WAVE_AMPLITUDE;

                    i += 3;
                }
            }

            particles.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
            count += SPEED;
        };

        init();
        animate();

        return () => {
            window.removeEventListener("resize", onWindowResize);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} className="waves" />;
};
