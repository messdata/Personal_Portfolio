import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import './BentoGrid.css';

const DEFAULT_GLOW_COLOR = '132, 0, 255';
const DEFAULT_SPOTLIGHT_RADIUS = 300;

export interface BentoCard {
  id: string;
  size?: 'small' | 'large'; // small = 1x1, large = 2x2
  content: ReactNode;
  href?: string;
  onClick?: () => void;
}

interface BentoGridProps {
  cards: BentoCard[];
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  glowColor?: string;
  spotlightRadius?: number;
}

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const BentoGrid: React.FC<BentoGridProps> = ({
  cards = [],
  enableSpotlight = true,
  enableBorderGlow = true,
  glowColor = DEFAULT_GLOW_COLOR,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
}) => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Safety check for cards
  if (!cards || cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
        No cards to display
      </div>
    );
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!enableSpotlight || isMobile || !spotlightRef.current) return;

    const spotlight = spotlightRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [enableSpotlight, isMobile]);

  return (
    <div className="bento-section">
      {enableSpotlight && !isMobile && (
        <div
          ref={spotlightRef}
          className="bento-spotlight"
          style={{
            position: 'fixed',
            width: `${spotlightRadius * 2}px`,
            height: `${spotlightRadius * 2}px`,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.15) 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
            zIndex: 200,
          }}
        />
      )}

      <div className="bento-grid">
        {cards.map((card) => {
          const CardWrapper = card.href ? 'a' : 'div';
          const cardClass = `bento-card ${card.size === 'large' ? 'bento-card--large' : ''
            } ${enableBorderGlow ? 'bento-card--border-glow' : ''}`;

          return (
            <CardWrapper
              key={card.id}
              href={card.href}
              onClick={card.onClick}
              className={cardClass}
              ref={(el: HTMLElement | null) => {
                if (!el || isMobile) return;

                const handleMouseMove = (e: MouseEvent) => {
                  if (enableBorderGlow) {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX;
                    const y = e.clientY;
                    const distance = Math.hypot(
                      x - (rect.left + rect.width / 2),
                      y - (rect.top + rect.height / 2)
                    );
                    const glow = Math.max(0, 1 - distance / spotlightRadius);
                    updateCardGlowProperties(el, x, y, glow, spotlightRadius);
                  }
                };

                const handleMouseLeave = () => {
                  if (enableBorderGlow) {
                    updateCardGlowProperties(el, 0, 0, 0, spotlightRadius);
                  }
                };

                el.addEventListener('mousemove', handleMouseMove);
                el.addEventListener('mouseleave', handleMouseLeave);

                return () => {
                  el.removeEventListener('mousemove', handleMouseMove);
                  el.removeEventListener('mouseleave', handleMouseLeave);
                };
              }}
            >
              {card.content}
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default BentoGrid;