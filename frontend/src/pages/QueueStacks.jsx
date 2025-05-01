import React from 'react';
import { Link } from 'react-router-dom';

const QueueStacks = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-black bg-opacity-50 rounded-lg shadow-lg p-8 text-center max-w-lg mx-auto">
        {/* Title and Teaser */}
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">QueueStacks - Coming Soon!</h1>
        <p className="text-lg mb-6">We're working hard to bring you the next exciting game! Stay tuned for updates. Try out Alter Stack!</p>

        {/* Description of the upcoming game */}
        <p className="text-sm mb-6">
          QueueStacks will challenge your problem-solving skills as you manage a queue of elements in a fun and interactive way.
          It will be a great addition to your DSA game collection! 🚀
        </p>

        {/* Link back to homepage */}
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default QueueStacks;
