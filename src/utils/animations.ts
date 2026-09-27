import { Variants } from 'framer-motion';

// Page Transition Variants: Fast, smooth, premium
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.995
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1], // Custom smooth ease-out curve
      when: 'beforeChildren'
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: 'easeIn'
    }
  }
};

// Stagger Container for sequential component entrances
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
};

// Stagger Item variant
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 12
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Card Tap & Hover Interactions
export const cardInteractiveVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' }
  },
  hover: {
    y: -2,
    transition: { duration: 0.15 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.08 }
  }
};

// Micro-interaction for buttons
export const buttonTapVariants = {
  tap: { scale: 0.97 },
  hover: { scale: 1.01 }
};

// Bottom Sheet Variants with Spring Physics
export const bottomSheetVariants: Variants = {
  initial: {
    y: '100%',
    opacity: 0.5
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 350,
      mass: 0.8
    }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0]
    }
  }
};

// Modal Variants
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 12
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 26,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: 0.16
    }
  }
};

// Backdrop fade variants
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};
