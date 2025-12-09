import { useEffect, useState } from 'react';

interface TypewriterTextProps {
    texts: string[];
    onComplete?: () => void;
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export default function TypewriterText({
    texts,
    onComplete,
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 1500,
}: TypewriterTextProps) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (isComplete) return;

        const currentText = texts[currentIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayText.length < currentText.length) {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                } else {
                    // Finished typing current text
                    if (currentIndex === texts.length - 1) {
                        // Last text - mark as complete after pause
                        setTimeout(() => {
                            setIsComplete(true);
                            onComplete?.();
                        }, pauseDuration);
                    } else {
                        // Move to next text after pause
                        setTimeout(() => {
                            setIsDeleting(true);
                        }, pauseDuration);
                    }
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    // Finished deleting, move to next text
                    setIsDeleting(false);
                    setCurrentIndex((prev) => prev + 1);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, currentIndex, isDeleting, texts, onComplete, typingSpeed, deletingSpeed, pauseDuration, isComplete]);

    return (
        <div className="typewriter-container">
            <h1 className="typewriter-text">
                {displayText}
                <span className="cursor">|</span>
            </h1>
        </div>
    );
}