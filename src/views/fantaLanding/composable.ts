import { onMounted, onUnmounted, reactive, ref } from 'vue'

export interface Product {
  id: string
  name: string
  price: number
  img: string
}

export const products: Product[] = [
  { id: 'cocacola', name: 'Coca Cola', price: 12000, img: '/Assets/cocacola.png' },
  { id: 'fanta', name: 'Fanta', price: 11000, img: '/Assets/fanta.png' },
  { id: 'pepsi', name: 'Pepsi', price: 12000, img: '/Assets/pepsi.png' },
]

// Navbar scroll (blur/shrink) holati
export function useNavScroll(threshold = 40) {
  const isScrolled = ref(false)

  function handleScroll() {
    isScrolled.value = window.scrollY > threshold
  }

  onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))

  return { isScrolled }
}

// "Buy Now" bosilganda ochiladigan buyurtma modali
const MIN_QUANTITY = 1
const MAX_QUANTITY = 10

export function useBuyModal() {
  const isOpen = ref(false)
  const selectedProduct = ref<Product | null>(null)
  const status = ref<'idle' | 'success'>('idle')
  const form = reactive({
    email: '',
    quantity: MIN_QUANTITY,
  })

  function open(product: Product) {
    selectedProduct.value = product
    form.email = ''
    form.quantity = MIN_QUANTITY
    status.value = 'idle'
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function increment() {
    if (form.quantity < MAX_QUANTITY) form.quantity++
  }

  function decrement() {
    if (form.quantity > MIN_QUANTITY) form.quantity--
  }

  function submit() {
    if (!selectedProduct.value) return
    // TODO: backend integratsiyasi ulanganda shu yerga API chaqiruvi qo'shiladi
    status.value = 'success'
  }

  return {
    isOpen,
    selectedProduct,
    status,
    form,
    open,
    close,
    increment,
    decrement,
    submit,
    minQuantity: MIN_QUANTITY,
    maxQuantity: MAX_QUANTITY,
  }
}

// Contact bo'limidagi xabar yuborish formasi
export function useContactForm() {
  const status = ref<'idle' | 'success'>('idle')
  const form = reactive({
    name: '',
    email: '',
    message: '',
  })

  function submit() {
    // TODO: backend integratsiyasi ulanganda shu yerga API chaqiruvi qo'shiladi
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
  }

  return { status, form, submit }
}
