import React from "react";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import Navigation from '../pages/Navigation';
import Footers from "../pages/Footers";
import Sections from "./Sections";
import peakpx from '../pic/peakpx.jpg';

const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen font-serif">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
        <img src={peakpx} alt="Background" className="absolute top-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative">
          <Navigation />
          
          <div className="container mx-auto px-4 h-screen flex items-center">
            <motion.div 
              className="max-w-3xl"
              initial="initial"
              animate="animate"
              variants={fadeIn}
            >
              <Typography 
                variant="h1" 
                className="text-white text-5xl font-bold mb-6"
              >
                Transform Your Dealership
              </Typography>
              
              <Typography 
                className="text-gray-200 text-xl leading-relaxed mb-8"
              >
                Elevate your dealership's performance with AutoHub Manager, 
                the all-in-one solution for seamless inventory management, 
                customer relations, and accelerated sales growth.
              </Typography>

              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-lg
                          hover:bg-blue-700 transition-colors duration-300
                          flex items-center gap-2"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
                <ChevronDownIcon className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <Sections />
      </section>

      {/* Footer */}
      <footer>
        <Footers />
      </footer>
    </div>
  );
};

export default Home;