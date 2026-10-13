import { motion } from "framer-motion";
import { pageTransition } from "../utils/animations";

/**
 * The single loading state used by every page, so spinners look and behave
 * the same everywhere.
 */
function PageLoader({ message = "Loading...", inline = false }) {
  const Wrapper = inline ? "div" : "main";
  const wrapperClass = inline
    ? "flex items-center justify-center py-20"
    : "site-light-page flex min-h-screen items-center justify-center px-6 pt-28";

  return (
    <Wrapper className={wrapperClass}>
      <motion.div {...pageTransition} className="text-center">
        <div
          className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-500"
          role="status"
          aria-label={message}
        />
        <p className="font-semibold text-slate-700">{message}</p>
      </motion.div>
    </Wrapper>
  );
}

export default PageLoader;
