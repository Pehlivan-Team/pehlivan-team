import React from "react";
import { motion, useInView, useAnimation } from "framer-motion";
interface RevealProps {
  children: React.ReactNode;
  width: "fit-content" | "full";
  left?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({ children, width, left }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false });
  React.useEffect(() => {
    if (isInView) {
      controls.start({ x: 0, opacity: 1 });
    } else {
      controls.start({ x: left ? 100 : -100, opacity: 0 });
    }
  }, [isInView]);
  return (
    <motion.div
      ref={ref}
      initial={{ x: left ? 100 : -100, opacity: 0 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className={`w-${width} flex flex-col items-center`}
    >
      {children}
    </motion.div>
  );
};
