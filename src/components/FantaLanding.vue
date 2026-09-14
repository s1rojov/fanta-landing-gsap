<template>
  <div class="main">
    <!-- Navbar -->
    <nav>
      <a href="#" class="logo">Logo</a>
      <div class="nav-center">
        <a href="#">Home</a>
        <a href="#">Products</a>
        <a href="#">Shop</a>
        <a href="#">Contact</a>
      </div>
      <i class="ri-menu-fill"></i>
    </nav>

    <!-- 1-Bo'lim: Hero Section -->
    <div class="one">
      <h1>FANTA</h1>
      <img class="orange2" src="/Assets/orange2.png" alt="Orange 2" />
      <img class="fanta" src="/Assets/fanta.png" alt="Fanta" />
      <img class="orange" src="/Assets/orange.webp" alt="Orange" />
      <img class="leaf" src="/Assets/leaf.webp" alt="Leaf 1" />
      <img class="leaf2" src="/Assets/leaf2.png" alt="Leaf 2" />
      <img class="leaf3" src="/Assets/coconoutleaf.png" alt="Coconut Leaf" />
    </div>

    <!-- 2-Bo'lim: Details Section -->
    <div class="two">
      <div class="left"></div>
      <div class="right">
        <h1>Flavour updated</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates labore natus
          obcaecati. Quae in odit saepe fuga architecto consectetur illum ex rerum quisquam dolore
          aperiam qui assumenda dolores, necessitatibus minima quis repellat. Rerum ut eveniet,
          nemo, porro esse, voluptatum ipsum quo perferendis quas quidem distinctio. Facere modi
          vitae nisi consectetur assumenda aliquam, cum blanditiis consequuntur dicta numquam
          voluptatibus quae voluptatum tenetur libero quis tempore, sint optio iure iste doloremque
          ut quibusdam!
        </p>
      </div>
    </div>

    <!-- 3-Bo'lim: Cards Section -->
    <div id="three">
      <div class="card">
        <img class="lemon lemon1" src="/Assets/orange2.png" alt="Lemon" />
        <img id="cocacola" src="/Assets/cocacola.png" alt="Coca Cola" />
        <h1>Coca Cola</h1>
        <button>Buy Now</button>
      </div>
      <div class="card">
        <!-- <img class="lemon" src="/Assets/orange2.png" alt="Lemon" /> -->
        <img id="fanta-card" src="/Assets/fanta.png" alt="Fanta Card" />
        <h1>Fanta</h1>
        <button>Buy Now</button>
      </div>
      <div class="card">
        <img class="lemon" src="/Assets/orange2.png" alt="Lemon" />
        <img id="pepsi" src="/Assets/pepsi.png" alt="Pepsi" />
        <h1>Pepsi</h1>
        <button>Buy Now</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    // 1-bo'limdan 2-bo'limga o'tish (o'zgarishsiz)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.two',
        start: '0% 97%',
        end: '70% 50%',
        scrub: true,
      },
    })

    tl.to('.fanta', { top: '120%', left: '0%' }, 'orange')
      .to('.orange2', { top: '160%', left: '23%' }, 'orange')
      .to('.orange', { width: '15%', top: '160%', right: '10%' }, 'orange')
      .to('.leaf', { top: '110%', left: '80%' }, 'orange')
      .to('.leaf2', { top: '110%', left: '0%' }, 'orange')

    // 2-bo'limdan 3-bo'limga o'tish
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: '#three',
        start: '0% 95%',
        end: '20% 50%',
        scrub: true,
      },
    })

    // --- YANGI QISM: fanta-card joyini aniq o'lchab olamiz ---
    const oneEl = document.querySelector('.one')
    const fantaTarget = document.querySelector('#fanta-card')
    const oneRect = oneEl.getBoundingClientRect()
    const targetRect = fantaTarget.getBoundingClientRect()

    const targetLeft = ((targetRect.left - oneRect.left) / oneRect.width) * 100
    const targetTop = ((targetRect.top - oneRect.top) / oneRect.height) * 100
    const targetWidth = (targetRect.width / oneRect.width) * 100
    // --- YANGI QISM tugadi ---

    tl2
      .from(
        '.lemon1',
        {
          rotate: '-90deg',
          left: '-50%',
          top: '110%',
        },
        'ca',
      )
      .to(
        '.fanta',
        {
          top: `${targetTop}%`,
          left: `34%`,
          width: `33%`,
        },
        'ca',
      )
      .to(
        '.orange2',
        {
          top: `${targetTop - 21}%`, // kerak bo'lsa orange2 uchun sal moslang
          left: `${targetLeft - 6.5}%`,
          width: '28%',
        },
        'ca',
      )
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<!-- Vue (Vite) default css ta'sirini yo'qotish va umumiy scrollni to'g'rilash uchun Global style -->
<style>
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  overflow-x: clip;
}

