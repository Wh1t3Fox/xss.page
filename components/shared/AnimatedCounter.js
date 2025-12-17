/**
 * Animated Counter Component
 *
 * Smoothly animates number changes with easing
 */

import { useEffect, useState, useRef } from 'react';

export default function AnimatedCounter({
  value,
  duration = 800,
  className = '',
  prefix = '',
  suffix = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    const startTime = Date.now();

    if (startValue === endValue) return;

    setIsAnimating(true);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic function for smooth deceleration
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        prevValueRef.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={`${className} ${isAnimating ? 'text-primary-600 font-bold' : ''}`}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
