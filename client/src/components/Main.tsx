import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Logo } from "./Dashboard";

export default function Main() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            container.style.setProperty("--mouse-x", `${x}px`);
            container.style.setProperty("--mouse-y", `${y}px`);
        };

        container.addEventListener("mousemove", handleMouseMove);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div ref={containerRef} className="gradient-container min-h-screen flex flex-col overflow-hidden relative">
          <nav className="w-full bg-gray-800 p-2 sm:p-4 z-20">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
              <Logo />
              <div className="flex space-x-2 sm:space-x-4 mt-2 sm:mt-0">
                <Link to="login">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base">
                    Log In
                  </button>
                </Link>
                <Link to="signup">
                  <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </nav>
          <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 sm:mb-8 z-10"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to <span className="font-['Orbitron'] block sm:inline">twitch.tv</span>
            </motion.h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="z-10 flex items-center space-x-2 bg-purple-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300"
            >
              <Link to="login">
                <span className="text-sm sm:text-base">Start Watching</span>
              </Link>
            </motion.div>
          </div>
        </div>
      );
}
