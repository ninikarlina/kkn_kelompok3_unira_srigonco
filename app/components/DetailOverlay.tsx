'use client'

import React, { useRef } from 'react'

interface DetailData {
  id: number
  title: string
  secondary: string
  text: string
  img: string
}

interface DetailOverlayProps {
  detailData: DetailData
  detailsRef: React.RefObject<HTMLDivElement | null>
  detailContentRef: React.RefObject<HTMLDivElement | null>
  detailImageRef: React.RefObject<HTMLImageElement | null>
  onClose: () => void
}

export const DetailOverlay: React.FC<DetailOverlayProps> = ({ 
  detailData, 
  detailsRef, 
  detailContentRef, 
  detailImageRef, 
  onClose 
}) => {
  return (
    <div ref={detailsRef} className="detail fixed top-0 left-0 w-full h-full md:w-[90%] md:h-[90%] md:top-[5%] md:left-[5%] lg:w-[80%] lg:h-[80%] lg:top-[10%] lg:left-[10%] bg-white shadow-2xl rounded-xl overflow-hidden invisible z-50 flex flex-col">
      <div className="relative w-full h-1/2 md:h-3/5">
        <img ref={detailImageRef} src={detailData.img} alt={detailData.title} className="w-full h-full object-cover" />
        <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/80 p-1.5 md:p-2 rounded-full hover:bg-white transition-colors z-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div ref={detailContentRef} className="content h-1/2 md:h-2/5 bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-center relative z-10 overflow-y-auto">
        <div className="secondary text-purple-600 font-bold tracking-wider mb-1 md:mb-2 uppercase text-xs md:text-sm">{detailData.secondary}</div>
        <div className="title text-2xl sm:text-3xl md:text-4xl font-black mb-2 md:mb-4">{detailData.title}</div>
        <div className="description text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">{detailData.text}</div>
      </div>
    </div>
  )
}
