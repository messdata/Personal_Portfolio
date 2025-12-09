import React, { useState, useEffect } from 'react';
import NavigationNode from './Navigationnode';

interface NavigationNodesProps {
    isVisible?: boolean;
}

export default function NavigationNodes({ isVisible: initialVisible = false }: NavigationNodesProps) {
    const [showNodes, setShowNodes] = useState(initialVisible);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleShowNodes = (e: CustomEvent) => {
            const shouldShow = e.detail;
            if (shouldShow) {
                setTimeout(() => setShowNodes(true), 100);
            } else {
                setShowNodes(false);
            }
        };

        window.addEventListener('showNodes', handleShowNodes as EventListener);

        return () => {
            window.removeEventListener('showNodes', handleShowNodes as EventListener);
        };
    }, []);

    // Read radius from CSS variable, with fallback
    const getRadius = () => {
        if (typeof window === 'undefined') return 280;
        
        const cssRadius = getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-node-radius')
            .trim();
        
        if (cssRadius) {
            const parsed = parseInt(cssRadius, 10);
            if (!isNaN(parsed)) return parsed;
        }
        
        // Fallback: calculate based on screen size
        const minDimension = Math.min(window.innerWidth, window.innerHeight);
        if (minDimension <= 480) return 140;
        if (minDimension <= 768) return 200;
        return 280;
    };

    const [radius, setRadius] = useState(280);

    useEffect(() => {
        if (mounted) {
            setRadius(getRadius());
            
            const handleResize = () => setRadius(getRadius());
            window.addEventListener('resize', handleResize);
            
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [mounted]);

    const nodes = [
        {
            id: 'about',
            label: 'About',
            color: '#1a8fb6ff',
            angle: 0,
            delay: 0,
        },
        {
            id: 'cv',
            label: 'Resume',
            color: '#ff00ff',
            angle: 90,
            delay: 0.15,
        },
        {
            id: 'project',
            label: 'Projects',
            color: '#888e8eff',
            angle: 270,
            delay: 0.45,
        },
        {
            id: 'contact',
            label: 'Contact',
            color: '#15e6aeff',
            angle: 180,
            delay: 0.3,
        },
    ];

    const getPosition = (angle: number) => {
        const radians = (angle - 90) * (Math.PI / 180);
        return {
            x: Math.cos(radians) * radius,
            y: Math.sin(radians) * radius,
        };
    };

    const handleNodeClick = (nodeId: string) => {
        window.dispatchEvent(
            new CustomEvent('nodeClicked', { detail: nodeId })
        );
    };

    if (!mounted) return null;

    return (
        <>
            {nodes.map((node) => (
                <NavigationNode
                    key={node.id}
                    label={node.label}
                    color={node.color}
                    position={getPosition(node.angle)}
                    delay={node.delay}
                    isVisible={showNodes}
                    onClick={() => handleNodeClick(node.id)}
                />
            ))}
        </>
    );
}