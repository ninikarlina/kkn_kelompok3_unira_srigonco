import React, { forwardRef } from 'react';

interface DetailsOverlayProps {
  detailData: {
    img: string;
    title: string;
    secondary: string;
    text: string;
  };
  onClose: () => void;
  detailImageRef: React.RefObject<HTMLImageElement | null>;
  detailContentRef: React.RefObject<HTMLDivElement | null>;
}

const DetailsOverlay = forwardRef<HTMLDivElement, DetailsOverlayProps>(({ detailData, onClose, detailImageRef, detailContentRef }, ref) => {
  return (
    <div ref={ref} className="detail fixed top-0 left-0 w-full h-full bg-white shadow-2xl rounded-xl overflow-hidden invisible z-50 flex flex-col">
      <div className="relative w-full h-2/5 sm:h-1/2">
          <img ref={detailImageRef} src={detailData.img} alt={detailData.title} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 p-1.5 sm:p-2 rounded-full hover:bg-white transition-colors z-20 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
      </div>
      <div ref={detailContentRef} className="content h-3/5 sm:h-1/2 bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-center relative z-10 overflow-y-auto">
          <div className="secondary text-purple-600 font-bold tracking-wider mb-1 sm:mb-2 uppercase text-xs sm:text-sm">{detailData.secondary}</div>
          <div className="title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-2 sm:mb-3 md:mb-4">{detailData.title}</div>
          <div className="description text-gray-600 text-sm sm:text-base md:text-lg leading-snug sm:leading-relaxed">{detailData.text}</div>
      </div>
    </div>
  );
});

DetailsOverlay.displayName = 'DetailsOverlay';

export default DetailsOverlay;
