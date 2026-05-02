import { motion } from 'framer-motion';
import { Play, Home } from 'lucide-react';

interface PauseScreenProps {
  onResume: () => void;
  onQuit: () => void;
}

export function PauseScreen({ onResume, onQuit }: PauseScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-card-strong w-full max-w-sm p-8 space-y-6 text-center"
      >
        <h2 className="text-3xl font-bold gradient-text">Paused</h2>
        <p className="text-white/60">Take a breath and come back!</p>

        <div className="space-y-3">
          <button onClick={onResume} className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg">
            <Play className="w-5 h-5" /> Resume
          </button>
          <button onClick={onQuit} className="w-full btn-secondary flex items-center justify-center gap-2 py-3">
            <Home className="w-4 h-4" /> Quit to Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
