import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="font-mono pt-6 fixed top-0 w-full z-50 p-0">
      <nav className="font-mono nav rounded">
        <div className="text-white">
          <div className="px-0.5 pt-0.5 lg:px-8">
            <nav className="flex items-center mb-6">
            
              <div className="hidden  lg:flex lg:gap-x-12 font-bold">
                <Link to="/" className="text-base text-brown font-bold hover:bg-cyan-950 hover:text-white">
                  Home
                </Link>
                <Link to="/About" className="text-base text-brown font-bold hover:bg-cyan-950 hover:text-white">
                  About
                </Link>
                <Link to="/Contact" className="text-base text-brown font-bold hover:bg-cyan-950 hover:text-white">
                  Contact
                </Link>
              </div>
              
              <div className="flex lg:flex lg:flex-1 lg:justify-end font-bold mr-10 ">
              <p className="text-2xl">Autohub Manager</p>
              </div>
              <div className="flex lg:flex lg:flex-1 lg:justify-end font-bold mr-10">
                
                <Link to="/started" className="w-32 rounded-md text-white font-medium text-sm px-6 py-2.5 text-center bg-blue-900 hover:bg-cyan-900 hover:text-white ml-2">
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </nav>
    </div>
  );
}
