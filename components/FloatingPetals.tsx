import React from 'react';
import { motion } from 'framer-motion';

const Petal: React.FC<{ delay: number, x: number, duration: number }> = ({ delay, x, duration }) => (
  <motion.div
    initial={{ y: -50, opacity: 0, x: 0, rotate: 0 }}
    animate={{ 
      y: '105vh', 
      opacity: [0, 0.6, 0.6, 0], 
      rotate: [0, 90, 180, 270],
      x: [0, 30, 0, -30, 0] // Spiral motion relative to starting X
    }}
    transition={{ 
      duration: duration, 
      repeat: Infinity, 
      delay: delay,
      ease: "linear",
      x: {
        duration: duration * 0.8, // Slightly different duration for X to create non-uniform spirals
        repeat: Infinity,
        ease: "easeInOut"
      }
    }}
    className="absolute top-0 w-3 h-3 md:w-4 md:h-4 bg-red-100/40 rounded-tr-[50%] rounded-bl-[50%] blur-[1px]"
    style={{ 
      left: `${x}%`,
    }}
  />
);

export const FloatingPetals: React.FC = () => {
  const petals = React.useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 20,
    x: Math.random() * 100,
    duration: 15 + Math.random() * 10 // Slower duration for gentle drift
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <Petal key={p.id} delay={p.delay} x={p.x} duration={p.duration} />
      ))}
    </div>
  );
};