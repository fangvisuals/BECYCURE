import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full"
      />
    </div>
  );
}
