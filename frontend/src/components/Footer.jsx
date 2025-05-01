import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-gray-950 to-gray-900 text-white py-4 sm:py-6 mt-8">
      <div className="container mx-auto text-center space-y-4">
      <p className="text-sm sm:text-base">Created by <span className="font-semibold text-white">Charan G</span></p>
        <p className="text-sm sm:text-base">Version 1.0.0 </p>
        <p className="text-sm sm:text-base">
          Contact us: <a href="mailto:charangcg4@gmail.com" className="text-blue-400 hover:underline">charangcg4@gmail.com</a>
        </p>
        <p className="text-lg sm:text-xl font-semibold">
          DSA Playing with your emotions? It's time to in turn play DSA now!
        </p>
        <p className="text-xs sm:text-sm text-gray-400">
          &copy; 2025 DSA Games. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
