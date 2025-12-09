import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SimpleAnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export default function SimpleAnimatedText({
  text,
  delay = 0,
  className = '',
  onComplete
}: SimpleAnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const letters = text.split('');

  return (
    <div className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? {
            opacity: 1,
            y: 0
          } : {}}
          transition={{
            duration: 0.6,
            delay: delay + (index * 0.05),
            ease: 'easeOut'
          }}
          onAnimationComplete={() => {
            if (index === letters.length - 1 && onComplete) {
              onComplete();
            }
          }}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  );
}