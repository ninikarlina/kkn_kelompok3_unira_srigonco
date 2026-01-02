'use client'

import React from 'react'

interface DokumentasiSectionProps {
  galleryItems: string[]
  galleryRotations: number[]
}

export const DokumentasiSection: React.FC<DokumentasiSectionProps> = ({ galleryItems, galleryRotations }) => {
  return (
    <div className="gallery-container relative w-full h-[50vh] md:h-[60vh] mt-8 md:mt-12 border-2 border-dashed border-gray-200 rounded-lg md:rounded-xl overflow-hidden bg-gray-50">
      <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm md:text-xl pointer-events-none text-center px-4">
        DRAG PHOTOS AROUND
      </p>
      {galleryItems.map((src, i) => (
        <div 
          key={i} 
          className="gallery-item absolute w-40 h-32 sm:w-48 sm:h-36 md:w-56 md:h-44 lg:w-64 lg:h-48 bg-white p-2 shadow-lg rounded-lg transform" 
          style={{ 
            top: `${20 + (i * 10)}%`, 
            left: `${10 + (i * 15)}%`, 
            transform: `rotate(${galleryRotations[i]}deg)` 
          }}
        >
          <img src={src} alt="Gallery" className="w-full h-full object-cover rounded" />
        </div>
      ))}
    </div>
  )
}
