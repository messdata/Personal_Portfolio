import React, { useState, useEffect } from 'react';

interface NavigationNodeProps {
    label: string;
    color: string;
    position: { x: number; y: number };
    delay: number;
    isVisible: boolean;
    onClick: () => void;
}

export default function NavigationNode({
    label,
    color,
    position,
    delay,
    isVisible,
    onClick
}: NavigationNodeProps) {
    const [styles, setStyles] = useState({
        fontSize: '16px',
        padding: '0.6em 1.5em'
    });

    useEffect(() => {
        const updateStyles = () => {
            if (typeof window === 'undefined') return;
            
            const computed = getComputedStyle(document.documentElement);
            const fontSize = computed.getPropertyValue('--nav-node-font-size').trim() || '16px';
            const padding = computed.getPropertyValue('--nav-node-padding').trim() || '0.6em 1.5em';
            
            setStyles({ fontSize, padding });
        };

        updateStyles();
        window.addEventListener('resize', updateStyles);
        return () => window.removeEventListener('resize', updateStyles);
    }, []);

    const buttonBaseStyle: React.CSSProperties = {
        color: color,
        backgroundColor: 'transparent',
        padding: styles.padding,
        fontSize: styles.fontSize,
        borderRadius: '12px',
        border: 'none',
        borderTop: `1px solid ${color}`,
        borderBottom: `1px solid ${color}`,
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        outline: 'none',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        whiteSpace: 'nowrap',
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.transform = 'translateY(-2px)';
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = color;
        e.currentTarget.style.transform = 'translateY(0)';
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(0.98)';
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
    };

    // Calculate starting position (70% toward center for spring effect)
    const startX = position.x * 0.3;
    const startY = position.y * 0.3;

    return (
        <div
            onClick={onClick}
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: isVisible 
                    ? `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(1)`
                    : `translate(calc(-50% + ${startX}px), calc(-50% + ${startY}px)) scale(0.3)`,
                opacity: isVisible ? 1 : 0,
                transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
                cursor: 'pointer',
                zIndex: 20,
            }}
        >
            <button
                style={buttonBaseStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                {label}
            </button>
        </div>
    );
}