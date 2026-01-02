'use client'

import React from 'react'

interface BackgroundItem {
  id: number
  title: string
  secondary: string
  text: string
  img: string
}

interface LatarBelakangSectionProps {
  items: BackgroundItem[]
  onItemClick: (e: React.MouseEvent<HTMLDivElement>, item: BackgroundItem) => void
}

export const LatarBelakangSection: React.FC<LatarBelakangSectionProps> = ({ items, onItemClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="item group relative aspect-4/3 cursor-pointer overflow-hidden rounded-lg md:rounded-xl shadow-lg"
          onClick={(e) => onItemClick(e, item)}
        >
          <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
          <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white">
            <h3 className="text-xl md:text-2xl font-bold">{item.title}</h3>
            <p className="text-xs md:text-sm opacity-80">{item.secondary}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
