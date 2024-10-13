import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";
import { ReactNode } from "react";

const DragOnLoad = ({
  children,
  className,
  motionDirection = "left",
}: {
  children: ReactNode;
  className: string;
  motionDirection?: "left" | "right" | "up" | "down";
}) => {
  const motionDirectionMap = {
    left: {
      initial: { opacity: 0, x: 200 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 200 },
    },
    right: {
      initial: { opacity: 0, x: -200 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -200 },
    },
    up: {
      initial: { opacity: 0, y: 200 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 200 },
    },
    down: {
      initial: { opacity: 0, y: -200 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -200 },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      initial={motionDirectionMap[motionDirection].initial}
      animate={motionDirectionMap[motionDirection].animate}
      exit={motionDirectionMap[motionDirection].exit}
    >
      {children}
    </motion.div>
  );
};

export default DragOnLoad;
