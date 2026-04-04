"use client";

/**
 * HeroScene — VisionTech 3D hero.
 *
 * Changes in this revision:
 *  1. Torus rings removed — no circular halos anywhere in the scene.
 *  2. Phone scaled up ~2x (PHONE_W 2.0, PHONE_H 4.1) for visual dominance.
 *  3. Constrained Y oscillation +-17 degrees — front screen always visible.
 *  4. Scene background: pure black + exponential fog = floating in deep space.
 *  5. Luxury lighting rig: dramatic key, hair-light, rim, counter-rim, screen
 *     bounce. ACESFilmic tone-mapping at 1.35 exposure. Near-mirror materials.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const scene = new THREE.Scene();
    // Premium dark background: deep navy-obsidian, not pure black.
    // A large gradient quad behind everything gives atmospheric depth.
    scene.background = new THREE.Color(0x04091a);
    scene.fog = new THREE.FogExp2(0x04091a, 0.038);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      200
    );
    camera.position.set(4, 1.5, 9);
    camera.lookAt(1.5, 0, 0);

    // ── Background gradient plane ──────────────────────────────────────────
    // A large quad rendered behind everything. ShaderMaterial lets us paint a
    // radial warm-navy → deep-obsidian gradient that reads as premium depth,
    // not the harshness of pure black.
    const bgGeo = new THREE.PlaneGeometry(60, 40);
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false,
      side: THREE.FrontSide,
      uniforms: {
        uColorCenter: { value: new THREE.Color(0x0a1f48) }, // warm navy centre
        uColorEdge:   { value: new THREE.Color(0x020810) }, // near-black edge
        uColorAccent: { value: new THREE.Color(0x1a0e00) }, // very faint warm-gold tint bottom-right
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uColorCenter;
        uniform vec3 uColorEdge;
        uniform vec3 uColorAccent;
        varying vec2 vUv;
        void main() {
          // Radial gradient from slightly-above-centre
          vec2 centre = vec2(0.62, 0.55);
          float dist = length(vUv - centre) * 1.45;
          dist = clamp(dist, 0.0, 1.0);
          // Smooth-step the edge for a soft vignette
          float t = smoothstep(0.0, 1.0, dist);
          // Blend a faint gold warmth into the lower-right quadrant
          float warmth = clamp((vUv.x - 0.5) * (1.0 - vUv.y) * 1.4, 0.0, 1.0);
          vec3 col = mix(uColorCenter, uColorEdge, t);
          col = mix(col, uColorAccent, warmth * 0.35);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const bgPlane = new THREE.Mesh(bgGeo, bgMat);
    bgPlane.position.set(1.5, 0, -8); // behind all scene objects
    bgPlane.renderOrder = -1;
    scene.add(bgPlane);

    // Minimal ambient — stays dark so directional lights read sharply
    scene.add(new THREE.AmbientLight(0x020810, 0.8));

    // Key light — warm gold, tight radius
    const goldLight = new THREE.PointLight(0xffd060, 22, 14);
    goldLight.position.set(4, 5, 6);
    scene.add(goldLight);

    // Fill — cool blue-silver from low left
    const blueLight = new THREE.PointLight(0x6bb5f5, 8, 16);
    blueLight.position.set(-4, -1, 5);
    scene.add(blueLight);

    // Rim — strong warm gold from behind-right, outlines the frame
    const rimLight = new THREE.DirectionalLight(0xf0c060, 3.5);
    rimLight.position.set(5, 2, -3);
    scene.add(rimLight);

    // Counter-rim — cool blue, prevents crushing to pure black
    const counterRim = new THREE.DirectionalLight(0x4488bb, 1.2);
    counterRim.position.set(-5, 1, -4);
    scene.add(counterRim);

    // Screen bounce — soft gold from below, simulates display spill
    const screenBounce = new THREE.PointLight(0xc8a040, 4, 7);
    screenBounce.position.set(2.6, -2.5, 3);
    scene.add(screenBounce);

    // Hair-light — white pin-spot above, caps the top frame edge
    const hairLight = new THREE.SpotLight(0xfff0cc, 18, 12, Math.PI / 14, 0.3);
    hairLight.position.set(2.6, 7, 3);
    hairLight.target.position.set(2.6, 0, 0);
    scene.add(hairLight);
    scene.add(hairLight.target);

    // Screen spill — soft warm-white light close in front of screen face,
    // simulates the phone display illuminating the surrounding frame.
    const screenSpill = new THREE.PointLight(0xfff8ee, 5, 5);
    screenSpill.position.set(2.6, 0, 3.5);
    scene.add(screenSpill);

    // Frame accent — tight warm fill on the front face
    const frameFill = new THREE.PointLight(0xdeb860, 6, 10);
    frameFill.position.set(3.5, 1, 6);
    scene.add(frameFill);

    // ---- Phone model -------------------------------------------------------
    const phoneGroup = new THREE.Group();

    const PHONE_W = 2.0;
    const PHONE_H = 4.1;
    const PHONE_D = 0.16;
    const FRAME_T = 0.032;

    // Body
    phoneGroup.add(new THREE.Mesh(
      new THREE.BoxGeometry(PHONE_W, PHONE_H, PHONE_D, 2, 4, 1),
      new THREE.MeshStandardMaterial({
        color: 0x060d18, metalness: 0.25, roughness: 0.04, envMapIntensity: 2.2,
      })
    ));

    // Back glass
    const backGlass = new THREE.Mesh(
      new THREE.BoxGeometry(PHONE_W - 0.07, PHONE_H - 0.07, 0.007),
      new THREE.MeshStandardMaterial({
        color: 0x040c1a, metalness: 0.1, roughness: 0.02,
        transparent: true, opacity: 0.95, envMapIntensity: 3.0,
      })
    );
    backGlass.position.z = -(PHONE_D / 2) - 0.001;
    phoneGroup.add(backGlass);

    // Frame — 4 mirror-polished gold sides
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xc8a040, metalness: 0.99, roughness: 0.04, envMapIntensity: 4.0,
    });
    const frameSides: [number, number, number, number, number, number][] = [
      [PHONE_W + FRAME_T, FRAME_T, PHONE_D + FRAME_T,  0,                        PHONE_H / 2 + FRAME_T / 2, 0],
      [PHONE_W + FRAME_T, FRAME_T, PHONE_D + FRAME_T,  0,                       -PHONE_H / 2 - FRAME_T / 2, 0],
      [FRAME_T, PHONE_H + FRAME_T, PHONE_D + FRAME_T, -PHONE_W / 2 - FRAME_T / 2, 0,                        0],
      [FRAME_T, PHONE_H + FRAME_T, PHONE_D + FRAME_T,  PHONE_W / 2 + FRAME_T / 2, 0,                        0],
    ];
    frameSides.forEach(([w, h, d, x, y, z]) => {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 2, 2, 1), frameMat);
      seg.position.set(x, y, z);
      phoneGroup.add(seg);
    });

    // Outer gold rim lines
    phoneGroup.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(PHONE_W + 0.04, PHONE_H + 0.04, PHONE_D + 0.04)),
      new THREE.LineBasicMaterial({ color: 0xffd060, transparent: true, opacity: 0.9 })
    ));
    // Inner seam
    phoneGroup.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(PHONE_W + 0.001, PHONE_H + 0.001, PHONE_D)),
      new THREE.LineBasicMaterial({ color: 0xc8a040, transparent: true, opacity: 0.5 })
    ));

    // Screen bezel
    const screenBezel = new THREE.Mesh(
      new THREE.BoxGeometry(PHONE_W - 0.07, PHONE_H - 0.07, 0.010),
      new THREE.MeshStandardMaterial({ color: 0x030810, roughness: 0.9, metalness: 0.0 })
    );
    screenBezel.position.z = PHONE_D / 2 + 0.003;
    phoneGroup.add(screenBezel);

    // ── Screen: warm off-white — toned down from pure white ──────────────
    // #E8E2D4 is a warm parchment — premium, not blinding. Emissive off.
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xe8e2d4,       // warm parchment — not too white, not dark
      metalness: 0.0,
      roughness: 0.12,
      emissive: 0x000000,
      emissiveIntensity: 0.0,
      transparent: false,
    });
    const screenMesh = new THREE.Mesh(
      new THREE.BoxGeometry(PHONE_W - 0.18, PHONE_H - 0.18, 0.004),
      screenMat
    );
    screenMesh.position.z = PHONE_D / 2 + 0.008;
    phoneGroup.add(screenMesh);

    // ── Screen UI — light branded layout on white screen ──────────────────
    // All elements sit on top of the white screenMesh.
    // Colours are dark (navy/gold) on light background — inverted from before.
    const SZ = PHONE_D / 2 + 0.014;

    const ui = (
      w: number, h: number, x: number, y: number,
      color: number, ei: number, op = 1.0
    ) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.002),
        new THREE.MeshStandardMaterial({
          color, emissive: color, emissiveIntensity: ei,
          transparent: op < 1, opacity: op, roughness: 0.1, metalness: 0.0,
        })
      );
      m.position.set(x, y, SZ);
      return m;
    };

    // ── Status bar (light grey tint on white) ──────────────────────────────
    phoneGroup.add(ui(1.60, 0.075,  0,      1.97,  0xe8e0d0, 0.3, 0.6)); // bar bg
    phoneGroup.add(ui(0.28, 0.035, -0.55,   1.97,  0x1a3a6a, 0.8));       // time text
    phoneGroup.add(ui(0.12, 0.035,  0.60,   1.97,  0x1a3a6a, 0.8));       // signal

    // ── Dynamic island (stays black on white — real pill) ──────────────────
    // (defined separately below — skip here)

    // ── VS Logomark — centred on screen ───────────────────────────────────
    // Rendered as layered geometry: dark circle bg → gold "V" wedge → "S" bars.
    // This is the branded hero element of the screen.

    // Logo background circle (dark navy disc)
    const logoCircleMat = new THREE.MeshStandardMaterial({
      color: 0x04122b, metalness: 0.1, roughness: 0.3,
      emissive: 0x04122b, emissiveIntensity: 0.4,
    });
    const logoCircle = new THREE.Mesh(
      // Approximate circle with a high-segment cylinder (flat)
      new THREE.CylinderGeometry(0.38, 0.38, 0.003, 48),
      logoCircleMat
    );
    logoCircle.rotation.x = Math.PI / 2;
    logoCircle.position.set(0, 0.55, SZ + 0.001);
    phoneGroup.add(logoCircle);

    // Gold ring around logo circle
    const logoRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.40, 0.40, 0.002, 48, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xc8a550, emissive: 0xc8a550, emissiveIntensity: 1.0,
        side: THREE.BackSide, transparent: true, opacity: 0.85,
      })
    );
    logoRing.rotation.x = Math.PI / 2;
    logoRing.position.set(0, 0.55, SZ + 0.001);
    phoneGroup.add(logoRing);

    // "V" shape — deep navy arms, dark on the warm screen background
    const vLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.38, 0.004),
      new THREE.MeshStandardMaterial({ color: 0x04122b, emissive: 0x04122b, emissiveIntensity: 0.2 })
    );
    vLeft.rotation.z =  0.42;
    vLeft.position.set(-0.14, 0.52, SZ + 0.003);
    phoneGroup.add(vLeft);

    const vRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.38, 0.004),
      new THREE.MeshStandardMaterial({ color: 0x04122b, emissive: 0x04122b, emissiveIntensity: 0.2 })
    );
    vRight.rotation.z = -0.42;
    vRight.position.set(0.14, 0.52, SZ + 0.003);
    phoneGroup.add(vRight);

    // "S" — three horizontal bars of decreasing width (simplified S form)
    const sBars: [number, number, number][] = [
      [0.18, 0.70, 0.040],   // top bar
      [0.18, 0.56, 0.040],   // middle bar
      [0.18, 0.42, 0.040],   // bottom bar
    ];
    // Not shown — VS mark is just the V for clarity at this scale.
    // Instead add a thin "S" letterform as stacked rectangles with offset:
    phoneGroup.add(ui(0.22, 0.040,  0.085,  0.70,  0xc8a550, 1.4)); // S top
    phoneGroup.add(ui(0.22, 0.040,  0.065,  0.56,  0xc8a550, 1.4)); // S mid
    phoneGroup.add(ui(0.22, 0.040,  0.085,  0.42,  0xc8a550, 1.4)); // S bot
    phoneGroup.add(ui(0.040, 0.14,  0.185,  0.63,  0xc8a550, 1.4)); // S right-top stem
    phoneGroup.add(ui(0.040, 0.14, -0.055,  0.49,  0xc8a550, 1.4)); // S left-bot stem

    // Brand name text bars beneath logo (simulated with thin rects)
    phoneGroup.add(ui(0.60, 0.045,  0,      0.11,  0x04122b, 0.9));  // "VisionTech" wide bar
    phoneGroup.add(ui(0.32, 0.030,  0,      0.03,  0xc8a550, 0.8));  // "ELECTRONICS" narrow bar

    // ── Light divider line below branding ─────────────────────────────────
    phoneGroup.add(ui(1.25, 0.008,  0,     -0.12,  0xd4c090, 0.5, 0.5));

    // ── Product listing rows — dark text on light screen ──────────────────
    // Row bg cards (very light warm tint)
    const rowColors = [0x4fc87a, 0xc8a550, 0x6bb5f5]; // green / gold / blue dots
    [-0.32, -0.65, -0.98].forEach((y, i) => {
      phoneGroup.add(ui(1.40, 0.200,  0,      y,      0xede8de, 0.15, 0.7)); // card bg
      phoneGroup.add(ui(0.016, 0.200, -0.68,  y,      rowColors[i], 1.2));   // colour accent bar
      phoneGroup.add(ui(0.55, 0.040, -0.25,   y + 0.05, 0x04122b, 0.7));    // product name
      phoneGroup.add(ui(0.28, 0.030, -0.25,   y - 0.05, 0xc8a550, 0.9));    // price
      phoneGroup.add(ui(0.22, 0.030,  0.42,   y,      rowColors[i], 1.0));   // stock badge
    });

    // ── Gold CTA button at bottom of screen ───────────────────────────────
    phoneGroup.add(ui(1.25, 0.110,  0,     -1.38,  0xc8a550, 1.4));          // button gold fill
    phoneGroup.add(ui(0.55, 0.038,  0,     -1.38,  0x04122b, 0.6));          // button label (dark)

    // ── Bottom safe-area bar ──────────────────────────────────────────────
    phoneGroup.add(ui(0.35, 0.022,  0,     -1.90,  0x9a8860, 0.5, 0.6));     // home indicator

    // Dynamic Island
    const diMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.10, 0.014),
      new THREE.MeshStandardMaterial({ color: 0x020810, metalness: 0.2, roughness: 0.5 })
    );
    diMesh.position.set(0, PHONE_H / 2 - 0.17, PHONE_D / 2 + 0.010);
    phoneGroup.add(diMesh);

    const diLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.040, 0.040, 0.003),
      new THREE.MeshStandardMaterial({ color: 0x4fc87a, emissive: 0x4fc87a, emissiveIntensity: 3.0 })
    );
    diLed.position.set(0.13, PHONE_H / 2 - 0.17, PHONE_D / 2 + 0.012);
    phoneGroup.add(diLed);

    // Camera island (back)
    const CAM_X = -0.33;
    const CAM_Y =  1.33;
    const cameraIsland = new THREE.Mesh(
      new THREE.BoxGeometry(0.96, 0.96, 0.052),
      new THREE.MeshStandardMaterial({ color: 0x071428, metalness: 0.7, roughness: 0.25 })
    );
    cameraIsland.position.set(CAM_X, CAM_Y, -(PHONE_D / 2 + 0.022));
    phoneGroup.add(cameraIsland);

    const islandEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.99, 0.99, 0.055)),
      new THREE.LineBasicMaterial({ color: 0xc8a550, transparent: true, opacity: 0.4 })
    );
    islandEdge.position.copy(cameraIsland.position);
    phoneGroup.add(islandEdge);

    // Lenses
    const lensMat     = new THREE.MeshStandardMaterial({ color: 0x0d1f3c, metalness: 0.95, roughness: 0.04 });
    const lensRingMat = new THREE.MeshStandardMaterial({ color: 0xdeb860, metalness: 0.99, roughness: 0.06 });
    const lensGlowMat = new THREE.MeshStandardMaterial({
      color: 0x6bb5f5, emissive: 0x3a5a7a, emissiveIntensity: 0.8,
      metalness: 0.0, roughness: 0.0, transparent: true, opacity: 0.7,
    });

    ([ [-0.11, 0.13], [0.13, 0.13], [-0.11, -0.13] ] as [number,number][]).forEach(([lx, ly]) => {
      const lz = -(PHONE_D / 2 + 0.044);
      const cx = CAM_X + lx;
      const cy = CAM_Y + ly;

      const ring = new THREE.Mesh(new THREE.BoxGeometry(0.236, 0.236, 0.015), lensRingMat);
      ring.position.set(cx, cy, lz - 0.002);
      phoneGroup.add(ring);

      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.194, 0.194, 0.033), lensMat);
      lens.position.set(cx, cy, lz);
      phoneGroup.add(lens);

      const glow = new THREE.Mesh(new THREE.BoxGeometry(0.102, 0.102, 0.006), lensGlowMat);
      glow.position.set(cx, cy, lz + 0.011);
      phoneGroup.add(glow);
    });

    // Flash LED
    const flashLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.13, 0.022),
      new THREE.MeshStandardMaterial({
        color: 0xfff0cc, emissive: 0xf0d080, emissiveIntensity: 0.6,
        metalness: 0.3, roughness: 0.4,
      })
    );
    flashLed.position.set(CAM_X + 0.13, CAM_Y - 0.13, -(PHONE_D / 2 + 0.040));
    phoneGroup.add(flashLed);

    // Side buttons
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0xb89040, metalness: 0.97, roughness: 0.15 });

    const pwrBtn = new THREE.Mesh(new THREE.BoxGeometry(0.033, 0.33, 0.046), buttonMat);
    pwrBtn.position.set(PHONE_W / 2 + 0.033, 0.41, 0);
    phoneGroup.add(pwrBtn);

    [0.59, 0.15].forEach((y) => {
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.033, 0.24, 0.046), buttonMat);
      v.position.set(-(PHONE_W / 2 + 0.033), y, 0);
      phoneGroup.add(v);
    });

    const mute = new THREE.Mesh(new THREE.BoxGeometry(0.033, 0.12, 0.046), buttonMat);
    mute.position.set(-(PHONE_W / 2 + 0.033), 1.20, 0);
    phoneGroup.add(mute);

    // Corner glints
    const glintMat = new THREE.MeshStandardMaterial({
      color: 0xf0d080, emissive: 0xf0d080, emissiveIntensity: 3.0,
    });
    ([[1,1],[1,-1],[-1,1],[-1,-1]] as [number,number][]).forEach(([sx, sy]) => {
      const g = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.040, 0.025), glintMat);
      g.position.set(sx * (PHONE_W / 2 + 0.009), sy * (PHONE_H / 2 + 0.009), 0);
      phoneGroup.add(g);
    });

    phoneGroup.position.set(2.6, 0.0, 0);
    scene.add(phoneGroup);

    // ---- Geometric accent shapes -------------------------------------------
    // More visible against the warm dark bg — opacity lifted slightly,
    // emissive boosted so they read as floating light-catching crystals.
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xc8a550, metalness: 0.85, roughness: 0.08,
      transparent: true, opacity: 0.45,
      emissive: 0xc8a550, emissiveIntensity: 0.25,
    });
    const crystalMat2 = new THREE.MeshStandardMaterial({
      color: 0x7ab8f0, metalness: 0.75, roughness: 0.12,
      transparent: true, opacity: 0.35,
      emissive: 0x5599cc, emissiveIntensity: 0.30,
    });

    interface ShapeEntry {
      mesh: THREE.Mesh;
      wire: THREE.LineSegments;
      phase: number;
      speed: number;
    }
    const shapeData: ShapeEntry[] = [];

    const addShape = (
      geo: THREE.BufferGeometry,
      mat: THREE.MeshStandardMaterial,
      pos: [number, number, number]
    ) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0xc8a550, transparent: true, opacity: 0.25 })
      );
      wire.position.copy(mesh.position);
      scene.add(wire);
      shapeData.push({ mesh, wire, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.5 });
    };

    addShape(new THREE.OctahedronGeometry(0.46),   crystalMat,  [-3.5,  2.2,  1.0]);
    addShape(new THREE.OctahedronGeometry(0.2875),  crystalMat2, [ 5.5,  1.8, -1.5]);
    addShape(new THREE.TetrahedronGeometry(0.4025), crystalMat,  [-4.2, -1.5,  0.5]);
    addShape(new THREE.IcosahedronGeometry(0.345),  crystalMat2, [ 5.0, -1.2,  1.5]);
    addShape(new THREE.OctahedronGeometry(0.207),   crystalMat,  [ 1.0,  3.0, -1.2]);
    addShape(new THREE.TetrahedronGeometry(0.253),  crystalMat2, [ 3.5,  2.8,  0.5]);

    // ---- Particle field ----------------------------------------------------
    const PARTICLE_COUNT = 280;
    const pPos    = new Float32Array(PARTICLE_COUNT * 3);
    const pColors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pPos[i3]     = (Math.random() - 0.5) * 22;
      pPos[i3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i3 + 2] = (Math.random() - 0.5) * 10 - 3;
      const g = Math.random() > 0.4;
      pColors[i3]     = g ? 0.78 : 0.42;
      pColors[i3 + 1] = g ? 0.65 : 0.71;
      pColors[i3 + 2] = g ? 0.31 : 0.96;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(pPos,    3));
    partGeo.setAttribute("color",    new THREE.BufferAttribute(pColors, 3));
    const particles = new THREE.Points(partGeo, new THREE.PointsMaterial({
      size: 0.045, vertexColors: true,
      transparent: true, opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    scene.add(particles);

    // ---- Mouse + resize ----------------------------------------------------
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const isMobile = w < 768;
      const isTablet = w < 1024 && w >= 768;

      camera.aspect = w / h;

      // On mobile the phone needs to be centred and closer
      if (isMobile) {
        camera.fov = 55;
        camera.position.set(2.6, 0.5, 11);
        camera.lookAt(2.6, 0, 0);
        phoneGroup.position.set(2.6, 0, 0);
      } else if (isTablet) {
        camera.fov = 50;
        camera.position.set(3.5, 1.2, 10);
        camera.lookAt(2.2, 0, 0);
        phoneGroup.position.set(2.6, 0, 0);
      } else {
        camera.fov = 45;
        camera.position.set(4, 1.5, 9);
        camera.lookAt(1.8, 0, 0);
        phoneGroup.position.set(2.6, 0, 0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    onResize(); // apply correct camera immediately on mount

    // ---- Animation loop ----------------------------------------------------
    // Constrained oscillation: phone tilts between -17 and +17 degrees.
    // Math.sin never exceeds +-1, so rotation.y stays within +-TILT_AMP (0.30 rad).
    // The front screen always faces the camera — the back is never revealed.
    const TILT_AMP   = 0.30;  // ~17 degrees
    const TILT_SPEED = 0.35;  // slow, elegant period

    let clock  = 0;
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      clock += 0.008;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // Camera framed for the dominant phone
      camera.position.x = 4 + targetX * 0.5;
      camera.position.y = 1.2 - targetY * 0.35;
      camera.lookAt(1.8, 0, 0);

      // Phone — constrained tilt, luxurious float, minimal pitch
      phoneGroup.rotation.y = Math.sin(clock * TILT_SPEED) * TILT_AMP + targetX * 0.08;
      phoneGroup.position.y = Math.sin(clock * 0.7) * 0.14;
      phoneGroup.rotation.x = Math.sin(clock * 0.55) * 0.025 - targetY * 0.03;

      // Geometric shapes
      shapeData.forEach((s, i) => {
        const t  = clock * s.speed + s.phase;
        s.mesh.position.y += Math.sin(t) * 0.003;
        s.wire.position.y  = s.mesh.position.y;
        s.mesh.rotation.x += 0.004 + i * 0.0008;
        s.mesh.rotation.y += 0.006 + i * 0.001;
        s.wire.rotation.copy(s.mesh.rotation);
      });

      // Pulsing key light — live shimmer on the gold frame
      goldLight.intensity = 20 + Math.sin(clock * 1.8) * 4;

      // Particles drift
      particles.rotation.y = clock * 0.018;
      particles.rotation.x = Math.sin(clock * 0.12) * 0.05;

      // Screen-spill light pulses gently — screen is lit by scene lights, not self-emissive
      screenSpill.intensity = 4.0 + Math.sin(clock * 1.4) * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize",    onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}