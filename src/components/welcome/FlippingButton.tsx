import React, { useState } from 'react';

interface FlippingButtonProps {
    onClick?: () => void;
    className?: string;
}

export default function FlippingButton({ onClick, className = '' }: FlippingButtonProps) {
    // Use state to track the flip state (true for 'Explore', false for 'Welcome').
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent default anchor behavior if the click happens to be on an <a> element inside (safeguard)
        if (e.target instanceof HTMLAnchorElement) {
            e.preventDefault();
        }

        // 💡 CHANGE: Toggle the state on every click, allowing it to flip back and forth.
        setIsClicked(prev => !prev);

        // Run the user-provided onClick function
        if (onClick) onClick();
    };

    // Conditionally apply the 'clicked' class based on the state.
    const buttonClassName = `card ${className} ${isClicked ? 'clicked' : ''}`;

    return (
        <div
            className={buttonClassName}
            onClick={handleClick}
            aria-label={isClicked ? "Explore button" : "Welcome button"}
        >
            <div className="content">
                {/* Front Face: Displays "Welcome" */}
                <div className="front face-text">
                    <span className="title">Welcome</span>
                </div>

                {/* Back Face: Displays "Explore" */}
                <div className="back face-text">
                    <span className="title">Explore</span>
                </div>
            </div>
        </div>
    );
}