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

// Fade In variant
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.24, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.18 } }
};

// Slide Up variant
export const slideUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.18 } }
};

// Slide Down variant
export const slideDown: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.26, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.16 } }
};

// Scale In variant
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
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

// BARCODE & POS SPECIFIC ANIMATIONS:
// Scanner Success: Pop & scale feedback when barcode is detected
export const scannerSuccess: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.15, 1],
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

// Scanner Error / Unknown Barcode: subtle horizontal shake
export const scannerError: Variants = {
  initial: { x: 0 },
  animate: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.42, ease: 'easeInOut' }
  }
};

// Cart Item Added / Quantity Bump
export const cartAdd: Variants = {
  initial: { scale: 0.95, opacity: 0, y: -4 },
  animate: {
    scale: [0.95, 1.04, 1],
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut' }
  }
};

// Payment Confirmation Success Checkmark
export const paymentSuccess: Variants = {
  initial: { scale: 0, rotate: -25, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 22
    }
  }
};

// Stock Update Pulse
export const stockUpdate: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.12, 1],
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};
