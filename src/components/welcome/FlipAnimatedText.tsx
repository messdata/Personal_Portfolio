import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FlipAnimatedTextProps {
    text: string;
    delay?: number;
    className?: string;
    onComplete?: () => void;
}

export default function FlipAnimatedText({
    text,
    delay = 0,
    className = '',
    onComplete
}: FlipAnimatedTextProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const letters = text.split('');

    return (
        <div className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', perspective: '1000px' }}>
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    // 3D flip effect - very dramatic!
                    initial={{ opacity: 0, rotateX: -90, y: 20 }}
                    animate={isVisible ? {
                        opacity: 1,
                        rotateX: 0,
                        y: 0
                    } : {}}
                    transition={{
                        duration: 0.7,
                        delay: delay + (index * 0.05),
                        ease: 'easeOut'
                    }}
                    onAnimationComplete={() => {
                        if (index === letters.length - 1 && onComplete) {
                            onComplete();
                        }
                    }}
                    style={{
                        display: 'inline-block',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </div>
    );
}