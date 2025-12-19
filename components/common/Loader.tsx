import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className="mr-2 inline-block"
    >
      ⏳
    </motion.span>
  );
};

export default Loader;
