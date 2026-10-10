import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

// Magic UI's NumberTicker: counts up to `value` when it scrolls into view and eases to each new
// value after that. The final value is in the markup from the start, so nothing reads as zero
// before the animation runs (or when motion is reduced).
const NumberTicker = ({ value, format, className }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 40, stiffness: 180 });

  useEffect(() => {
    if (inView && !reduce) motionValue.set(value);
  }, [inView, reduce, value, motionValue]);

  useEffect(
    () =>
      spring.on("change", (latest) => {
        if (ref.current) ref.current.textContent = format(latest);
      }),
    [spring, format]
  );

  return (
    <span className={className} ref={ref}>
      {format(value)}
    </span>
  );
};

export default NumberTicker;
