import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

const VisionInteraction: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const visiContent = containerRef.current;
    if (!visiContent) return;

    // We need to target the parent section for the observer to work effectively on hover over the area,
    // but since this component is inside the section, we can try observing the component itself or pass a ref.
    // However, the original code observed the SECTION.
    // To keep it simple and self-contained, let's observe this container.
    
    Observer.create({
        target: visiContent,
        type: "pointer,touch",
        onHover: () => {
            gsap.to(visiContent, {
                scale: 1.05,
                duration: 0.5,
                ease: "power2.out"
            })
        },
        onHoverEnd: () => {
            gsap.to(visiContent, {
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            })
        }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="visi-content p-8 bg-gray-50 rounded-2xl border border-gray-200 mt-8 transform transition-transform">
        <p className="text-lg text-gray-600 italic">"Semangat Semangat Oke Oke!!!"</p>
    </div>
  );
};

export default VisionInteraction;
