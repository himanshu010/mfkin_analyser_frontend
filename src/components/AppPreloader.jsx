import { motion } from "framer-motion";
import { LogoMark } from "./Logo.jsx";
import ProgressBar from "./ui/ProgressBar.jsx";

// Full-screen state while the sector catalog loads (or when it fails): `actions` holds Retry.
const AppPreloader = ({ message = "Loading...", actions = null }) => (
  <main className="grid min-h-dvh place-items-center bg-bg p-4">
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="card w-full max-w-md p-6"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <LogoMark className="size-11" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            MFkin <span className="text-primary">Analyser</span>
          </h1>
          <p className="text-sm text-fg-muted">Sector intelligence</p>
        </div>
      </div>
      <p className="mt-6 mb-3 text-sm text-fg-muted" role="status">
        {message}
      </p>
      <ProgressBar label="Loading the sector catalog" />
      {actions ? <div className="mt-4 flex justify-center">{actions}</div> : null}
      <div aria-hidden className="mt-6 space-y-2.5">
        {[80, 60, 90, 45].map((width) => (
          <div
            className="relative h-2.5 overflow-hidden rounded-full bg-surface-2"
            key={width}
            style={{ width: `${width}%` }}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-line-strong/60 to-transparent [animation:shimmer_1.6s_infinite]" />
          </div>
        ))}
      </div>
    </motion.div>
  </main>
);

export default AppPreloader;
