/**
 * Confetti Component
 *
 * Professional, minimal confetti effect for success celebrations
 */

import { useEffect, useState } from 'react';

export default function Confetti({ trigger = false, duration = 2000 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    // Generate 8-12 particles with random properties
    const particleCount = Math.floor(Math.random() * 5) + 8;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Math.random(),
      color: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4'][Math.floor(Math.random() * 5)],
      left: Math.random() * 100,
      delay: Math.random() * 200,
      duration: 1500 + Math.random() * 500,
      size: Math.random() * 6 + 4,
      rotation: Math.random() * 360,
    }));

    setParticles(newParticles);

    // Clear particles after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-0 animate-confetti"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.duration}ms`,
          }}
        >
          <div
            className="rounded-sm"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti ease-out forwards;
        }
      `}</style>
    </div>
  );
}
