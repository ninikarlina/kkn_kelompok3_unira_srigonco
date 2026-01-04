'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { CustomEase } from 'gsap/CustomEase'
import { StaggeredMenu } from './components/StaggeredMenu'
import { backgroundItems, menuItems, socialItems, pages, randomBackgrounds } from './data/content'
import DetailsOverlay from './components/DetailsOverlay'
import BackgroundGrid from './components/sections/BackgroundGrid'
import VisionInteraction from './components/sections/VisionInteraction'
import ProgramSlider from './components/sections/ProgramSlider'
import GalleryDraggable from './components/sections/GalleryDraggable'
import RoadmapScroll, { RoadmapScrollHandle } from './components/sections/RoadmapScroll'
import TransitionEffects, { TransitionEffectsHandle } from './components/TransitionEffects'

gsap.registerPlugin(ScrollTrigger, Flip, Observer, CustomEase)

export default function Home() {
  const container = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const detailContentRef = useRef<HTMLDivElement>(null)
  const detailImageRef = useRef<HTMLImageElement>(null)
  const roadmapRef = useRef<RoadmapScrollHandle>(null)
  const effectsRef = useRef<TransitionEffectsHandle>(null)
  const [detailData, setDetailData] = useState(backgroundItems[0])
  
  // Generate random backgrounds for each section - client side only to avoid hydration mismatch
  const [sectionBackgrounds, setSectionBackgrounds] = useState<string[]>(() => 
    pages.map(() => randomBackgrounds[0]) // Use first background as default for SSR
  )
  
  useEffect(() => {
    // Generate random backgrounds only on client side after hydration
    setSectionBackgrounds(
      pages.map(() => {
        const randomIndex = Math.floor(Math.random() * randomBackgrounds.length)
        return randomBackgrounds[randomIndex]
      })
    )
  }, [])
  
  const { contextSafe } = useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.page-section')
    const images = gsap.utils.toArray<HTMLElement>('.bg')
    const outerWrappers = gsap.utils.toArray<HTMLElement>('.outer')
    const innerWrappers = gsap.utils.toArray<HTMLElement>('.inner')
    
    let currentIndex = -1
    let animating = false
    const wrap = gsap.utils.wrap(0, sections.length)

    gsap.set(outerWrappers, { yPercent: 100 })
    gsap.set(innerWrappers, { yPercent: -100 })
    gsap.set(sections, { autoAlpha: 0, zIndex: 0 }) // Initialize all hidden

    function gotoSection(index: number, direction: number) {
      index = wrap(index)
      animating = true
      
      const fromTop = direction === -1
      const dFactor = fromTop ? -1 : 1
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => { animating = false }
      })

      if (currentIndex >= 0) {
        gsap.set(sections[currentIndex], { zIndex: 0 })
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
          .set(sections[currentIndex], { autoAlpha: 0 })
      }

      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 })
      
      tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
          yPercent: (i) => i ? -100 * dFactor : 100 * dFactor
        }, { 
          yPercent: 0 
        }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
      
      // Animate text characters
      const chars = sections[index].querySelectorAll('.char')
      if (chars.length) {
        tl.fromTo(chars, { 
            autoAlpha: 0, 
            yPercent: 150 * dFactor
        }, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: {
              each: 0.02,
              from: "random"
            }
          }, 0.2)
      }

      // Trigger transition effect
      if (effectsRef.current && currentIndex !== index) {
        const effects: ('bubbles' | 'pixels' | 'fireworks' | 'rainbow')[] = ['bubbles', 'pixels', 'fireworks', 'rainbow'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        setTimeout(() => {
          effectsRef.current?.triggerEffect(randomEffect);
        }, 200);
      }

      currentIndex = index
    }

    // Expose gotoSection to window for button navigation
    (window as any).navigateToSection = (index: number) => {
      gotoSection(index, 1)
    }

    Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => {
        if (animating) return;
        // Check if we are in the Roadmap section (Index 4)
        if (currentIndex === 4 && roadmapRef.current) {
            const handled = roadmapRef.current.scroll(-1);
            if (handled) return;
        }
        gotoSection(currentIndex - 1, -1)
      },
      onUp: () => {
        if (animating) return;
        // Check if we are in the Roadmap section (Index 4)
        if (currentIndex === 4 && roadmapRef.current) {
            const handled = roadmapRef.current.scroll(1);
            if (handled) return;
        }
        gotoSection(currentIndex + 1, 1)
      },
      tolerance: 10,
      preventDefault: true,
      ignore: ".program-slider, .gallery-item, .gallery-container, .item" // Ignore drags on interactive elements
    })

    gotoSection(0, 1)

    // Initial setup for details
    if (detailContentRef.current) gsap.set(detailContentRef.current, { yPercent: -100 })
    if (detailsRef.current) gsap.set(detailsRef.current, { visibility: "hidden" })

  }, { scope: container })

  const hideDetails = contextSafe(() => {
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

  const showDetails = contextSafe((e: React.MouseEvent<HTMLDivElement>, item: typeof backgroundItems[0]) => {
    const target = e.currentTarget as HTMLElement
    if (target.classList.contains('active')) return hideDetails()

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

  return (
    <main ref={container} className="bg-white text-black w-full h-screen overflow-hidden relative">
      
      {/* Transition Effects Layer */}
      <TransitionEffects ref={effectsRef} />
      
      {/* Staggered Menu Navbar */}
      <StaggeredMenu
        position="right"
        logoUrl="/logokkn.svg"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#000"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF']}
        accentColor="#FF9FFC"
        isFixed={true}
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />

      {/* Details Overlay */}
      <DetailsOverlay 
        ref={detailsRef}
        detailData={detailData}
        onClose={hideDetails}
        detailImageRef={detailImageRef}
        detailContentRef={detailContentRef}
      />

      {pages.map((page, index) => (
        <section 
          key={index} 
          className="page-section fixed top-0 left-0 w-full h-full invisible"
        >
          <div className="outer w-full h-full overflow-hidden">
            <div className="inner w-full h-full relative">
              {/* Background Layer */}
              <div 
                className="bg absolute top-0 left-0 w-full h-full" 
                style={{ 
                  backgroundImage: `url(${sectionBackgrounds[index]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-white/70"></div>
              </div>
              
              {/* Content Layer */}
              <div className="content-container relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-20 py-6 sm:py-8 md:py-0 overflow-y-auto md:overflow-visible">
                <div className="max-w-6xl mx-auto w-full">
                  <span className="page-number hidden md:block text-6xl md:text-9xl font-bold text-gray-100 absolute top-10 left-8 md:left-20 -z-10 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  <div className="relative z-10">
                      {index === 0 ? (
                        // Enhanced Section 1 Layout
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-12 items-center">
                          {/* Left Content */}
                          <div className="space-y-2 sm:space-y-3 md:space-y-6 text-center md:text-left">
                            <h2 className="section-heading text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-tight">
                              {page.title.split("").map((char, i) => (
                                <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
                              ))}
                            </h2>
                            <div className="h-0.5 sm:h-1 md:h-1.5 w-12 sm:w-16 md:w-24 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mx-auto md:mx-0"></div>
                            <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-gray-600 font-light leading-snug md:leading-relaxed">
                              {page.content}
                            </p>
                            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-3 md:pt-4 justify-center md:justify-start">
                              <button 
                                onClick={() => (window as any).navigateToSection(1)}
                                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all cursor-pointer text-xs sm:text-sm md:text-base"
                              >
                                Jelajahi
                              </button>
                              <button 
                                onClick={() => (window as any).navigateToSection(3)}
                                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 border-2 border-gray-800 text-gray-800 rounded-full font-semibold hover:bg-gray-800 hover:text-white hover:scale-105 transition-all cursor-pointer text-xs sm:text-sm md:text-base"
                              >
                                About
                              </button>
                            </div>
                          </div>
                          
                          {/* Right Photo Box */}
                          <div className="relative group mt-4 sm:mt-6 md:mt-0 px-4 sm:px-6 md:px-0">
                            {/* Decorative elements - Hidden on mobile */}
                            <div className="hidden sm:block absolute -top-3 -left-3 sm:-top-4 sm:-left-4 md:-top-6 md:-left-6 w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-blue-200 rounded-2xl md:rounded-3xl -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="hidden sm:block absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-purple-200 rounded-2xl md:rounded-3xl -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                            
                            {/* Main Photo Box */}
                            <div className="relative rounded-lg sm:rounded-xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl transform group-hover:scale-105 transition-all duration-500 border-2 md:border-4 border-white max-w-xs sm:max-w-sm mx-auto md:max-w-none">
                              <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                              <img 
                                src="/images/LandingFoto/filosofilogo.jpeg" 
                                alt="Filosofi Logo KKN" 
                                className="w-full h-auto object-cover"
                              />
                            </div>
                            

                          </div>
                        </div>
                      ) : (
                        // Default Layout for Other Sections
                        <>
                          <h2 className="section-heading text-2xl sm:text-3xl md:text-5xl lg:text-8xl font-black mb-2 sm:mb-3 md:mb-6 lg:mb-8 tracking-tighter uppercase">
                            {page.title.split("").map((char, i) => (
                              <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
                            ))}
                          </h2>
                          <p className="text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl text-gray-500 font-light max-w-2xl leading-snug md:leading-relaxed mb-3 sm:mb-4 md:mb-8 lg:mb-12">
                            {page.content}
                          </p>
                        </>
                      )}

                      {/* Latar Belakang Grid Interaction */}
                      {index === 1 && (
                          <BackgroundGrid onItemClick={showDetails} />
                      )}

                      {/* Visi & Misi Interaction */}
                      {index === 2 && (
                          <VisionInteraction />
                      )}

                      {/* Program Unggulan Draggable */}
                      {index === 3 && (
                          <ProgramSlider />
                      )}

                      {/* Edukasi Roadmap Interaction */}
                      {index === 4 && (
                          <RoadmapScroll ref={roadmapRef} />
                      )}

                      {/* Dokumentasi Draggable Gallery */}
                      {index === 5 && (
                          <GalleryDraggable />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  )
}
