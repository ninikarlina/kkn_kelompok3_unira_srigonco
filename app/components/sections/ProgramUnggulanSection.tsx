'use client'

import React from 'react'

interface ProgramItem {
  id: number
  title: string
  desc: string
  color: string
}

interface ProgramUnggulanSectionProps {
  items: ProgramItem[]
}

export const ProgramUnggulanSection: React.FC<ProgramUnggulanSectionProps> = ({ items }) => {
  return (
    <div className="program-container w-full overflow-hidden mt-8 md:mt-12 cursor-grab active:cursor-grabbing">
      <div className="program-slider flex gap-4 md:gap-6 w-max">
        {items.map((item) => (
          <div key={item.id} className={`w-64 sm:w-72 md:w-80 h-80 sm:h-88 md:h-96 ${item.color} rounded-xl md:rounded-2xl p-6 md:p-8 text-white flex flex-col justify-end shadow-xl`}>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm md:text-base opacity-90">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
