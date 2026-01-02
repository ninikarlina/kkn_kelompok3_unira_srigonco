import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import { Draggable } from 'gsap/Draggable'
import { CustomEase } from 'gsap/CustomEase'
import React from 'react'

export const initializeScrollAnimations = (
  sections: HTMLElement[],
  contextSafe: <T extends Function>(func: T) => T
) => {
  // Custom Ease
  CustomEase.create("hop", "M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0")

  // Responsive check
  const isMobile = window.innerWidth < 768

  sections.forEach((section, i) => {
    const heading = section.querySelector('h2')
    const paragraph = section.querySelector('p')
    const number = section.querySelector('.page-number')
    
    // Stacking effect for sections 4 onwards (index 3+) - disable on mobile for better performance
    if (i >= 3 && !isMobile) {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        pin: true,
        pinSpacing: false,
        scrub: 2,
      })
      
      // Scale down and fade previous sections
      if (i > 3) {
        gsap.to(section, {
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: 2,
          },
          scale: 0.9,
          borderRadius: "20px",
          transformOrigin: "center top"
        })
      }
    }
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play reverse play reverse",
      }
    })
    
    if (number) {
      tl.from(number, { x: isMobile ? -30 : -50, opacity: 0, duration: 1.2, ease: "power2.out" })
    }

    if (heading) {
      // SplitText simulation - simplified for mobile
      const text = heading.innerText
      heading.innerHTML = text.split("").map(char => `<span class="char inline-block">${char === " " ? "&nbsp;" : char}</span>`).join("")
      const chars = heading.querySelectorAll('.char')
      
      tl.from(chars, {
        y: isMobile ? 50 : 100,
        opacity: 0,
        duration: isMobile ? 1 : 1.5,
        stagger: isMobile ? 0.02 : 0.03,
        ease: "power4.out"
      }, "-=0.8")
    }
    
    if (paragraph) {
      tl.from(paragraph, {
        y: isMobile ? 30 : 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=1")
    }
  })
}

export const initializeObserver = (visiSection: HTMLElement | null) => {
  if (!visiSection) return

  Observer.create({
    target: visiSection,
    type: "pointer,touch",
    onHover: (self) => {
      gsap.to(visiSection.querySelector('.visi-content'), {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out"
      })
      return
    },
    onHoverEnd: (self) => {
      gsap.to(visiSection.querySelector('.visi-content'), {
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      })
      return
    }
  })
}

export const initializeDraggable = () => {
  // Responsive check
  const isMobile = window.innerWidth < 768

  // Draggable for Program Unggulan - optimized for mobile
  Draggable.create(".program-slider", {
    type: "x",
    bounds: ".program-container",
    inertia: true,
    edgeResistance: isMobile ? 0.5 : 0.65,
    throwProps: true,
    // Improve mobile touch responsiveness
    minimumMovement: isMobile ? 5 : 10,
  })

  // Draggable for Dokumentasi - more touch-friendly on mobile
  Draggable.create(".gallery-item", {
    type: "x,y",
    bounds: ".gallery-container",
    inertia: true,
    edgeResistance: isMobile ? 0.7 : 0.65,
    minimumMovement: isMobile ? 3 : 5,
    onDragStart: function() {
      gsap.to(this.target, { scale: isMobile ? 1.05 : 1.1, zIndex: 100, duration: 0.2 })
    },
    onDragEnd: function() {
      gsap.to(this.target, { scale: 1, zIndex: 1, duration: 0.2 })
    }
  })
}

export const initializeDetailOverlay = (
  detailsRef: React.RefObject<HTMLDivElement | null>,
  detailContentRef: React.RefObject<HTMLDivElement | null>
) => {
  gsap.set(detailContentRef.current, { yPercent: -100 })
  gsap.set(detailsRef.current, { visibility: "hidden" })
}
