'use client';

import { useEffect, useRef } from 'react';

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed z-[1]"
      style={{
        width: 520,
        height: 520,
        left: 0,
        top: 0,
        marginLeft: -260,
        marginTop: -260,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.10) 0%, rgba(255,107,107,0) 65%)',
        transition: 'opacity 0.4s',
        animation: 'glowpulse 4s ease-in-out infinite',
      }}
    />
  );
}
