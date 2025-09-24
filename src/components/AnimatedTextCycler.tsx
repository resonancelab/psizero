import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextCyclerProps {
  texts: string[];
  interval?: number;
  className?: string;
}

const AnimatedTextCycler = ({ 
  texts, 
  interval = 3000, 
  className = "" 
}: AnimatedTextCyclerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            y: 20,
            filter: "blur(8px)",
            scale: 0.8
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            filter: "blur(0px)",
            scale: 1
          }}
          exit={{ 
            opacity: 0, 
            y: -20,
            filter: "blur(8px)",
            scale: 1.1
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="absolute inset-0 whitespace-nowrap bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent"
        >
          {texts[currentIndex]}
        </motion.span>
        
        {/* Background glow effect */}
        <motion.span
          key={`glow-${currentIndex}`}
          initial={{ 
            opacity: 0,
            scale: 0.8
          }}
          animate={{ 
            opacity: 0.3,
            scale: 1
          }}
          exit={{ 
            opacity: 0,
            scale: 1.2
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="absolute inset-0 whitespace-nowrap text-blue-300 blur-sm"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
      
      {/* Invisible placeholder to maintain layout */}
      <span className="invisible whitespace-nowrap">
        {texts.reduce((longest, current) => 
          current.length > longest.length ? current : longest, ""
        )}
      </span>

      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: interval / 1000,
          ease: "linear",
          repeat: Infinity
        }}
      />

      {/* Particle effects */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`particle-${currentIndex}-${i}`}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            top: `${20 + i * 20}%`,
            left: `${10 + i * 30}%`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, 30 * (i + 1), 60 * (i + 1)],
            y: [0, -20 * (i + 1), -40 * (i + 1)]
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: interval / 1000 - 2
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedTextCycler;