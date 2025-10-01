// src/components/FadeInOnScroll.js
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FadeInOnScroll({
  children,
  delay = 0.3,
  duration = 0.8,
  direction = "up",
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target); // ✅ Stop observing after first trigger
        }
      },
      { threshold: 0.2 }
    );

    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  const getInitialTranslate = () => {
    switch (direction) {
      case "left":
        return { x: -50 };
      case "right":
        return { x: 50 };
      case "down":
        return { y: -50 };
      case "up":
      default:
        return { y: 50 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialTranslate() }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay }}
      style={{
        willChange: "opacity, transform",
        minHeight: 1,
      }}
    >
      {children}
    </motion.div>
  );
}
