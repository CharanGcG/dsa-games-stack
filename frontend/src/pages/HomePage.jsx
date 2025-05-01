import React from 'react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const StackPreview = ({ stackItems = [6, -5, 3, -2] }) => {
  return (
    <div className="bg-white border-2 border-yellow-400 rounded-xl shadow-lg p-4 w-full max-w-sm mx-auto">
      <div className="relative h-40 flex items-end justify-center">
        <div className="flex flex-col items-center w-full border-l-4 border-r-4 border-yellow-400 rounded-lg bg-gray-800 p-2">
          {stackItems.map((item, index) => (
            <div
              key={index}
              className="w-3/4 bg-yellow-400 text-black font-bold py-1 px-2 mb-1 rounded shadow text-center"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QueuePreview = ({ queueItems = [10, -5, -3, 15] }) => {
  return (
    <div className="bg-white border-2 border-blue-400 rounded-xl shadow-lg p-4 w-full max-w-sm mx-auto">
      <div className="relative h-40 flex items-center justify-center">
        <div className="flex items-center w-full overflow-x-hidden border-t-4 border-b-4 border-blue-400 rounded-lg bg-gray-800 p-2">
          {queueItems.map((item, index) => (
            <div
              key={index}
              className="bg-blue-400 text-black font-bold py-1 px-3 mx-1 rounded shadow text-center min-w-[40px]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};


const Homepage = () => {
  const games = [
    {
      id: 1,
      name: 'Alter Stack',
      comp: StackPreview,
      multiplayer: 'Single',
      description: 'Push and pop elements to match a target sum.',
    },
    {
      id: 2,
      name: 'Queue Stacks',
      comp: QueuePreview,
      multiplayer: 'Dual',
      description: 'Queue + Stack based multiplayer game, Coming soon!',
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br audiowide-regular from-gray-950 to-gray-900 text-white p-4 space-y-6"
    >
<div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-2">
  {/* Left section: Logo, Title, Version */}
  <div className="flex items-center gap-x-2 md:gap-x-4">
    <img src="/Ds.png" alt="LOGO" className="block w-auto h-10 md:h-15" />
    <h1 className="text-3xl md:text-6xl font-bold tracking-wide">DSA GAMES</h1>
    <span className="hidden md:block text-gray-500 text-sm">v1.0.0</span>
  </div>

  {/* Right section: Feedback button */}
  <div className="mt-3 md:mt-0 flex justify-center md:justify-end">
    <a
      href="https://forms.gle/6Zm2zZ88rmyYk2UJ9"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm md:text-base font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200"
    >
      Give Feedback
    </a>
  </div>
</div>




      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:ml-10 sm:mr-10">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg text-center p-4"
          >
            <div className="mb-4">
                <game.comp />
            </div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">{game.name}</h2>
            <p className="text-sm text-gray-400 mb-2">Multiplayer: {game.multiplayer}</p>
            <p className="text-sm text-gray-300 mb-4">{game.description}</p>
            <Link
              to={`/${game.name.toLowerCase().replace(/ /g, '-')}`}
              className="block bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md"
            >
              Play {game.name}
            </Link>
          </div>
        ))}
      </div>

      <Footer />
    </motion.div>
  );
};

export default Homepage;
