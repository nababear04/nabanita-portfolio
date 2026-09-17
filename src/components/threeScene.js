import * as THREE from 'three';

export function initThreeScene(containerElement) {
  if (!containerElement) return null;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = containerElement.clientWidth || window.innerWidth;
  const height = containerElement.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  containerElement.appendChild(renderer.domElement);

  // Group for rotating interactive 3D hero elements
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Create 3D Heart Geometry using ExtrudeGeometry
  const x = 0, y = 0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo(x + 2.5, y + 2.5);
  heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2.0, y, x, y);
  heartShape.bezierCurveTo(x - 3.0, y, x - 3.0, y + 3.5, x - 3.0, y + 3.5);
  heartShape.bezierCurveTo(x - 3.0, y + 5.5, x - 1.0, y + 7.7, x + 2.5, y + 9.5);
  heartShape.bezierCurveTo(x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5);
  heartShape.bezierCurveTo(x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y);
  heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

  const extrudeSettings = {
    depth: 1.6,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 2,
    bevelSize: 0.8,
    bevelThickness: 0.8
  };

  const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  heartGeometry.center();

  // Luxurious Soft Pink Glass / Crystal Material
  const heartMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff80bf,
    emissive: 0x551133,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.6,
    ior: 1.45,
    transparent: true,
    opacity: 0.92
  });

  const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
  heartMesh.scale.set(0.42, 0.42, 0.42);
  heartMesh.rotation.z = Math.PI; // Orient heart upright
  mainGroup.add(heartMesh);

  // 2. Stylized 3D BTS Lightstick Ring & Core
  const ringGeo = new THREE.TorusGeometry(3.6, 0.08, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xec4899,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 3;
  mainGroup.add(ringMesh);

  const ringGeo2 = new THREE.TorusGeometry(4.2, 0.05, 16, 100);
  const ringMat2 = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    emissive: 0xa855f7,
    emissiveIntensity: 0.5,
    roughness: 0.3
  });
  const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
  ringMesh2.rotation.y = Math.PI / 4;
  mainGroup.add(ringMesh2);

  // 3. Floating Mini Crystal Polyhedrons / BTS Charms
  const charmsGroup = new THREE.Group();
  const charmGeos = [
    new THREE.IcosahedronGeometry(0.45, 0),
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.TetrahedronGeometry(0.55, 0)
  ];
  const charmColors = [0xfbcfe8, 0xf472b6, 0xe9d5ff, 0xfce7f3, 0xfda4af];

  const charms = [];
  for (let i = 0; i < 14; i++) {
    const geo = charmGeos[i % charmGeos.length];
    const mat = new THREE.MeshStandardMaterial({
      color: charmColors[i % charmColors.length],
      emissive: 0x4a044e,
      roughness: 0.2,
      metalness: 0.3
    });
    const mesh = new THREE.Mesh(geo, mat);
    const angle = (i / 14) * Math.PI * 2;
    const radius = 5.2 + Math.sin(i) * 1.5;
    mesh.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.7 + Math.sin(i * 2) * 1.2,
      (Math.sin(i * 3) - 0.5) * 4
    );
    charmsGroup.add(mesh);
    charms.push({
      mesh,
      speedY: 0.01 + Math.random() * 0.02,
      rotSpeed: 0.015 + Math.random() * 0.02
    });
  }
  mainGroup.add(charmsGroup);

  // 4. Stardust Particle Swarm (Pastel Pink & BTS Purple)
  const particleCount = 450;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const pColor1 = new THREE.Color(0xfbcfe8); // Soft pink
  const pColor2 = new THREE.Color(0xd8b4fe); // Soft lilac
  const pColor3 = new THREE.Color(0xf472b6); // Bright blossom pink

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 36;
    positions[i3 + 1] = (Math.random() - 0.5) * 28;
    positions[i3 + 2] = (Math.random() - 0.5) * 25;

    const chosenColor = Math.random() < 0.4 ? pColor1 : (Math.random() < 0.7 ? pColor2 : pColor3);
    colors[i3] = chosenColor.r;
    colors[i3 + 1] = chosenColor.g;
    colors[i3 + 2] = chosenColor.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle canvas texture
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 64;
  pCanvas.height = 64;
  const pCtx = pCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(255, 182, 217, 0.8)');
  grad.addColorStop(0.8, 'rgba(244, 114, 182, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 64, 64);
  const particleTexture = new THREE.CanvasTexture(pCanvas);

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.65,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xfff0f5, 1.2);
  scene.add(ambientLight);

  const pinkPointLight = new THREE.PointLight(0xff69b4, 3.5, 50);
  pinkPointLight.position.set(6, 6, 8);
  scene.add(pinkPointLight);

  const purplePointLight = new THREE.PointLight(0xbf5af2, 3.0, 50);
  purplePointLight.position.set(-8, -4, 6);
  scene.add(purplePointLight);

  const whiteTopLight = new THREE.DirectionalLight(0xffffff, 1.5);
  whiteTopLight.position.set(0, 10, 10);
  scene.add(whiteTopLight);

  // Mouse Interaction & Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isDragging = false;
  let previousPointerX = 0;
  let previousPointerY = 0;

  const handlePointerMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    mouseX = (clientX / window.innerWidth) * 2 - 1;
    mouseY = -(clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
      const deltaX = clientX - previousPointerX;
      const deltaY = clientY - previousPointerY;
      mainGroup.rotation.y += deltaX * 0.008;
      mainGroup.rotation.x += deltaY * 0.008;
      previousPointerX = clientX;
      previousPointerY = clientY;
    }
  };

  const handlePointerDown = (e) => {
    isDragging = true;
    previousPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    previousPointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  const handlePointerUp = () => {
    isDragging = false;
  };

  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('touchmove', handlePointerMove, { passive: true });
  containerElement.addEventListener('mousedown', handlePointerDown);
  containerElement.addEventListener('touchstart', handlePointerDown, { passive: true });
  window.addEventListener('mouseup', handlePointerUp);
  window.addEventListener('touchend', handlePointerUp);

  // Resize Handler
  const handleResize = () => {
    const w = containerElement.clientWidth || window.innerWidth;
    const h = containerElement.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);

  // Animation Loop
  let clock = new THREE.Clock();
  let animationFrameId;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Gentle continuous floating rotation
    if (!isDragging) {
      targetRotationY = mouseX * 0.35;
      targetRotationX = -mouseY * 0.25;

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.04;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.04;
    }

    heartMesh.rotation.y = elapsedTime * 0.45;
    heartMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.35;

    ringMesh.rotation.z = elapsedTime * 0.3;
    ringMesh2.rotation.x = elapsedTime * -0.25;

    // Animate charms
    charms.forEach((item, idx) => {
      item.mesh.rotation.x += item.rotSpeed;
      item.mesh.rotation.y += item.rotSpeed;
      item.mesh.position.y += Math.sin(elapsedTime * 2 + idx) * 0.008;
    });

    // Animate particle field
    particles.rotation.y = elapsedTime * 0.03;
    particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

    renderer.render(scene, camera);
  }

  animate();

  return {
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      containerElement.removeEventListener('mousedown', handlePointerDown);
      containerElement.removeEventListener('touchstart', handlePointerDown);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  };
}
