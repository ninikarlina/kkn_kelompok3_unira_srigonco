import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import React from 'react'

export const createFlipHandlers = (
  detailsRef: React.RefObject<HTMLDivElement | null>,
  detailContentRef: React.RefObject<HTMLDivElement | null>,
  detailImageRef: React.RefObject<HTMLImageElement | null>,
  container: React.RefObject<HTMLDivElement | null>,
  setDetailData: (data: any) => void,
  contextSafe: <T extends Function>(func: T) => T
) => {
  const hideDetails = contextSafe((): void => {
    if (!detailsRef.current || !detailContentRef.current) return
    
    const activeItem = document.querySelector('.item.active') as HTMLElement
    if (!activeItem) return

    document.removeEventListener('click', hideDetails as any)
    gsap.set(detailsRef.current, { overflow: "hidden" })

    const state = Flip.getState(detailsRef.current)

    Flip.fit(detailsRef.current, activeItem, { scale: true, fitChild: detailImageRef.current as HTMLElement })

    const tl = gsap.timeline()
    tl.set(detailsRef.current, { overflow: "hidden" })
      .to(detailContentRef.current, { yPercent: -100 })
      .to(".item", { opacity: 1, stagger: { amount: 0.7, from: "center", grid: "auto" } })
      .to(container.current, { backgroundColor: "#fff" }, "<")

    Flip.from(state, {
      scale: true,
      duration: 0.5,
      delay: 0.2,
      onInterrupt: () => { tl.kill() }
    }).set(detailsRef.current, { visibility: "hidden" })

    activeItem.classList.remove('active')
  })

  const showDetails = contextSafe((e: React.MouseEvent<HTMLDivElement>, item: any): void => {
    const target = e.currentTarget as HTMLElement
    if (target.classList.contains('active')) {
      hideDetails()
      return
    }

    // Update content
    setDetailData(item)
    
    const performAnimation = () => {
      target.classList.add('active')
      
      Flip.fit(detailsRef.current as HTMLElement, target, { scale: true, fitChild: detailImageRef.current as HTMLElement })
      
      const state = Flip.getState(detailsRef.current as HTMLElement)
      
      gsap.set(detailsRef.current, { clearProps: true })
      gsap.set(detailsRef.current, { 
        xPercent: -50, 
        top: "50%", 
        left: "50%",
        yPercent: -50, 
        visibility: "visible", 
        overflow: "hidden",
        position: "fixed",
        width: "90%",
        maxWidth: "800px",
        height: "80vh",
        zIndex: 50
      })

      Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        scale: true,
        onComplete: () => {
          gsap.set(detailsRef.current, { overflow: "auto" })
        }
      })
      .to(detailContentRef.current, { yPercent: 0 }, 0.2)

      gsap.to(".item", { opacity: 0.3, stagger: { amount: 0.7, from: "center", grid: "auto" } }).kill(target)
      gsap.to(container.current, { backgroundColor: "#888", duration: 1, delay: 0.3 })
    }

    requestAnimationFrame(performAnimation)
  })

  return { hideDetails, showDetails }
}

export const initializeDetailOverlay = (
  detailsRef: React.RefObject<HTMLDivElement | null>,
  detailContentRef: React.RefObject<HTMLDivElement | null>
) => {
  gsap.set(detailContentRef.current, { yPercent: -100 })
  gsap.set(detailsRef.current, { visibility: "hidden" })
}
