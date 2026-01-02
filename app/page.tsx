'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { Draggable } from 'gsap/Draggable'
import { CustomEase } from 'gsap/CustomEase'
import { StaggeredMenu } from './components/StaggeredMenu'
import { DetailOverlay } from './components/DetailOverlay'
import { LatarBelakangSection } from './components/sections/LatarBelakangSection'
import { VisiSection } from './components/sections/VisiSection'
import { ProgramUnggulanSection } from './components/sections/ProgramUnggulanSection'
import { DokumentasiSection } from './components/sections/DokumentasiSection'
import { backgroundItems, programItems, galleryItems, galleryRotations, menuItems, socialItems, pages } from './data/items'
import { initializeScrollAnimations, initializeObserver, initializeDraggable } from './utils/gsapAnimations'
import { createFlipHandlers, initializeDetailOverlay } from './utils/flipAnimations'

gsap.registerPlugin(ScrollTrigger, Flip, Observer, Draggable, CustomEase)

export default function Home() {
  const container = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const detailContentRef = useRef<HTMLDivElement>(null)
  const detailImageRef = useRef<HTMLImageElement>(null)
  const [detailData, setDetailData] = useState(backgroundItems[0])
  
  const { contextSafe } = useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.page-section')
    
    // Initialize animations
    initializeScrollAnimations(sections, contextSafe)
    initializeObserver(sections[2])
    initializeDraggable()
    initializeDetailOverlay(detailsRef, detailContentRef)
    
    // Refresh ScrollTrigger on window resize for responsive behavior
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, { scope: container })

  const { hideDetails, showDetails } = createFlipHandlers(
    detailsRef,
    detailContentRef,
    detailImageRef,
    container,
    setDetailData,
    contextSafe
  )

  return (
    <main ref={container} className="bg-white text-black w-full overflow-hidden relative">
      
      {/* Staggered Menu Navbar */}
      <StaggeredMenu
        position="right"
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
      <DetailOverlay 
        detailData={detailData}
        detailsRef={detailsRef}
        detailContentRef={detailContentRef}
        detailImageRef={detailImageRef}
        onClose={hideDetails}
      />

      {pages.map((page, index) => (
        <section 
          key={index} 
          className={`page-section min-h-screen w-full flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-0 border-b border-gray-100 last:border-none relative ${index >= 3 ? 'bg-white' : ''}`}
          style={index >= 3 ? { zIndex: 10 + index } : {}}
        >
          <div className="max-w-6xl mx-auto w-full">
            <span className="page-number block text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-gray-100 absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-12 lg:left-20 -z-10 select-none">
              {String(index + 1).padStart(2, '0')}
            </span>
            
            <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 md:mb-8 tracking-tighter uppercase leading-tight">
                {page.title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500 font-light max-w-2xl leading-relaxed mb-8 md:mb-12">
                {page.content}
                </p>

                {/* Latar Belakang Grid Interaction */}
                {index === 1 && (
                  <LatarBelakangSection items={backgroundItems} onItemClick={showDetails} />
                )}

                {/* Visi Kami Interaction */}
                {index === 2 && <VisiSection />}

                {/* Program Unggulan Draggable */}
                {index === 4 && <ProgramUnggulanSection items={programItems} />}

                {/* Dokumentasi Draggable Gallery */}
                {index === 8 && (
                  <DokumentasiSection 
                    galleryItems={galleryItems} 
                    galleryRotations={galleryRotations} 
                  />
                )}
            </div>
          </div>
        </section>
      ))}
    </main>
  )
}
