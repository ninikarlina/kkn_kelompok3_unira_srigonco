import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { galleryItems } from '../../data/content';

gsap.registerPlugin(Draggable);

const GalleryDraggable: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    Draggable.create(".gallery-item", {
        type: "x,y",
        bounds: containerRef.current,
        inertia: true,
        onDragStart: function() {
            gsap.to(this.target, { scale: 1.1, zIndex: 100, duration: 0.2 })
        },
        onDragEnd: function() {
            gsap.to(this.target, { scale: 1, zIndex: 1, duration: 0.2 })
        }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="gallery-container relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] mt-4 sm:mt-6 md:mt-12 border border-dashed sm:border-2 border-gray-200 rounded-lg sm:rounded-xl overflow-hidden bg-gray-50">
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs sm:text-sm md:text-xl pointer-events-none text-center px-4">DRAG PHOTOS AROUND</p>
        {galleryItems.map((src, i) => (
            <div key={i} className="gallery-item absolute w-32 h-24 sm:w-48 sm:h-36 md:w-64 md:h-48 bg-white p-1 sm:p-1.5 md:p-2 shadow-md sm:shadow-lg rounded-md sm:rounded-lg transform cursor-move" style={{ top: `${20 + (i * 10)}%`, left: `${10 + (i * 15)}%`, transform: `rotate(${((i * 17) % 20) - 10}deg)` }}>
                <img src={src} alt="Gallery" className="w-full h-full object-cover rounded" />
            </div>
        ))}
    </div>
  );
};

export default GalleryDraggable;
