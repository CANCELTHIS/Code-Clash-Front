import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Time from "./Time.json";
const MatchStartAnimation = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-32 h-32 mb-4"
        >
          {/* Use the imported Time.json for the Lottie animation */}
          <Lottie
            animationData={Time}
            loop
            autoPlay
            style={{ width: 300, height: 300 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MatchStartAnimation;
