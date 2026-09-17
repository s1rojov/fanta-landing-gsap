<template>
  <div ref="containerRef" class="scroll-container">
    <!-- 1. Model Yuklanayotganda Ko'rinuvchi Ekran (Loading Screen) -->
    <div v-if="isLoading" class="loading-screen">
      <div class="spinner"></div>
      <p>3D Model yuklanmoqda: {{ loadingProgress }}%</p>
    </div>

    <!-- 2. Three.js Render bo'ladigan Canvas -->
    <canvas ref="canvasRef" class="webgl-canvas"></canvas>

    <!-- 3. Scroll bo'ladigan Matnli Sektsiyalar -->
    <section class="section">
      <div class="content">
        <span class="badge">Yangi avlod</span>
        <h1>Damaged Helmet</h1>
        <p>Mukammal aerodinamika va kelajak dizayni bir joyda.</p>
      </div>
    </section>

    <section class="section">
      <div class="content right">
        <h2>Titanium Korpus</h2>
        <p>Ekstremal sharoitlarga bardosh beruvchi mustahkam himoya qatlami.</p>
      </div>
    </section>

    <section class="section">
      <div class="content left">
        <h2>PBR Tekstura</h2>
        <p>Har bir tirnalish va yorug'lik qaytishi real vaqt rejimida simulyatsiya qilinadi.</p>
      </div>
    </section>

    <section class="section">
      <div class="content">
        <h2>360° To'liq Obzor</h2>
        <p>Scrolldan foydalanib mahsulotni barcha burchaklardan o'rganib chiqing.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const canvasRef = ref(null)
const containerRef = ref(null)

// Loading holatlari
const isLoading = ref(true)
const loadingProgress = ref(0)

let scene, camera, renderer, animFrameId
let productModel = null
let pmremGenerator = null
let dracoLoader = null

onMounted(() => {
  // 1. Scene yaratish
  scene = new THREE.Scene()

  // 2. Camera sozlash
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, 5)

  // 3. WebGL Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true, // Shaffof fon
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 4. Studiya Yoritishi (PBR yaltirashi uchun)
  pmremGenerator = new THREE.PMREMGenerator(renderer)
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture

  // 5. 3D Modelni yuklash (Draco siqilgan .glb fayllar uchun DRACOLoader kerak)
  dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  const MODEL_URL = '/models/ferrari.glb'

  loader.load(
    MODEL_URL,
    (gltf) => {
      productModel = gltf.scene

      // Model o'lchami va boshlang'ich pozitsiyasi
      productModel.scale.set(0.5, 0.5, 0.5)
      productModel.rotation.y = Math.PI / 2

      scene.add(productModel)

      // Loading tugadi
      isLoading.value = false

      // Model yuklangach GSAP scroll animatsiyasini ulash
      initScrollAnimation()
    },
    (progress) => {
      if (progress.total > 0) {
        loadingProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }
    },
    (error) => {
      console.error('Model yuklashda xatolik:', error)
      isLoading.value = false
    },
  )

  // 6. Continuous Render Loop
  const tick = () => {
    renderer.render(scene, camera)
    animFrameId = requestAnimationFrame(tick)
  }
  tick()

  // Resize handler
  window.addEventListener('resize', onWindowResize)
})

// 7. GSAP ScrollTrigger Animatsiya Trayektoriyasi
const initScrollAnimation = () => {
  if (!productModel || !containerRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2, // Silliq harakat (Inersiya)
    },
  })

  // Section 1 -> Section 2: Model buriladi va o'ngga suriladi
  tl.to(productModel.rotation, {
    y: Math.PI * 2.5,
    x: 0.3,
    duration: 2,
  })
    .to(
      productModel.position,
      {
        z: 1.2,
        x: 0.8,
        duration: 2,
      },
      '<',
    )

    // Section 2 -> Section 3: Model teskari tomonga burilib, chapga o'tadi
    .to(productModel.rotation, {
      y: Math.PI * 4,
      x: -0.2,
      duration: 3,
    })
    .to(
      productModel.position,
      {
        z: 0.5,
        x: -0.8,
        duration: 3,
      },
      '<',
    )

    // Section 3 -> Section 4: Markazga qaytadi
    .to(productModel.rotation, {
      y: Math.PI * 5,
      x: 0,
      duration: 2,
    })
    .to(
      productModel.position,
      {
        z: 0,
        x: 0,
        duration: 2,
      },
      '<',
    )
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 8. Cleanup (Xotirani tozalash)
onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  cancelAnimationFrame(animFrameId)
  ScrollTrigger.getAll().forEach((t) => t.kill())
  if (pmremGenerator) pmremGenerator.dispose()
  if (dracoLoader) dracoLoader.dispose()
  if (renderer) renderer.dispose()
})
</script>

<style scoped>
.scroll-container {
  position: relative;
  background-color: #050505;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Loading Overlay */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #050505;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #0070f3;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Background Canvas */
.webgl-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}

/* HTML Content Layout */
.section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 0 5rem;
}

.content {
  max-width: 480px;
  text-align: center;
}

.content.left {
  margin-right: auto;
  text-align: left;
}

.content.right {
  margin-left: auto;
  text-align: right;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(0, 112, 243, 0.15);
  border: 1px solid rgba(0, 112, 243, 0.4);
  border-radius: 20px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  color: #3291ff;
}

h1,
h2 {
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -1px;
  background: linear-gradient(180deg, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1.15rem;
  color: #a1a1a6;
  line-height: 1.6;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .section {
    padding: 0 1.5rem;
  }
  .content.left,
  .content.right {
    margin: 0 auto;
    text-align: center;
  }
  h1,
  h2 {
    font-size: 2.2rem;
  }
}
</style>
