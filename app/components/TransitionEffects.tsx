import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';

export interface TransitionEffectsHandle {
  triggerEffect: (type: 'bubbles' | 'pixels' | 'fireworks' | 'rainbow') => void;
}

const TransitionEffects = forwardRef<TransitionEffectsHandle>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    triggerEffect: (type: 'bubbles' | 'pixels' | 'fireworks' | 'rainbow') => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const particleCount = type === 'pixels' ? 60 : type === 'bubbles' ? 30 : type === 'fireworks' ? 50 : 12;
      
      // Clear previous particles
      container.innerHTML = '';

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Style based on type
        if (type === 'bubbles') {
          const size = gsap.utils.random(20, 80);
          particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(100,200,255,0.3));
            border: 2px solid rgba(255,255,255,0.3);
            box-shadow: inset 0 0 20px rgba(255,255,255,0.5), 0 0 20px rgba(100,200,255,0.4);
            pointer-events: none;
            left: ${gsap.utils.random(0, 100)}%;
            top: ${gsap.utils.random(80, 120)}%;
          `;
        } else if (type === 'pixels') {
          const size = gsap.utils.random(8, 20);
          const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
          particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            box-shadow: 0 0 ${size}px currentColor;
            pointer-events: none;
            left: ${gsap.utils.random(0, 100)}%;
            top: ${gsap.utils.random(0, 100)}%;
          `;
        } else if (type === 'fireworks') {
          const size = gsap.utils.random(4, 12);
          const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#00ffff', '#ff00ff'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color};
            pointer-events: none;
            left: 50%;
            top: 70%;
          `;
        } else if (type === 'rainbow') {
          const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
          const barHeight = window.innerHeight / 7;
          const colorIndex = i % 7;
          particle.style.cssText = `
            position: absolute;
            width: 100%;
            height: ${barHeight}px;
            background: ${rainbowColors[colorIndex]};
            opacity: 0.8;
            pointer-events: none;
            left: -100%;
            top: ${colorIndex * barHeight}px;
          `;
        }
        
        container.appendChild(particle);
        
        // Animate based on type
        const tl = gsap.timeline({
          onComplete: () => particle.remove()
        });

        if (type === 'bubbles') {
          tl.to(particle, {
            y: -window.innerHeight - 100,
            x: `+=${gsap.utils.random(-100, 100)}`,
            rotation: gsap.utils.random(-360, 360),
            opacity: 0,
            duration: gsap.utils.random(2, 4),
            ease: 'power1.out'
          });
        } else if (type === 'pixels') {
          tl.fromTo(particle, {
            scale: 0,
            opacity: 1
          }, {
            scale: gsap.utils.random(1, 2),
            x: `+=${gsap.utils.random(-200, 200)}`,
            y: `+=${gsap.utils.random(-200, 200)}`,
            opacity: 0,
            rotation: gsap.utils.random(-720, 720),
            duration: gsap.utils.random(0.8, 1.5),
            ease: 'power2.out'
          });
        } else if (type === 'fireworks') {
          const angle = (i / particleCount) * Math.PI * 2;
          const distance = gsap.utils.random(150, 350);
          const xOffset = Math.cos(angle) * distance;
          const yOffset = Math.sin(angle) * distance;
          
          tl.fromTo(particle, {
            scale: 0,
            opacity: 1
          }, {
            x: `+=${xOffset}`,
            y: `+=${yOffset}`,
            scale: gsap.utils.random(0.5, 1.5),
            opacity: 0,
            duration: gsap.utils.random(1, 1.8),
            ease: 'power2.out'
          });
        } else if (type === 'rainbow') {
          const delay = (i % 7) * 0.08;
          tl.to(particle, {
            left: '100%',
            duration: 1.2,
            ease: 'power2.inOut',
            delay: delay
          });
        }
      }
    }
  }));

  return (
    <div 
      ref={containerRef} 
      className="transition-effects fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
});

TransitionEffects.displayName = 'TransitionEffects';

export default TransitionEffects;
