import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { roadmapItems } from '../../data/content';

export interface RoadmapScrollHandle {
  scroll: (direction: number) => boolean;
}

const RoadmapScroll = forwardRef<RoadmapScrollHandle>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>('.roadmap-item');
    const slides = gsap.utils.toArray<HTMLElement>('.roadmap-slide');
    const fill = document.querySelector('.roadmap-fill');

    // Initial state
    gsap.set(fill, { scaleY: 1 / items.length, transformOrigin: "top" });
    gsap.set(items[0], { color: "#10b981" }); // Green-500
    gsap.set(slides[0], { autoAlpha: 1 });

    // Build timeline
    const tl = gsap.timeline({ paused: true });
    
    items.forEach((item, i) => {
      if (i === 0) return; // Skip first item as it's already set

      const previousItem = items[i - 1];
      
      tl.addLabel(`step-${i}`)
        .to(previousItem as HTMLElement, { color: "#9ca3af", duration: 0.4 }, ">") // Gray-400
        .to(items[i] as HTMLElement, { color: "#10b981", duration: 0.4 }, "<")
        .to(slides[i-1] as HTMLElement, { autoAlpha: 0, duration: 0.4, y: -20 }, "<")
        .fromTo(slides[i] as HTMLElement, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<")
        .to(fill, { scaleY: (i + 1) / items.length, duration: 0.4, ease: "none" }, "<");
    });

    tlRef.current = tl;

  }, { scope: containerRef });

  useImperativeHandle(ref, () => ({
    scroll: (direction: number) => {
      if (isAnimating.current || !tlRef.current) return true;

      const nextIndex = currentIndex + direction;

      // Check boundaries
      if (nextIndex < 0) return false; // Let parent handle prev section
      if (nextIndex >= roadmapItems.length) return false; // Let parent handle next section

      isAnimating.current = true;
      setCurrentIndex(nextIndex);

      if (direction > 0) {
        tlRef.current.tweenTo(`step-${nextIndex}`, {
            onComplete: () => { isAnimating.current = false; }
        });
      } else {
        // If going back to 0, tween to 0 (start)
        const label = nextIndex === 0 ? 0 : `step-${nextIndex}`;
        tlRef.current.tweenTo(label, {
            onComplete: () => { isAnimating.current = false; }
        });
      }

      return true; // We handled the scroll
    }
  }));

  return (
    <div ref={containerRef} className="roadmap-container w-full h-full flex items-center justify-center overflow-hidden">
      <div className="content w-full max-w-6xl mx-auto flex flex-col md:flex-row relative px-2 sm:px-3 md:px-10 py-2 sm:py-3 md:py-10 border-y border-black md:border-y-4 gap-2 md:gap-6 bg-linear-to-r from-purple-50 to-pink-50">
        {/* Left: Vertical Line + List with Anime Style */}
        <div className="left relative w-full md:w-64 shrink-0">
          {/* Background Line */}
          <div className="roadmap-line absolute left-2 md:left-8 top-0 w-0.5 md:w-2 h-full bg-black rounded-full pointer-events-none z-0 shadow-lg"></div>
          {/* Animated Fill with gradient */}
          <div className="roadmap-fill absolute left-2 md:left-8 top-0 w-0.5 md:w-2 h-full bg-linear-to-b from-emerald-400 via-cyan-400 to-blue-500 origin-top scale-y-0 rounded-full pointer-events-none z-0 shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>

          <ul className="roadmap-list text-[10px] sm:text-xs md:text-2xl lg:text-4xl font-black text-gray-400 list-none pl-4 sm:pl-6 md:pl-20 flex flex-col justify-between z-10 tracking-tight uppercase gap-0.5 sm:gap-1 md:gap-0">
            {roadmapItems.map((item) => (
              <li key={item.id} className="roadmap-item relative py-0.5 sm:py-1 md:py-4 transition-all duration-300 leading-none md:leading-tight drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] md:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:scale-105">
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Slide Content with Anime Cards */}
        <div className="right flex-1 relative min-h-45 sm:min-h-55 md:min-h-100">
          {roadmapItems.map((item) => (
            <div key={item.id} className="roadmap-slide absolute w-full md:w-3/4 top-1/2 -translate-y-1/2 right-0 opacity-0 invisible bg-white p-2 sm:p-2.5 md:p-6 rounded-lg sm:rounded-xl md:rounded-3xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-2 md:gap-6 items-center border border-black sm:border-2 md:border-4 overflow-hidden group">
               {/* Anime corner accent */}
               <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 md:w-16 md:h-16 bg-yellow-300 opacity-30" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
               <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 md:w-16 md:h-16 bg-cyan-300 opacity-30" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
               
               {/* Halftone pattern */}
               <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '6px 6px' }}></div>
               
               {/* Image with anime filter */}
               <div className="relative w-full md:w-1/2 h-20 sm:h-28 md:h-48 rounded-md sm:rounded-lg md:rounded-2xl overflow-hidden border border-black sm:border-2 md:border-4 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover brightness-110 contrast-125 saturate-150 group-hover:scale-110 transition-transform duration-500" />
                  {/* Speed lines overlay - Hidden on mobile */}
                  <div className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white transform -skew-y-6"></div>
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white transform -skew-y-6 mt-6"></div>
                  </div>
               </div>
               
               <div className="flex-1 relative z-10">
                   <h3 className="text-xs sm:text-sm md:text-2xl lg:text-3xl font-black text-gray-900 mb-0.5 sm:mb-1 md:mb-3 drop-shadow-[1px_1px_0px_rgba(255,215,0,0.3)] md:drop-shadow-[3px_3px_0px_rgba(255,215,0,0.3)] uppercase tracking-tight leading-tight">{item.title}</h3>
                   <p className="text-[9px] sm:text-[10px] md:text-base font-bold text-gray-700 leading-tight md:leading-relaxed line-clamp-2 md:line-clamp-none">{item.desc}</p>
                   {/* Decorative stars */}
                   <div className="flex gap-0.5 sm:gap-1 md:gap-2 mt-0.5 sm:mt-1 md:mt-3">
                     <span className="text-yellow-400 text-[10px] sm:text-xs md:text-xl">★</span>
                     <span className="text-cyan-400 text-[10px] sm:text-xs md:text-xl">★</span>
                     <span className="text-pink-400 text-[10px] sm:text-xs md:text-xl">★</span>
                   </div>
               </div>
               
               {/* Manga frame corners */}
               <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 md:top-2 md:right-2 w-2 h-2 sm:w-3 sm:h-3 md:w-8 md:h-8 border-t border-r sm:border-t-2 sm:border-r-2 md:border-t-4 md:border-r-4 border-black/40"></div>
               <div className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 md:bottom-2 md:left-2 w-2 h-2 sm:w-3 sm:h-3 md:w-8 md:h-8 border-b border-l sm:border-b-2 sm:border-l-2 md:border-b-4 md:border-l-4 border-black/40"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

RoadmapScroll.displayName = 'RoadmapScroll';

export default RoadmapScroll;
