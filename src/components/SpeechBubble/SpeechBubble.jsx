import React, { useEffect, useState, useRef } from "react";

/**
 * Pure presentation-only Speech Bubble component for Otoboke.
 *
 * Props:
 * - message: string | ReactNode - Message content to display (no hardcoded text).
 * - duration: number - Auto-disappear duration in ms (default: 3500ms). Pass 0 for persistent display.
 * - onClose: function - Callback triggered when exit animation finishes.
 * - isVisible: boolean (optional) - Direct visibility control if provided.
 * - className: string - Custom Tailwind CSS classes.
 * - style: object - Inline style overrides.
 */
function SpeechBubble({ 
  message, 
  duration = 3500, 
  onClose, 
  isVisible: externalVisible,
  className = "", 
  style = {} 
}) {
  const [internalVisible, setInternalVisible] = useState(false);
  const hideTimeoutRef = useRef(null);
  const closeCallbackTimeoutRef = useRef(null);

  useEffect(() => {
    if (message) {
      setInternalVisible(true);

      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (closeCallbackTimeoutRef.current) clearTimeout(closeCallbackTimeoutRef.current);

      if (duration > 0) {
        hideTimeoutRef.current = setTimeout(() => {
          setInternalVisible(false);

          closeCallbackTimeoutRef.current = setTimeout(() => {
            if (onClose) onClose();
          }, 300); // 300ms matches exit animation duration
        }, duration);
      }
    } else {
      setInternalVisible(false);
    }

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (closeCallbackTimeoutRef.current) clearTimeout(closeCallbackTimeoutRef.current);
    };
  }, [message, duration, onClose]);

  const activeVisible = externalVisible !== undefined ? externalVisible : internalVisible;

  if (!message && !activeVisible) return null;

  return (
    <div 
      className={`relative inline-flex flex-col items-center justify-center bg-white text-black text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl border-[3px] border-black drop-shadow-md transition-all duration-300 ease-out origin-bottom-left max-w-[240px] sm:max-w-[280px] min-w-[100px] break-words select-none ${
        activeVisible 
          ? "scale-100 opacity-100 translate-y-0" 
          : "scale-75 opacity-0 translate-y-2 pointer-events-none"
      } ${className}`}
      style={style}
    >
      <div className="w-full text-center leading-tight pointer-events-none">
        {message}
      </div>

      {/* Pointer tail pointing towards speaker */}
      <svg 
        className="absolute -bottom-3 left-4 w-4 h-4 overflow-visible pointer-events-none" 
        viewBox="0 0 20 20" 
        fill="none"
      >
        <path 
          d="M0 0 L15 0 C10 8 4 15 0 18 C1 12 0 6 0 0 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <line x1="1" y1="0" x2="14" y2="0" stroke="white" strokeWidth="4" />
      </svg>
    </div>
  );
}

export default SpeechBubble;
