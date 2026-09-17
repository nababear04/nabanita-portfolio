import * as THREE from 'three';
import { btsMembers } from '../data/btsData.js';

export function initLoading3DScene(container) {
  if (!container) return null;

  try {
    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 200;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Rotating 3D Crystal Gem (Octahedron)
    const coreGeo = new THREE.OctahedronGeometry(1.8, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xec4899,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.6
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Central Torus Ring
    const ringGeo = new THREE.TorusGeometry(2.8, 0.05, 12, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    mainGroup.add(ring);

    const ring2Geo = new THREE.TorusGeometry(3.5, 0.04, 12, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // 2. 7 3D Member Orbs Orbiting in 3D Space
    const memberOrbs = [];
    const total = btsMembers.length;

    btsMembers.forEach((member, i) => {
      const orbGroup = new THREE.Group();
      const radius = 4.2;
      const angle = (i / total) * Math.PI * 2;

      const orbGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xfbcfe8,
        emissive: 0x330022,
        roughness: 0.2,
        metalness: 0.3
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbGroup.add(orbMesh);

      mainGroup.add(orbGroup);

      memberOrbs.push({
        group: orbGroup,
        mesh: orbMesh,
        baseAngle: angle,
        radius: radius,
        color: new THREE.Color(member.color),
        isOnline: false
      });
    });

    // 3. Floating 3D Stardust Petals
    const petalCount = 100;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(petalCount * 3);

    for (let i = 0; i < petalCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 20;
      pPositions[i + 1] = (Math.random() - 0.5) * 14;
      pPositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.25,
      color: 0xf472b6,
      transparent: true,
      opacity: 0.75
    });
    const petals = new THREE.Points(pGeo, pMat);
    scene.add(petals);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xfff0f5, 1.6);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(2, 6, 8);
    scene.add(dirLight);

    const pLight = new THREE.PointLight(0xf472b6, 2, 20);
    pLight.position.set(0, 0, 4);
    scene.add(pLight);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Spin crystal
      coreMesh.rotation.y = t * 0.8;
      coreMesh.rotation.x = Math.sin(t * 0.5) * 0.3;

      ring.rotation.z = t * 0.5;
      ring2.rotation.y = -t * 0.4;

      // Orbit orbs
      memberOrbs.forEach((item, idx) => {
        const speed = item.isOnline ? 0.7 : 0.35;
        const curAngle = item.baseAngle + t * speed;
        const x = Math.cos(curAngle) * item.radius;
        const z = Math.sin(curAngle) * item.radius;
        const y = Math.sin(t * 2 + idx) * 0.7;

        item.group.position.set(x, y, z);
      });

      petals.rotation.y = t * 0.03;

      renderer.render(scene, camera);
    }
    animate();

    return {
      activateOrb: (index) => {
        try {
          if (memberOrbs[index]) {
            const item = memberOrbs[index];
            item.isOnline = true;
            item.mesh.material.color.copy(item.color);
            item.mesh.material.emissive.copy(item.color);
            item.mesh.material.emissiveIntensity = 0.9;
            item.mesh.scale.set(1.4, 1.4, 1.4);
          }
        } catch (e) {}
      },
      destroy: () => {
        try {
          cancelAnimationFrame(animId);
          renderer.dispose();
          if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        } catch (e) {}
      }
    };
  } catch (err) {
    console.error('3D Loading stage initialization error:', err);
    return null;
  }
}
