import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Scroll-triggered fade + slide-up for generated website sections.
 */
export default function MotionSection({ children, className = '', as = 'div', delay = 0 }) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={fadeUp.initial}
      whileInView={fadeUp.animate}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </MotionTag>
  );
}
