import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
            <nav className="w-full bg-gray-800 p-4 z-20">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-xl font-bold">Twitch.tv</div>
                    <div className="flex space-x-4">
                        <Link to="login">
                            <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
                                Log In
                            </button>
                        </Link>
                        <Link to="signup">
                            <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex-grow flex flex-col items-center justify-center">
                <motion.h1
                    className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8 z-10"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Welcome to Twitch.tv!
                </motion.h1>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="z-10 flex items-center space-x-2 bg-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300"
                >
                    <Link to="login">
                        <span>Start Watching</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
