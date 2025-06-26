import { useAvatar } from "@/hooks/useAvatar";
import React, { useEffect, useState, useRef } from "react";
import { AlertCircle } from "lucide-react";

export const NewsRibbon = () => {
  const { currentNews } = useAvatar();
  const [visible, setVisible] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Auto-hide the ribbon after 10 seconds if no news
  useEffect(() => {
    if (!currentNews) {
      const timer = setTimeout(() => setVisible(false), 10000);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [currentNews]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let position = 0;

    const scroll = () => {
      if (scrollContainer && contentRef.current) {
        // Determine scroll speed based on hover state
        const speed = isSlow ? 0.5 : 2;
        
        // Increment position
        position += speed;
        
        // Reset position when it exceeds content width to create infinite loop
        const contentWidth = contentRef.current.clientWidth / 2;
        if (position >= contentWidth) {
          position = 0;
        }
        
        // Apply the scroll position
        scrollContainer.scrollLeft = position;
        
        // Continue animation
        animationRef.current = requestAnimationFrame(scroll);
      }
    };

    // Start the animation
    animationRef.current = requestAnimationFrame(scroll);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isSlow]);

  if (!visible || !currentNews) return null;

  // Create repeated news content to ensure continuous flow
  const repeatedNews = `${currentNews} • ${currentNews} • ${currentNews} • ${currentNews} • `;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-800 to-red-700 text-white py-3 shadow-lg z-50 border-t border-red-600"
      onMouseEnter={() => setIsSlow(true)}
      onMouseLeave={() => setIsSlow(false)}
    >
      <div className="container mx-auto px-4 flex items-center gap-2">
        <AlertCircle className="flex-shrink-0 text-red-200" size={20} />

        <div 
          ref={scrollRef} 
          className="overflow-hidden flex-1"
          style={{ scrollbarWidth: 'none' }}
        >
          <div ref={contentRef} className="whitespace-nowrap font-medium inline-block">
            {repeatedNews}{repeatedNews}
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 px-2 hover:bg-red-600 rounded transition-colors duration-150"
          aria-label="Close news"
        >
          ×
        </button>
      </div>
    </div>
  );
};