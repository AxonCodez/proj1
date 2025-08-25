src="https://cdn.jsdelivr.net/npm/simplex-noise@3.0.0/simplex-noise.min.js"
window.addEventListener('DOMContentLoaded', () => {
  const conf = {
    fov: 75,
    cameraZ: 75,
    xyCoef: 50,
    zCoef: 10,
    lightIntensity: 0.9,
    ambientColor: 0x000000,
    light1Color: 0x0E09DC,
    light2Color: 0x1CD1E1,
    light3Color: 0x18C02C,
    light4Color: 0xee3bcf,
    el: 'background',
  };

  let renderer, scene, camera;
  let width, height, wWidth, wHeight;
  const simplex = new SimplexNoise();
  const mouse = new THREE.Vector2();
  const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mousePosition = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  let light1, light2, light3, light4;
  let plane;

  function init() {
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('background'),
      antialias: true,
      alpha: true,
    });
    camera = new THREE.PerspectiveCamera(conf.fov);
    camera.position.z = conf.cameraZ;
    updateSize();
    window.addEventListener('resize', updateSize);
    document.addEventListener('mousemove', e => {
      const v = new THREE.Vector3();
      camera.getWorldDirection(v);
      v.normalize();
      mousePlane.normal = v;
      mouse.x = (e.clientX / width) * 2 - 1;
      mouse.y = -(e.clientY / height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(mousePlane, mousePosition);
    });
    initScene();
    animate();
  }

  function updateSize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (renderer && camera) {
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const size = getRendererSize();
      wWidth = size[0];
      wHeight = size[1];
    }
  }

  function getRendererSize() {
    const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
    const vFOV = (cam.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
    const width = height * cam.aspect;
    return [width, height];
  }

  function initScene() {
    scene = new THREE.Scene();

    light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, 500);
    light1.position.set(0, 10, 30);
    scene.add(light1);

    light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, 500);
    light2.position.set(0, -10, -30);
    scene.add(light2);

    light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, 500);
    light3.position.set(30, 10, 0);
    scene.add(light3);

    light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, 500);
    light4.position.set(-30, 10, 0);
    scene.add(light4);

    const geometry = new THREE.PlaneBufferGeometry(wWidth, wHeight, wWidth / 2, wHeight / 2);
    const material = new THREE.MeshLambertMaterial({ color: 0x80e8ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotation.x = -Math.PI / 2 - 0.2;
    plane.position.y = -45;
    camera.position.z = 60;
  }

  function animate() {
    requestAnimationFrame(animate);
    animatePlane();
    animateLights();
    renderer.render(scene, camera);
  }

  function animatePlane() {
    const positions = plane.geometry.attributes.position.array;
    const time = Date.now() * 0.0002;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] = simplex.noise4D(
        positions[i] / conf.xyCoef,
        positions[i + 1] / conf.xyCoef,
        time,
        mouse.x + mouse.y
      ) * conf.zCoef;
    }
    plane.geometry.attributes.position.needsUpdate = true;
  }

  function animateLights() {
    const time = Date.now() * 0.001;
    const d = 50;
    light1.position.x = Math.sin(time * 0.1) * d;
    light1.position.z = Math.cos(time * 0.2) * d;
    light2.position.x = Math.cos(time * 0.3) * d;
    light2.position.z = Math.sin(time * 0.4) * d;
    light3.position.x = Math.sin(time * 0.5) * d;
    light3.position.z = Math.sin(time * 0.6) * d;
    light4.position.x = Math.sin(time * 0.7) * d;
    light4.position.z = Math.cos(time * 0.8) * d;
  }

  init();
});
