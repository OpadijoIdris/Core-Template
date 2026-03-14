"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo } from 'react-icons/fi';
import { clsx, type ClassValue } from 'clsx';

// Helper for tailwind classes (standard in Next.js projects)
function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

interface GuidanceProps {
  message: string;
  children?: React.ReactNode;
  pulse?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Guidance: React.FC<GuidanceProps> = ({ 
  message, 
  children, 
  pulse = false, 
  position = 'top',
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
  };

  return (
    <div className={cn("relative inline-flex items-center group", className)}>
      {children}
      
      <div 
        className="relative ml-1.5 cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <FiInfo className="w-3.5 h-3.5 text-blue-500/50 hover:text-blue-600 transition-colors" />
        
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20 pointer-events-none"></span>
        )}

        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "absolute z-50 w-48 p-3 bg-[#0f172a] text-white text-[11px] font-bold leading-relaxed rounded-xl shadow-2xl pointer-events-none",
                positionClasses[position]
              )}
            >
              {message}
              {/* Tooltip Arrow */}
              <div className={cn(
                "absolute border-4 border-transparent",
                arrowClasses[position]
              )}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Guidance;
