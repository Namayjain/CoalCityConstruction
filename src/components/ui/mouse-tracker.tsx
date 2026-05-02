"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MouseTracker() {
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // High stiffness for a fast "laser" snap
  const springConfig = { damping: 20, stiffness: 600, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Offset by half of width/height (4px)
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    setIsVisible(true);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!isDesktop) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
      style={{
        backgroundColor: "#a855f7",
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
        boxShadow: "0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 30px #a855f7",
      }}
    />
  );
}