/* Vite/Vue da auto qo'shiladigan margin va paddinglarni tozalash */
#app {
  width: 100%;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  text-align: left;
}
</style>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

.main {
  width: 100%;
  position: relative;
  overflow-x: clip;
}

nav {
  position: fixed;
  height: 10vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0vw 10vw;
  z-index: 99;
}

nav a {
  text-decoration: none;
  font-size: 1.3vw;
  color: #fff;
}

.nav-center {
  display: flex;
  gap: 3vw;
}

nav i {
  font-size: 1.3vw;
  color: #fff;
}

.one {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(150deg, rgb(255, 166, 0), rgb(255, 68, 0));
}

.fanta {
  width: 40%;
  z-index: 2;
  position: absolute;
  transition: all cubic-bezier(0.19, 1, 0.22, 1);
}

.orange2 {
  width: 15%;
  position: absolute;
  top: 10%;
  left: 32%;
  z-index: 1;
  transition: all cubic-bezier(0.19, 1, 0.22, 1);
}

.orange {
  width: 20%;
  position: absolute;
  z-index: 3;
  top: 55%;
  right: 30%;
  transition: all cubic-bezier(0.19, 1, 0.22, 1);
}

.one h1 {
  font-size: 25vw;
  color: #fff;
  user-select: none;
}

.leaf {
  top: 10%;
  left: 0%;
  transform: rotate(60deg);
  position: absolute;
  width: 18%;
  transition: all cubic-bezier(0.19, 1, 0.22, 1);
}

.leaf2 {
  position: absolute;
  top: 60%;
  left: 80%;
  transform: rotate(-90deg);
  width: 12%;
  transition: all cubic-bezier(0.19, 1, 0.22, 1);
}

.leaf3 {
  position: absolute;
  width: 20%;
  top: 0%;
  right: 0%;
}

.two {
  display: flex;
  width: 100%;
  height: 100vh;
  background: #4d231c;
  position: relative;
}

.left,
.right {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 3vh;
  width: 50%;
  height: 100%;
}

.right h1 {
  color: #fff;
  font-size: 5vw;
}

.right p {
  font-size: 1vw;
  color: #fff;
  width: 80%;
  line-height: 1.5;
}

#three {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5vw;
  width: 100%;
  height: 100vh;
  background: linear-gradient(150deg, rgb(255, 166, 0), rgb(255, 68, 0));
}

.card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1vw;
  width: 25vw;
  height: 70vh;
  margin-top: 10vh;
  border-radius: 20px;
  background-color: #fff;
}

.card h1 {
  font-size: 3vw;
  margin-top: 24vw;
  position: relative; /* ← qo'shildi */
  z-index: 2;
}

.card button {
  font-size: 1vw;
  border-radius: 50px;
  background-color: orange;
  color: #fff;
  border: none;
  padding: 1vw 2vw;
  cursor: pointer;
  position: relative; /* ← qo'shildi */
  z-index: 2;
}

#cocacola {
  top: 0%;
  position: absolute;
  width: 13vw;
}

#pepsi {
  position: absolute;
  width: 20vw;
  top: -5%;
}

.lemon {
  width: 28vw;
  position: absolute;
  top: -30%;
  z-index: 0;
}

#fanta-card {
  position: absolute;
  width: 15vw; /* cocacola (13vw) ga yaqin — banka shakliga moslang */
  top: 0%; /* cocacola bilan bir xil balandlik */
  opacity: 0; /* shisha bu joyda ko'rinmaydi, o'rniga .fanta uchib keladi */
  z-index: 0;
}
</style>
