<template>
  <div class="main">
    <!-- Navbar -->
    <nav :class="{ scrolled: isScrolled }">
      <a href="#top" class="logo">
        <img src="/images/fanta-logo.png" alt="logo" class="logo-img" />
      </a>
      <div class="nav-center">
        <a href="#top">Home</a>
        <a href="#three">Shop</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>

    <!-- 1-Bo'lim: Hero Section -->
    <div id="top" class="one">
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

    <!-- 3-Bo'lim: Cards / Shop Section -->
    <div id="three">
      <div class="card">
        <img class="lemon lemon1" src="/Assets/orange2.png" alt="Lemon" />
        <img id="cocacola" src="/Assets/cocacola.png" alt="Coca Cola" />
        <h1>Coca Cola</h1>
        <button @click="openBuyModal(products[0])">Buy Now</button>
      </div>
      <div class="card">
        <img id="fanta-card" src="/Assets/fanta.png" alt="Fanta Card" />
        <h1>Fanta</h1>
        <button @click="openBuyModal(products[1])">Buy Now</button>
      </div>
      <div class="card">
        <img class="lemon" src="/Assets/orange2.png" alt="Lemon" />
        <img id="pepsi" src="/Assets/pepsi.png" alt="Pepsi" />
        <h1>Pepsi</h1>
        <button @click="openBuyModal(products[2])">Buy Now</button>
      </div>
    </div>

    <!-- 4-Bo'lim: Contact Section -->
    <section id="contact" class="contact">
      <div class="info">
        <h2>Aloqa ma'lumotlari</h2>
        <p><strong>Manzil:</strong> Toshkent, O'zbekiston</p>
        <p><strong>Telefon:</strong> +998 90 123 45 67</p>
        <p><strong>Email:</strong> info@fanta.uz</p>
      </div>

      <form class="contact-form" @submit.prevent="submitContact">
        <template v-if="contactStatus === 'success'">
          <p class="success-msg">Xabaringiz yuborildi! Tez orada bog'lanamiz.</p>
        </template>
        <template v-else>
          <input type="text" v-model="contactForm.name" placeholder="Ismingiz" required />
          <input type="email" v-model="contactForm.email" placeholder="Email" required />
          <textarea
            v-model="contactForm.message"
            placeholder="Xabaringiz"
            rows="5"
            required
          ></textarea>
          <button type="submit">Yuborish</button>
        </template>
      </form>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-top">
        <a href="#top" class="logo">
          <img src="/images/fanta-logo.png" alt="logo" class="logo-img" />
        </a>
        <div class="footer-links">
          <a href="#top">Home</a>
          <a href="#three">Shop</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
      <p class="footer-copy">&copy; {{ new Date().getFullYear() }} Fanta. Barcha huquqlar himoyalangan.</p>
    </footer>

    <!-- Buy Now Modal -->
    <Transition name="modal">
      <div v-if="isBuyModalOpen" class="modal-overlay" @click.self="closeBuyModal">
        <Transition name="modal-pop" appear>
          <div class="modal">
            <button class="modal-close" @click="closeBuyModal" aria-label="Yopish">&times;</button>

            <template v-if="buyStatus === 'success'">
              <h2>Rahmat!</h2>
              <p class="success-msg">Buyurtmangiz qabul qilindi, tez orada bog'lanamiz.</p>
              <button class="modal-btn" @click="closeBuyModal">Yopish</button>
            </template>
            <template v-else>
              <h2>{{ selectedProduct?.name }} buyurtma qilish</h2>
              <img class="modal-img" :src="selectedProduct?.img" :alt="selectedProduct?.name" />
              <form @submit.prevent="submitBuy">
                <label>
                  Email
                  <input
                    type="email"
                    v-model="buyForm.email"
                    placeholder="email@example.com"
                    required
                  />
                </label>
                <label>
                  Soni
                  <div class="quantity-counter">
                    <button
                      type="button"
                      class="qty-btn"
                      :disabled="buyForm.quantity <= minQuantity"
                      @click="decrement"
                      aria-label="Kamaytirish"
                    >
                      −
                    </button>
                    <span class="qty-value">{{ buyForm.quantity }}</span>
                    <button
                      type="button"
                      class="qty-btn"
                      :disabled="buyForm.quantity >= maxQuantity"
                      @click="increment"
                      aria-label="Ko'paytirish"
                    >
                      +
                    </button>
                  </div>
                </label>
                <p class="modal-total">
                  Jami: {{ ((selectedProduct?.price ?? 0) * buyForm.quantity).toLocaleString() }} so'm
                </p>
                <button type="submit" class="modal-btn">Buyurtma berish</button>
              </form>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products, useNavScroll, useBuyModal, useContactForm } from './composable'

gsap.registerPlugin(ScrollTrigger)

const { isScrolled } = useNavScroll()

const {
  isOpen: isBuyModalOpen,
  selectedProduct,
  status: buyStatus,
  form: buyForm,
  open: openBuyModal,
  close: closeBuyModal,
  increment,
  decrement,
  submit: submitBuy,
  minQuantity,
  maxQuantity,
} = useBuyModal()

const { status: contactStatus, form: contactForm, submit: submitContact } = useContactForm()

let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    // 1-bo'limdan 2-bo'limga o'tish
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

    // --- fanta-card joyini aniq o'lchab olamiz ---
    const oneEl = document.querySelector('.one')
    const fantaTarget = document.querySelector('#fanta-card')
    const oneRect = oneEl.getBoundingClientRect()
    const targetRect = fantaTarget.getBoundingClientRect()

    const targetLeft = ((targetRect.left - oneRect.left) / oneRect.width) * 100
    const targetTop = ((targetRect.top - oneRect.top) / oneRect.height) * 100
    // --- tugadi ---

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
          top: `${targetTop - 21}%`,
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

<style src="./style.css" scoped></style>
