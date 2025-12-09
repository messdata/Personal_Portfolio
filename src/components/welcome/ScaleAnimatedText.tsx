import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ScaleAnimatedTextProps {
    text: string;
    delay?: number;
    className?: string;
    onComplete?: () => void;
}

export default function ScaleAnimatedText({
    text,
    delay = 0,
    className = '',
    onComplete
}: ScaleAnimatedTextProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
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
                    // Scale from small + transparent gives a "blur-like" dramatic entrance
                    initial={{ opacity: 0, scale: 0.3, y: 20 }}
                    animate={isVisible ? {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    } : {}}
                    transition={{
                        duration: 0.8,
                        delay: delay + (index * 0.05),
                        ease: [0.25, 0.1, 0.25, 1] // Custom easing for dramatic effect
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