import "./style.css";
import * as THREE from "three";

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0,
  metalness: 1
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// const pointLight = new THREE.PointLight(0xffffff, 5)
// pointLight.position.set(0,0,0)

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)

// const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
const axesHelper = new THREE.AxesHelper(5)

// scene.add(pointLight)
// scene.add(ambientLight)
scene.add(axesHelper, gridHelper)

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.6

const hdrURL = new URL("./blue_photo_studio_1k.hdr", import.meta.url)
const loader = new RGBELoader()
loader.load(hdrURL, function(texture) {
  // scene.background = texture;
  scene.environment = texture;
  texture.mapping = THREE.EquirectangularReflectionMapping
})

const controls = new OrbitControls(camera, renderer.domElement)

// const animate = () => {
//   requestAnimationFrame(animate);
//   torus.rotation.y += 0.01;
//   // torus.scale.z -= getRandom();
//   controls.update()
//   renderer.render(scene, camera);
// };

const animate = (time) => {
  torus.rotation.y = time / 1500;
  controls.update()
  renderer.render(scene, camera);
}

const getRandom = () => {
  let random = Math.random();
  return random > 0.5 ? random / 100 : -(random / 100);
};

const addStar = () => {
  const geometry = new THREE.SphereGeometry(0.1, 64, 64);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff})

  const star = new THREE.Mesh(geometry, material)
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ))
  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

// animate();

renderer.setAnimationLoop(animate)
