import React from 'react';
import { backgroundItems } from '../../data/content';

interface BackgroundGridProps {
  onItemClick: (e: React.MouseEvent<HTMLDivElement>, item: typeof backgroundItems[0]) => void;
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ onItemClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-6 mt-2 sm:mt-4 md:mt-8 lg:mt-12">
        {backgroundItems.map((item) => (
            <div 
                key={item.id} 
                className="item group relative aspect-video cursor-pointer overflow-hidden rounded-md sm:rounded-lg md:rounded-xl shadow-sm sm:shadow-md md:shadow-lg"
                onClick={(e) => onItemClick(e, item)}
            >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-2 sm:p-3 md:p-4 lg:p-6 text-white">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold">{item.title}</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm opacity-80">{item.secondary}</p>
                </div>
            </div>
        ))}
    </div>
  );
};

export default BackgroundGrid;
