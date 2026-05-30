import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import AuthStatus from '../components/AuthStatus';
import LeaderboardPanel from '../components/LeaderboardPanel';
import { getGames } from '../lib/api';


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

const BSTreePreview = ({ root = 10, left = 5, right = 15, leftLeft = 3, leftRight = 7, rightLeft = 12, rightRight = 18 }) => {
  return (
    <div className="bg-white border-2 border-blue-400 rounded-xl shadow-lg p-4 w-full max-w-sm mx-auto">
      <div className="relative h-40 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Level 0: Root Node */}
          <div className="bg-blue-400 text-black font-bold py-1 px-3 mx-1 rounded shadow text-center min-w-[40px]">
            {root}
          </div>
          
          {/* Level 1: Left and Right Nodes */}
          <div className="flex space-x-0">
            {/* Left Node */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-blue-400 text-black font-bold py-1 px-3 mx-1 rounded shadow text-center min-w-[40px]">
                {left}
              </div>
              {/* Level 2: Left-Left and Left-Right Nodes */}
              <div className="flex space-x-0">
                <div className="bg-blue-400 text-black font-bold py-1 px-3 mx-1 rounded shadow text-center min-w-[40px]">
                  {leftLeft}
                </div>
                <div className="bg-blue-400 text-black font-bold py-1 px-3 mx-1 rounded shadow text-center min-w-[40px]">
                  {leftRight}
                </div>
              </div>
            </div>
            
            {/* Right Node */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-blue-400 text-black font-bold py-1 px-3 mx-1 rounded shadow text-center min-w-[40px]">
                {right}
              </div>
              {/* Level 2: Right-Left and Right-Right Nodes */}
              <div className="flex space-x-0">
                <div className="bg-blue-400 text-black font-bold py-1 px-3 mx-1 rounded shadow text-center min-w-[40px]">
                  {rightLeft}
                </div>
                <div className="bg-blue-400 text-black font-bold py-1 px-3 mx-1 rounded shadow text-center min-w-[40px]">
                  {rightRight}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const previewBySlug = {
  'alter-stack': StackPreview,
  bstree: BSTreePreview,
  'queue-stacks': QueuePreview,
};

const routeBySlug = {
  'alter-stack': '/alter-stack',
  bstree: '/bstree',
  'queue-stacks': '/queue-stacks',
};

const fallbackGames = [
    {
      id: 1,
      slug: 'alter-stack',
      name: 'Alter Stack',
      isMultiplayer: false,
      status: 'live',
      description: 'Push and pop elements to match a target sum.',
    },
    {
      id: 2,
      slug: 'bstree',
      name: 'BSTree',
      isMultiplayer: false,
      status: 'beta',
      description: 'Place the given elements perfectly in the Binary Search Tree',
    },
    {
      id: 3,
      slug: 'queue-stacks',
      name: 'Queue Stacks',
      isMultiplayer: true,
      status: 'coming-soon',
      description: 'Queue + Stack based multiplayer game, Coming soon!',
    }

  ];

const Homepage = () => {
  const [games, setGames] = useState(fallbackGames);
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await getGames();
        setGames(data.games);
      } catch {
        toast.error("Using local game list. Backend games could not load.");
      } finally {
        setLoadingGames(false);
      }
    };

    loadGames();
  }, []);

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

  {/* Right section: Account and Feedback */}
  <div className="mt-3 flex flex-wrap justify-center gap-3 md:mt-0 md:justify-end">
    <AuthStatus />
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

      {loadingGames && (
        <p className="px-4 text-sm text-gray-400 sm:px-10">Loading games...</p>
      )}




      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:ml-10 sm:mr-10">
        {games.map((game) => {
          const Preview = previewBySlug[game.slug] || StackPreview;
          const route = routeBySlug[game.slug] || `/${game.slug}`;
          const isComingSoon = game.status === 'coming-soon';

          return (
          <div
            key={game._id || game.id || game.slug}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg text-center p-4"
          >
            <div className="mb-4">
                <Preview />
            </div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">{game.name}</h2>
            <p className="text-sm text-gray-400 mb-2">Multiplayer: {game.isMultiplayer ? 'Dual' : 'Single'}</p>
            <p className="mb-2 text-xs uppercase tracking-wide text-cyan-300">{game.status}</p>
            <p className="text-sm text-gray-300 mb-4">{game.description}</p>
            <Link
              to={route}
              className={`block text-white py-2 px-4 rounded-lg shadow-md ${
                isComingSoon ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {isComingSoon ? 'Preview' : 'Play'} {game.name}
            </Link>
          </div>
        )})}
      </div>

      <LeaderboardPanel gameSlug="alter-stack" difficulty="easy" />

      <Footer />
    </motion.div>
  );
};

export default Homepage;
