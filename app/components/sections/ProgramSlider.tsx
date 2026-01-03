import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { programItems } from '../../data/content';

gsap.registerPlugin(Draggable, ScrollTrigger);

const ProgramSlider: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>('.program-item');
    
    // Helper function for seamless loop
    function horizontalLoop(items: any[], config: any) {
        items = gsap.utils.toArray(items);
        config = config || {};
        let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100); } }),
            length = items.length,
            startX = items[0].offsetLeft,
            times: any[] = [],
            widths: any[] = [],
            xPercents: any[] = [],
            curIndex = 0,
            pixelsPerSecond = (config.speed || 1) * 100,
            snap = config.snap === false ? (v: any) => v : gsap.utils.snap(config.snap || 1),
            totalWidth: number, curX, distanceToStart, distanceToLoop, item, i;
            
        gsap.set(items, { 
            xPercent: (i, el) => {
                let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
                xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px") as string) / w * 100 + parseFloat(gsap.getProperty(el, "xPercent") as string));
                return xPercents[i];
            }
        });
        
        gsap.set(items, {x: 0});
        
        totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * parseFloat(gsap.getProperty(items[length-1], "scaleX") as string) + (parseFloat(config.paddingRight) || 0);
        
        for (i = 0; i < length; i++) {
            item = items[i];
            curX = xPercents[i] / 100 * widths[i];
            distanceToStart = item.offsetLeft + curX - startX;
            distanceToLoop = distanceToStart + widths[i] * parseFloat(gsap.getProperty(item, "scaleX") as string);
            
            tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
              .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
              .add("label" + i, distanceToStart / pixelsPerSecond);
            
            times[i] = distanceToStart / pixelsPerSecond;
        }
        
        function toIndex(index: number, vars: any) {
            vars = vars || {};
            (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); 
            let newIndex = gsap.utils.wrap(0, length, index),
                time = times[newIndex];
            if (time > tl.time() !== index > curIndex) { 
                vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
                time += tl.duration() * (index > curIndex ? 1 : -1);
            }
            curIndex = newIndex;
            vars.overwrite = true;
            return tl.tweenTo(time, vars);
        }
        
        (tl as any).next = (vars: any) => toIndex(curIndex+1, vars);
        (tl as any).prev = (vars: any) => toIndex(curIndex-1, vars);
        (tl as any).current = () => curIndex;
        (tl as any).toIndex = (index: number, vars: any) => toIndex(index, vars);
        (tl as any).times = times;
        tl.progress(1, true).progress(0, true); 
        
        if (config.reversed) {
            if (tl.vars.onReverseComplete) {
                 tl.vars.onReverseComplete();
            }
            tl.reverse();
        }
        
        if (config.draggable && typeof(Draggable) === "function") {
            let proxy = document.createElement("div"),
                wrap = gsap.utils.wrap(0, 1),
                ratio: number, startProgress: number, draggable: Draggable,
                align = () => { tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)); };
                
            draggable = Draggable.create(proxy, {
                trigger: items[0].parentElement,
                type: "x",
                onPress: () => {
                    startProgress = tl.progress();
                    tl.progress(0);
                    tl.progress(startProgress);
                    tl.pause();
                    ratio = 1 / totalWidth;
                },
                onDrag: align,
                onThrowUpdate: align,
                overshootTolerance: 0,
                inertia: true,
                snap: (value) => value,
                onRelease: () => {
                     tl.play(); 
                }
            })[0];
        }
        
        return tl;
    }

    // Double the items to ensure enough width for looping if needed, 
    // but since we render them below, we just select them here.
    // We need to ensure they are positioned absolutely for this specific helper implementation usually,
    // or at least that the helper can calculate offsetLeft correctly.
    // The helper assumes they are laid out horizontally.
    
    const loop = horizontalLoop(items, {
        speed: 1,
        paddingRight: 32,
        repeat: -1,
        paused: false,
        draggable: true,
        snap: false
    });

    return () => {
        loop.kill();
    };

  }, { scope: containerRef });

  // Triple items for smoother seamless loop
  const displayItems = [...programItems, ...programItems, ...programItems];

  // Calculate responsive spacing
  const getCardSpacing = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 192 + 16; // mobile: w-48 (192px) + 16px gap
      if (width < 768) return 224 + 24; // sm: w-56 (224px) + 24px gap
      if (width < 1024) return 288 + 28; // md: w-72 (288px) + 28px gap
      return 320 + 32; // lg: w-80 (320px) + 32px gap
    }
    return 320 + 32; // default
  };

  return (
    <div ref={containerRef} className="program-container w-full h-64 sm:h-80 md:h-96 lg:h-125 relative overflow-hidden flex items-center touch-none">
        {displayItems.map((item, index) => (
            <div 
                key={`${item.id}-${index}`} 
                className="program-item shrink-0 w-48 h-56 sm:w-56 sm:h-64 md:w-72 md:h-80 lg:w-80 lg:h-96 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 text-white flex flex-col justify-end absolute overflow-hidden group border-2 sm:border-3 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300"
                style={{ 
                    left: index * getCardSpacing(),
                    backgroundColor: item.color ? undefined : '#3b82f6' 
                }}
            >
                {/* Anime-style accent corner */}
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                
                {/* Image Background with anime filter */}
                <div className="absolute inset-0 -z-20">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                        src={item.image || "https://picsum.photos/400/500"} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 brightness-110 contrast-125 saturate-150" 
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
                     {/* Halftone pattern overlay */}
                     <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
                </div>
                
                {/* Speed lines decoration - hidden on mobile */}
                <div className="hidden sm:block absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -skew-y-12"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -skew-y-12 mt-4"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -skew-y-12 -mt-4"></div>
                </div>
                
                <div className="relative z-10">
                    <h3 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-black mb-1 sm:mb-1.5 md:mb-2 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] tracking-tight uppercase">{item.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-white/95 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)] sm:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] line-clamp-2 md:line-clamp-none">{item.desc}</p>
                </div>
                
                {/* Manga-style frame corners */}
                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 md:top-3 md:left-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-t-2 border-l-2 sm:border-t-3 sm:border-l-3 md:border-t-4 md:border-l-4 border-white/60"></div>
                <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 md:bottom-3 md:right-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-b-2 border-r-2 sm:border-b-3 sm:border-r-3 md:border-b-4 md:border-r-4 border-white/60"></div>
            </div>
        ))}
    </div>
  );
};

export default ProgramSlider;
