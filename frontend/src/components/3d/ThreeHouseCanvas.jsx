import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * ThreeHouseCanvas - Interactive 3D Architectural House & Dollhouse Visualizer
 *
 * Supported features:
 * - 3D Dollhouse floor plan cutaway with furnished rooms
 * - 3D Exterior modern luxury villa with pool, deck, and landscape
 * - Dynamic wall color finish configurator
 * - Dynamic flooring material (Carrara marble, teakwood, granite, oak)
 * - Time-of-day lighting (Daylight 12PM, Sunset Golden Hour 6PM, Night Luxe 9PM)
 * - Animated camera focus for room-by-room walkthrough
 * - Screenshot export utility
 */
const ThreeHouseCanvas = ({
  mode = 'dollhouse', // 'dollhouse' | 'exterior'
  activeRoom = 'all', // 'all' | 'living' | 'master' | 'kitchen' | 'balcony' | 'bath'
  wallColor = '#F4EFE6', // Hex color for interior/exterior walls
  floorType = 'marble', // 'marble' | 'teak' | 'granite' | 'oak'
  lightingMood = 'day', // 'day' | 'sunset' | 'night'
  showHotspots = true,
  onCaptureReady,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const dirLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const hemiLightRef = useRef(null);
  const nightLightsRef = useRef([]);
  const materialsRef = useRef({});
  const houseGroupRef = useRef(null);

  // Target camera positions for smooth animated camera lerp
  const targetCamPos = useRef(new THREE.Vector3(18, 16, 18));
  const targetCamLook = useRef(new THREE.Vector3(0, 1.5, 0));

  // Floor textures / procedural canvas generator
  const createTexture = (type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (type === 'marble') {
      // Off-white Carrara marble with subtle grey veins
      ctx.fillStyle = '#f8f8f6';
      ctx.fillRect(0, 0, 512, 512);

      // Tile grid lines
      ctx.strokeStyle = '#e2e2dd';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 512; i += 128) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }

      // Marble vein streaks
      ctx.strokeStyle = 'rgba(180, 180, 190, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(30, 20);
      ctx.bezierCurveTo(140, 180, 220, 240, 480, 490);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(120, 0);
      ctx.bezierCurveTo(240, 150, 360, 320, 512, 380);
      ctx.stroke();
    } else if (type === 'teak') {
      // Rich warm teakwood planks
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 0, 512, 512);

      // Planks
      for (let y = 0; y < 512; y += 48) {
        ctx.fillStyle = y % 96 === 0 ? '#964B00' : '#7E3808';
        ctx.fillRect(0, y, 512, 46);

        // Wood grain
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        for (let x = 0; x < 512; x += 32) {
          ctx.fillRect(x, y, 16, 46);
        }

        ctx.strokeStyle = '#4a2505';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, y, 512, 48);
      }
    } else if (type === 'granite') {
      // Polished dark anthracite granite
      ctx.fillStyle = '#1e2229';
      ctx.fillRect(0, 0, 512, 512);

      // Granite flecks
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(218,165,32,0.15)';
        ctx.fillRect(x, y, 2, 2);
      }

      // Tile joints
      ctx.strokeStyle = '#111317';
      ctx.lineWidth = 3;
      for (let i = 0; i <= 512; i += 128) {
        ctx.strokeRect(i, 0, 128, 512);
        ctx.strokeRect(0, i, 512, 128);
      }
    } else {
      // Light Scandinavian Oak
      ctx.fillStyle = '#e5cca8';
      ctx.fillRect(0, 0, 512, 512);

      for (let y = 0; y < 512; y += 40) {
        ctx.fillStyle = y % 80 === 0 ? '#deb887' : '#d2b48c';
        ctx.fillRect(0, y, 512, 38);
        ctx.strokeStyle = '#c19a6b';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, y, 512, 40);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(lightingMood === 'night' ? 0x070c18 : 0xf1f5f9);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(18, 16, 18);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Expose capture function
    if (onCaptureReady) {
      onCaptureReady(() => {
        return renderer.domElement.toDataURL('image/png');
      });
    }

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.05; // Don't dip below ground
    controls.minDistance = 6;
    controls.maxDistance = 50;
    controls.target.set(0, 1.5, 0);
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 0.5);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    dirLight.position.set(22, 28, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 6. Base Materials dictionary
    const materials = {
      wall: new THREE.MeshStandardMaterial({
        color: new THREE.Color(wallColor),
        roughness: 0.65,
        metalness: 0.05,
      }),
      wallExterior: new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xf5f3ee),
        roughness: 0.7,
      }),
      wallDarkAccent: new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x272c35),
        roughness: 0.4,
      }),
      floor: new THREE.MeshStandardMaterial({
        map: createTexture(floorType),
        roughness: floorType === 'marble' || floorType === 'granite' ? 0.2 : 0.6,
        metalness: floorType === 'marble' ? 0.1 : 0.02,
      }),
      woodDeck: new THREE.MeshStandardMaterial({
        color: 0x824d28,
        roughness: 0.75,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xc8e6f5,
        transparent: true,
        opacity: 0.38,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.5,
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x00a8e8,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
      }),
      lawn: new THREE.MeshStandardMaterial({
        color: 0x3b6e3f,
        roughness: 0.9,
      }),
      driveway: new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.8,
      }),
      sofa: new THREE.MeshStandardMaterial({
        color: 0x334155, // Charcoal slate
        roughness: 0.8,
      }),
      bedSheet: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.9,
      }),
      woodFurniture: new THREE.MeshStandardMaterial({
        color: 0x5c381d,
        roughness: 0.5,
      }),
      goldBrass: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.85,
        roughness: 0.25,
      }),
      kitchenCabinet: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
      }),
      countertop: new THREE.MeshStandardMaterial({
        color: 0xf8f9fa,
        roughness: 0.15,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.95,
        roughness: 0.1,
      }),
      glow: new THREE.MeshBasicMaterial({
        color: 0xffe6a3,
      }),
    };
    materialsRef.current = materials;

    // 7. Build House Mesh Scene
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);
    houseGroupRef.current = houseGroup;

    // Helper to add shadows to every mesh in hierarchy
    const applyShadows = (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };

    // --- Ground Platform & Site Plot ---
    const plotGeo = new THREE.BoxGeometry(32, 0.5, 32);
    const plotMat = new THREE.MeshStandardMaterial({ color: 0x242830, roughness: 0.9 });
    const plotMesh = new THREE.Mesh(plotGeo, plotMat);
    plotMesh.position.y = -0.25;
    plotMesh.receiveShadow = true;
    houseGroup.add(plotMesh);

    // Front Lawn
    const lawnGeo = new THREE.BoxGeometry(30, 0.2, 10);
    const lawnMesh = new THREE.Mesh(lawnGeo, materials.lawn);
    lawnMesh.position.set(0, 0.05, 10);
    lawnMesh.receiveShadow = true;
    houseGroup.add(lawnMesh);

    // Stone Driveway / Pathway
    const drivewayGeo = new THREE.BoxGeometry(6, 0.22, 10);
    const drivewayMesh = new THREE.Mesh(drivewayGeo, materials.driveway);
    drivewayMesh.position.set(7, 0.06, 10);
    drivewayMesh.receiveShadow = true;
    houseGroup.add(drivewayMesh);

    // Swimming Pool with Deck (Right Front)
    const poolDeckGeo = new THREE.BoxGeometry(9, 0.25, 6);
    const poolDeckMesh = new THREE.Mesh(poolDeckGeo, materials.woodDeck);
    poolDeckMesh.position.set(-8.5, 0.08, 9);
    houseGroup.add(poolDeckMesh);

    const poolWaterGeo = new THREE.BoxGeometry(7, 0.3, 4);
    const poolWaterMesh = new THREE.Mesh(poolWaterGeo, materials.water);
    poolWaterMesh.position.set(-8.5, 0.12, 9);
    houseGroup.add(poolWaterMesh);

    // --- Main House Floor Base (18m wide x 16m deep) ---
    const floorGeo = new THREE.BoxGeometry(18, 0.4, 16);
    const floorMesh = new THREE.Mesh(floorGeo, materials.floor);
    floorMesh.position.set(0, 0.2, -1);
    floorMesh.receiveShadow = true;
    houseGroup.add(floorMesh);

    // --- Wall Builder Helper ---
    // wall: box centered at pos, dims: [w, h, d]
    const createWall = (w, h, d, x, y, z, mat = materials.wall) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      houseGroup.add(mesh);
      return mesh;
    };

    // Interior cutaway wall height is 2.8m for dollhouse feel
    const wallH = 2.8;
    const wallY = 0.4 + wallH / 2;

    // --- Outer Perimeter Walls (with Doorway/Window Openings) ---
    // Back Wall (Z = -9)
    createWall(18, wallH, 0.4, 0, wallY, -9);
    // Left Wall (X = -9)
    createWall(0.4, wallH, 16, -9, wallY, -1);
    // Right Wall (X = 9)
    createWall(0.4, wallH, 16, 9, wallY, -1);
    // Front Low Wall / Entrance Archway (Z = 7)
    createWall(6, wallH, 0.4, -6, wallY, 7);
    createWall(6, wallH, 0.4, 6, wallY, 7);
    // Balcony Glass Railing in front of living room
    const glassRailingGeo = new THREE.BoxGeometry(6, 1.1, 0.1);
    const glassRailing = new THREE.Mesh(glassRailingGeo, materials.glass);
    glassRailing.position.set(0, 0.4 + 0.55, 7);
    houseGroup.add(glassRailing);

    // --- Room Partition Walls ---
    // 1. Dividing Living Area (Center/Right Front) from Master Bedroom (Left Front)
    createWall(0.3, wallH, 8, -2.5, wallY, 3);

    // 2. Dividing Bedrooms & Living from Kitchen/Dining & Bath (Z = -1)
    createWall(7, wallH, 0.3, 5.5, wallY, -1); // Separates Dining from Kitchen
    createWall(6.5, wallH, 0.3, -5.75, wallY, -1); // Separates Master from Guest/Bath

    // 3. Bathroom divider wall (Back Left corner)
    createWall(0.3, wallH, 8, -4, wallY, -5);

    // --- Interior Furniture & Architectural Detailing ---

    // ==========================================
    // ROOM 1: LIVING ROOM & LOUNGE (Center-Right)
    // ==========================================
    // Modern L-Shaped Sectional Sofa
    const sofaMainGeo = new THREE.BoxGeometry(4.2, 0.8, 1.6);
    const sofaMain = new THREE.Mesh(sofaMainGeo, materials.sofa);
    sofaMain.position.set(2.5, 0.4 + 0.4, 4.5);
    houseGroup.add(sofaMain);

    const sofaLGeo = new THREE.BoxGeometry(1.5, 0.8, 2.5);
    const sofaL = new THREE.Mesh(sofaLGeo, materials.sofa);
    sofaL.position.set(4.8, 0.4 + 0.4, 2.5);
    houseGroup.add(sofaL);

    // Sofa Backrest
    const sofaBackGeo = new THREE.BoxGeometry(4.2, 0.9, 0.4);
    const sofaBack = new THREE.Mesh(sofaBackGeo, materials.sofa);
    sofaBack.position.set(2.5, 0.4 + 0.85, 5.1);
    houseGroup.add(sofaBack);

    // Designer Coffee Table (Brass Frame + Marble Top)
    const tableTopGeo = new THREE.BoxGeometry(2.4, 0.1, 1.4);
    const tableTop = new THREE.Mesh(tableTopGeo, materials.countertop);
    tableTop.position.set(2.5, 0.4 + 0.45, 3.2);
    houseGroup.add(tableTop);

    const tableLegsGeo = new THREE.BoxGeometry(2.2, 0.4, 1.2);
    const tableLegs = new THREE.Mesh(tableLegsGeo, materials.goldBrass);
    tableLegs.position.set(2.5, 0.4 + 0.2, 3.2);
    houseGroup.add(tableLegs);

    // TV Media Wall Console (Mounted on dividing wall)
    const mediaWallGeo = new THREE.BoxGeometry(4.0, 2.4, 0.15);
    const mediaWall = new THREE.Mesh(mediaWallGeo, materials.wallDarkAccent);
    mediaWall.position.set(2.5, 0.4 + 1.3, -0.85);
    houseGroup.add(mediaWall);

    const tvScreenGeo = new THREE.BoxGeometry(2.8, 1.5, 0.08);
    const tvScreen = new THREE.Mesh(
      tvScreenGeo,
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.1 })
    );
    tvScreen.position.set(2.5, 0.4 + 1.4, -0.75);
    houseGroup.add(tvScreen);

    // ==========================================
    // ROOM 2: GOURMET MODULAR KITCHEN & ISLAND
    // ==========================================
    // Kitchen Back Counter Cabinets
    const kitchenBackGeo = new THREE.BoxGeometry(6.5, 1.0, 1.2);
    const kitchenBack = new THREE.Mesh(kitchenBackGeo, materials.kitchenCabinet);
    kitchenBack.position.set(5.5, 0.4 + 0.5, -8.2);
    houseGroup.add(kitchenBack);

    // Countertop Slab
    const kitchenCounterGeo = new THREE.BoxGeometry(6.6, 0.1, 1.3);
    const kitchenCounter = new THREE.Mesh(kitchenCounterGeo, materials.countertop);
    kitchenCounter.position.set(5.5, 0.4 + 1.05, -8.2);
    houseGroup.add(kitchenCounter);

    // Center Island with Breakfast Bar
    const islandGeo = new THREE.BoxGeometry(3.6, 1.0, 1.5);
    const island = new THREE.Mesh(islandGeo, materials.kitchenCabinet);
    island.position.set(5.5, 0.4 + 0.5, -4.5);
    houseGroup.add(island);

    const islandTopGeo = new THREE.BoxGeometry(4.0, 0.12, 1.8);
    const islandTop = new THREE.Mesh(islandTopGeo, materials.countertop);
    islandTop.position.set(5.5, 0.4 + 1.06, -4.5);
    houseGroup.add(islandTop);

    // 2 Bar Stools with Gold legs
    for (let i = -1; i <= 1; i += 2) {
      const stoolGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.7, 16);
      const stool = new THREE.Mesh(stoolGeo, materials.goldBrass);
      stool.position.set(5.5 + i * 1.0, 0.4 + 0.35, -3.2);
      houseGroup.add(stool);
    }

    // ==========================================
    // ROOM 3: MASTER BEDROOM SUITE (Front-Left)
    // ==========================================
    // King-Size Platform Bed Frame
    const bedBaseGeo = new THREE.BoxGeometry(3.6, 0.4, 4.2);
    const bedBase = new THREE.Mesh(bedBaseGeo, materials.woodFurniture);
    bedBase.position.set(-5.8, 0.4 + 0.2, 4.0);
    houseGroup.add(bedBase);

    // Mattress & Duvet
    const mattressGeo = new THREE.BoxGeometry(3.3, 0.45, 3.8);
    const mattress = new THREE.Mesh(mattressGeo, materials.bedSheet);
    mattress.position.set(-5.8, 0.4 + 0.5, 4.0);
    houseGroup.add(mattress);

    // Headboard Accent Wall
    const headboardGeo = new THREE.BoxGeometry(4.2, 1.8, 0.2);
    const headboard = new THREE.Mesh(headboardGeo, materials.wallDarkAccent);
    headboard.position.set(-5.8, 0.4 + 1.0, 6.7);
    houseGroup.add(headboard);

    // Nightstands & Bedside Lamps (Emits soft light)
    for (let side of [-1, 1]) {
      const nightstandGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
      const nightstand = new THREE.Mesh(nightstandGeo, materials.woodFurniture);
      nightstand.position.set(-5.8 + side * 2.4, 0.4 + 0.3, 5.8);
      houseGroup.add(nightstand);

      const lampBaseGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.4);
      const lampBase = new THREE.Mesh(lampBaseGeo, materials.goldBrass);
      lampBase.position.set(-5.8 + side * 2.4, 0.4 + 0.8, 5.8);
      houseGroup.add(lampBase);

      const lampShadeGeo = new THREE.ConeGeometry(0.25, 0.35, 16);
      const lampShade = new THREE.Mesh(lampShadeGeo, materials.glow);
      lampShade.position.set(-5.8 + side * 2.4, 0.4 + 1.05, 5.8);
      houseGroup.add(lampShade);

      // Night Lamp Point Light
      const pointLight = new THREE.PointLight(0xffe8a3, 0.8, 8);
      pointLight.position.set(-5.8 + side * 2.4, 0.4 + 1.4, 5.8);
      scene.add(pointLight);
      nightLightsRef.current.push(pointLight);
    }

    // ==========================================
    // ROOM 4: LUXURY ENSUITE BATHROOM (Back-Left)
    // ==========================================
    // Glass Shower Enclosure
    const showerGlassGeo = new THREE.BoxGeometry(0.08, 2.4, 2.8);
    const showerGlass = new THREE.Mesh(showerGlassGeo, materials.glass);
    showerGlass.position.set(-6.5, 0.4 + 1.2, -6.0);
    houseGroup.add(showerGlass);

    // Floating Vanity Counter
    const vanityGeo = new THREE.BoxGeometry(2.4, 0.4, 1.2);
    const vanity = new THREE.Mesh(vanityGeo, materials.kitchenCabinet);
    vanity.position.set(-5.2, 0.4 + 0.8, -8.3);
    houseGroup.add(vanity);

    // Vanity Mirror
    const mirrorGeo = new THREE.BoxGeometry(2.0, 1.2, 0.05);
    const mirror = new THREE.Mesh(mirrorGeo, materials.chrome);
    mirror.position.set(-5.2, 0.4 + 1.8, -8.8);
    houseGroup.add(mirror);

    // Ceramic Washbasin
    const basinGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.25, 24);
    const basin = new THREE.Mesh(basinGeo, materials.countertop);
    basin.position.set(-5.2, 0.4 + 1.1, -8.3);
    houseGroup.add(basin);

    // ==========================================
    // EXTERIOR VILLA 2ND STOREY & CANTILEVER (Toggled in 'exterior' mode)
    // ==========================================
    const exteriorGroup = new THREE.Group();
    exteriorGroup.name = 'exteriorFeatures';
    houseGroup.add(exteriorGroup);

    // 2nd Floor Slab
    const upperFloorGeo = new THREE.BoxGeometry(18.4, 0.4, 16.4);
    const upperFloor = new THREE.Mesh(upperFloorGeo, materials.wallExterior);
    upperFloor.position.set(0, 0.4 + wallH + 0.2, -1);
    exteriorGroup.add(upperFloor);

    // Upper Floor Cantilevered Room
    const upperRoomGeo = new THREE.BoxGeometry(11, 3.0, 10);
    const upperRoom = new THREE.Mesh(upperRoomGeo, materials.wallExterior);
    upperRoom.position.set(3.2, 0.4 + wallH + 1.9, -2.5);
    exteriorGroup.add(upperRoom);

    // Upper Balcony Glass Railing
    const upperGlassGeo = new THREE.BoxGeometry(7, 1.1, 0.1);
    const upperGlass = new THREE.Mesh(upperGlassGeo, materials.glass);
    upperGlass.position.set(-5, 0.4 + wallH + 0.95, 6.8);
    exteriorGroup.add(upperGlass);

    // Modern Flat Roof with Overhang
    const roofGeo = new THREE.BoxGeometry(19, 0.4, 17);
    const roof = new THREE.Mesh(roofGeo, materials.wallDarkAccent);
    roof.position.set(0, 0.4 + wallH + 3.6, -1);
    exteriorGroup.add(roof);

    // Cantilever Wooden Louvers / Pergola
    const louverGeo = new THREE.BoxGeometry(7, 0.15, 6);
    const louver = new THREE.Mesh(louverGeo, materials.woodDeck);
    louver.position.set(-5, 0.4 + wallH + 3.4, 3.5);
    exteriorGroup.add(louver);

    exteriorGroup.visible = mode === 'exterior';

    // Apply shadow properties to all elements
    applyShadows(houseGroup);

    // 8. Animation & Render Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera lerp towards targetCamPos
      camera.position.lerp(targetCamPos.current, 0.04);
      controls.target.lerp(targetCamLook.current, 0.04);
      controls.update();

      // Gentle animated water ripples
      if (poolWaterMesh) {
        poolWaterMesh.position.y = 0.12 + Math.sin(clock.getElapsedTime() * 2) * 0.015;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.innerHTML = '';
      }
      renderer.dispose();
    };
  }, []);

  // Update Wall Color dynamically
  useEffect(() => {
    if (materialsRef.current.wall) {
      materialsRef.current.wall.color.set(wallColor);
    }
  }, [wallColor]);

  // Update Flooring Texture dynamically
  useEffect(() => {
    if (materialsRef.current.floor) {
      materialsRef.current.floor.map = createTexture(floorType);
      materialsRef.current.floor.roughness =
        floorType === 'marble' || floorType === 'granite' ? 0.2 : 0.6;
      materialsRef.current.floor.metalness = floorType === 'marble' ? 0.1 : 0.02;
      materialsRef.current.floor.needsUpdate = true;
    }
  }, [floorType]);

  // Update Mode (Dollhouse cutaway vs Full Exterior Villa)
  useEffect(() => {
    if (houseGroupRef.current) {
      const ext = houseGroupRef.current.getObjectByName('exteriorFeatures');
      if (ext) {
        ext.visible = mode === 'exterior';
      }
    }

    if (mode === 'exterior') {
      targetCamPos.current.set(24, 18, 26);
      targetCamLook.current.set(0, 3, 0);
    } else {
      // Dollhouse top-down isometric view
      targetCamPos.current.set(16, 16, 16);
      targetCamLook.current.set(0, 1.5, 0);
    }
  }, [mode]);

  // Update Room Focus / Walkthrough camera position
  useEffect(() => {
    if (mode === 'exterior') return;

    switch (activeRoom) {
      case 'living':
        targetCamPos.current.set(6, 6, 8.5);
        targetCamLook.current.set(2.5, 1.2, 3.5);
        break;
      case 'master':
        targetCamPos.current.set(-3.5, 6, 8.5);
        targetCamLook.current.set(-5.8, 1.2, 4.0);
        break;
      case 'kitchen':
        targetCamPos.current.set(8.5, 6, -1.5);
        targetCamLook.current.set(5.5, 1.2, -6.0);
        break;
      case 'bath':
        targetCamPos.current.set(-3.5, 5, -3.5);
        targetCamLook.current.set(-5.5, 1.2, -7.0);
        break;
      case 'balcony':
        targetCamPos.current.set(0, 4, 11);
        targetCamLook.current.set(0, 1.2, 6);
        break;
      default: // 'all'
        targetCamPos.current.set(16, 16, 16);
        targetCamLook.current.set(0, 1.5, 0);
        break;
    }
  }, [activeRoom, mode]);

  // Update Lighting Mood (Daylight, Sunset Golden Hour, Night Luxe)
  useEffect(() => {
    if (
      !sceneRef.current ||
      !dirLightRef.current ||
      !ambientLightRef.current ||
      !hemiLightRef.current
    )
      return;

    const scene = sceneRef.current;
    const dir = dirLightRef.current;
    const amb = ambientLightRef.current;
    const hemi = hemiLightRef.current;

    if (lightingMood === 'day') {
      scene.background.set(0xf1f5f9);
      dir.color.set(0xfff5e6);
      dir.intensity = 1.4;
      dir.position.set(22, 28, 16);
      amb.color.set(0xffffff);
      amb.intensity = 0.6;
      hemi.intensity = 0.5;
      nightLightsRef.current.forEach((l) => (l.intensity = 0.2));
    } else if (lightingMood === 'sunset') {
      scene.background.set(0xfcd3a1);
      dir.color.set(0xff7733);
      dir.intensity = 1.6;
      dir.position.set(30, 10, 10);
      amb.color.set(0xffbb88);
      amb.intensity = 0.45;
      hemi.intensity = 0.3;
      nightLightsRef.current.forEach((l) => (l.intensity = 0.6));
    } else if (lightingMood === 'night') {
      scene.background.set(0x070c18);
      dir.color.set(0x2a3b5c);
      dir.intensity = 0.25;
      dir.position.set(10, 20, 10);
      amb.color.set(0x182438);
      amb.intensity = 0.3;
      hemi.intensity = 0.15;
      nightLightsRef.current.forEach((l) => (l.intensity = 1.4));
    }
  }, [lightingMood]);

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[580px] bg-slate-900 rounded-2xl overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-navy-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>WebGL 3D Engine Active</span>
        </div>
        <div className="hidden sm:flex px-3 py-1.5 rounded-xl bg-navy-950/60 backdrop-blur-md border border-white/10 text-slate-300 text-xs">
          <span>Click & Drag to Orbit · Scroll to Zoom</span>
        </div>
      </div>

      {/* 3D Hotspot / Room Dimensions Overlay */}
      {showHotspots && mode === 'dollhouse' && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {activeRoom === 'all' && (
            <>
              {/* Living Area Pin */}
              <div className="absolute top-[48%] right-[32%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="px-2.5 py-1 rounded-lg bg-navy-900/90 backdrop-blur text-gold-400 border border-gold-400/40 text-[11px] font-bold shadow-lg animate-fadeIn">
                  Grand Living Lounge (24' × 18')
                </div>
              </div>

              {/* Master Bedroom Pin */}
              <div className="absolute top-[52%] left-[28%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="px-2.5 py-1 rounded-lg bg-navy-900/90 backdrop-blur text-gold-400 border border-gold-400/40 text-[11px] font-bold shadow-lg animate-fadeIn">
                  Master Bedroom Suite (16' × 14')
                </div>
              </div>

              {/* Gourmet Kitchen Pin */}
              <div className="absolute top-[28%] right-[26%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="px-2.5 py-1 rounded-lg bg-navy-900/90 backdrop-blur text-gold-400 border border-gold-400/40 text-[11px] font-bold shadow-lg animate-fadeIn">
                  Gourmet Kitchen & Island (14' × 12')
                </div>
              </div>

              {/* Luxury Bath Pin */}
              <div className="absolute top-[26%] left-[34%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="px-2.5 py-1 rounded-lg bg-navy-900/90 backdrop-blur text-gold-400 border border-gold-400/40 text-[11px] font-bold shadow-lg animate-fadeIn">
                  Ensuite Bath (10' × 8')
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Compass / Orientation Indicator */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-navy-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
        <span className="text-gold-400">N ↑</span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-300">Vastu Compliant 3D Layout</span>
      </div>
    </div>
  );
};

export default ThreeHouseCanvas;
