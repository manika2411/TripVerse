const smoothEase = [0.22, 1, 0.36, 1];

export const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: smoothEase },
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: smoothEase },
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: smoothEase },
};

export const staggerContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

export const cardHover = {
  whileHover: { y: -4 },
  transition: { duration: 0.25, ease: smoothEase },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.97 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: smoothEase },
};

export const smoothHover = {
  transition: { duration: 0.3, ease: smoothEase },
};

/* ------------------------------------------------------------------------ *
 * Shared motion system for every page except Home.
 *
 *   Page header / hero block ....... pageTransition
 *   Cards, panels, sections ........ fadeUp        (plays once, on scroll-in)
 *   Grids & lists .................. listItem(i)   (short, capped stagger)
 *   Card hover ..................... cardHover
 *   Buttons ........................ buttonPress
 *   Alerts / toasts ................ alertMotion   (use inside AnimatePresence)
 *   Progress bars .................. progressBar(percent, delay)
 *
 * Rules: one easing curve, one duration scale (0.25 / 0.5 / 0.55 / 0.8s),
 * vertical movement only (no sideways slides, no scale pop-ins, no rotation).
 * ------------------------------------------------------------------------ */

export const ease = smoothEase;

export const viewportOnce = { once: true, amount: 0.15 };

export const buttonPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2, ease: smoothEase },
};

export const alertMotion = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.25, ease: smoothEase },
};

// Staggered entrance for items in a grid/list. Delay is capped so long lists
// never feel slow.
export const listItem = (index = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    ease: smoothEase,
    delay: Math.min(index, 8) * 0.06,
  },
});

export const progressBar = (percent = 0, delay = 0) => ({
  initial: { width: 0 },
  animate: { width: `${percent}%` },
  transition: { duration: 0.8, ease: smoothEase, delay },
});

// Scroll-reveal for items in a grid/list: same as fadeUp, with a capped stagger.
export const revealItem = (index = 0) => ({
  ...fadeUp,
  transition: {
    ...fadeUp.transition,
    delay: Math.min(index, 8) * 0.06,
  },
});
