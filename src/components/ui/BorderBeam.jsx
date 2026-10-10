import { motion, useReducedMotion } from "framer-motion";

// Magic UI's BorderBeam: a light travelling around the card's border. Nothing is drawn when motion
// is reduced; the card's own border still marks it.
const BorderBeam = ({ size = 90, duration = 7 }) => {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <motion.div
        animate={{ offsetDistance: ["0%", "100%"] }}
        className="absolute aspect-square bg-gradient-to-l from-[var(--glow-2)] via-[var(--glow-1)] to-transparent"
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${size}px)` }}
        transition={{ repeat: Infinity, ease: "linear", duration }}
      />
    </div>
  );
};

export default BorderBeam;
