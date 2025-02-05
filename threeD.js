// الانتظار حتى يتم تحميل الصفحة بالكامل
window.addEventListener('load', function() {
    const container = document.getElementById('threeD-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
  
    // إعداد الكاميرا
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
  
    // إعداد المُصيّر (Renderer)
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
  
    // أدوات التحكم (OrbitControls)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  
    // إضاءة المشهد
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
  
    // إنشاء مجسم يمثل قطعة أثرية (باستخدام TorusKnot كنموذج تجريبي)
    const artifactGeometry = new THREE.TorusKnotGeometry(1, 0.3, 150, 20);
    const artifactMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffcc00,
      metalness: 0.6,
      roughness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0
    });
    const artifact = new THREE.Mesh(artifactGeometry, artifactMaterial);
    artifact.position.set(0, 0, 0);
    scene.add(artifact);
  
    // إنشاء نظام جزيئي (Particles) يمثل "نجوم التاريخ" أو رمزية الزمن
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.2,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
  
    // دالة الأنيميشن
    function animate() {
      requestAnimationFrame(animate);
      
      // تدوير القطعة الأثرية
      artifact.rotation.x += 0.005;
      artifact.rotation.y += 0.01;
  
      // حركة خفيفة للجزيئات
      particles.rotation.y += 0.0005;
  
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  
    // التعامل مع تغيير حجم النافذة
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  });
  