import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const MaskContainer = ({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const containerRef = useRef(null);

  const updateMousePosition = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("mousemove", updateMousePosition);
    }
    return () => {
      if (el) {
        el.removeEventListener("mousemove", updateMousePosition);
      }
    };
  }, []);

  let maskSize = isHovered ? revealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative min-h-screen w-full overflow-hidden", className)}
      animate={{
        backgroundColor: isHovered ? "#0f172a" : "#000000",
      }}
      transition={{
        backgroundColor: { duration: 0.3 },
      }}
    >
      <motion.div
        className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-white [mask-image:url(/mask.svg)] [mask-repeat:no-repeat] [mask-size:40px] pointer-events-none"
        animate={{
          maskPosition: `${mousePosition.x - maskSize / 2}px ${
            mousePosition.y - maskSize / 2
          }px`,
          maskSize: `${maskSize}px`,
        }}
        transition={{
          maskSize: { duration: 0.3, ease: "easeInOut" },
          maskPosition: { duration: 0.15, ease: "linear" },
        }}
      >
        <div className="absolute inset-0 z-0 h-full w-full bg-white opacity-90 pointer-events-auto" />
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative z-20 mx-auto w-full max-w-4xl text-center pointer-events-auto flex items-center justify-center min-h-screen"
        >
          {children}
        </div>
      </motion.div>

      <div className="flex min-h-screen h-full w-full items-center justify-center relative z-10">
        {revealText}
      </div>
    </motion.div>
  );
};
