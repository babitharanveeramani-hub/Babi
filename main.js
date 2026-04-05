import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

/* ============================
   PRELOADER
   ============================ */
const preloader = document.getElementById('preloader')

window.addEventListener('load', () => {
  gsap.delayedCall(1.6, () => {
    preloader.classList.add('done')
    setTimeout(() => { preloader.style.display = 'none' }, 600)
    heroEntrance()
  })
})

/* ============================
   LENIS SMOOTH SCROLL — FIXED
   Single RAF loop. No double-tick.
   ============================ */
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothTouch: false,
  touchMultiplier: 1.8,
})

// Single clean RAF — DO NOT add another gsap.ticker.add for lenis
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Sync Lenis scroll position with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

// Disable lagSmoothing so ScrollTrigger stays in sync
gsap.ticker.lagSmoothing(0)

/* ============================
   HEADER
   ============================ */
const header = document.getElementById('site-header')

lenis.on('scroll', ({ scroll }) => {
  header.classList.toggle('scrolled', scroll > 80)
})

/* ============================
   MOBILE MENU
   ============================ */
const burger = document.getElementById('burger')
const mobileMenu = document.getElementById('mobileMenu')

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open')
    // Pause scroll when menu is open
    if (isOpen) lenis.stop()
    else lenis.start()
  })
  document.querySelectorAll('.mm-link').forEach(l => {
    l.addEventListener('click', () => {
      mobileMenu.classList.remove('open')
      lenis.start()
    })
  })
}

/* ============================
   HERO ENTRANCE — split layout
   ============================ */
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // 1. Image reveal
  tl.fromTo('#heroImgWrap', 
    { xPercent: -15, opacity: 0 }, 
    { xPercent: 0, opacity: 1, duration: 1.8, ease: 'power3.out' }, 
  0)
  tl.fromTo('#heroImg', 
    { scale: 1.15 }, 
    { scale: 1, duration: 2.2, ease: 'power2.out' }, 
  0)

  // 2. Headline line reveals
  gsap.utils.toArray('.hi').forEach((el, i) => {
    tl.to(el, {
      y: '0%',
      duration: 1,
      ease: 'power4.out'
    }, 0.4 + i * 0.12)
  })

  // 3. Eyebrow
  tl.fromTo('#heroEyebrow',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.8 },
  0.5)

  // 4. Subtext
  tl.fromTo('#heroSub',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.8 },
  0.8)

  // 5. Action buttons
  tl.fromTo('#heroActions',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.8 },
  1.0)

  // 6. Bottom foot
  tl.fromTo('#heroFoot', 
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.7 }, 
  1.2)

  // Subtle parallax on hero image (scroll)
  gsap.to('#heroImg', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  })
}

/* ============================
   SCROLL REVEAL ANIMATIONS
   ============================ */
// Wait for DOM to be ready, then set up reveals
function initScrollAnimations() {
  // Fade-up elements
  document.querySelectorAll('.reveal-up').forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
    })
  })

  // Image mask reveals
  document.querySelectorAll('.reveal-mask').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => el.classList.add('active'),
    })
  })

  // Story image parallax — gentle
  document.querySelectorAll('.sp-media img').forEach(img => {
    gsap.fromTo(img,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.sp-media'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    )
  })

  // CTA right image parallax
  const ctaImg = document.querySelector('.cta-right img')
  if (ctaImg) {
    gsap.fromTo(ctaImg,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    )
  }
}

initScrollAnimations()

/* ============================
   STICKY WHATSAPP — appears after hero
   ============================ */
const waPill = document.getElementById('waPill')
if (waPill) {
  ScrollTrigger.create({
    trigger: '.story-section',
    start: 'top 60%',
    onEnter: () => waPill.classList.add('show'),
    onLeaveBack: () => waPill.classList.remove('show'),
  })
}
