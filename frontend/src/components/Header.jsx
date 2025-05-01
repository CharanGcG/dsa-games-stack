import { useState } from 'react';
import { Link } from 'react-router-dom';

const RulesModal = ({ onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
    onClick={(e) => {
      // Close the modal if the user clicks outside the modal content
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div
      className="bg-gradient-to-tl from-gray-800 to-gray-900 text-white rounded-lg shadow-lg p-8 w-11/12 max-w-lg relative transition-transform transform scale-95 sm:scale-100 duration-300"
      style={{ transition: 'transform 0.3s ease-in-out' }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">Game Rules</h2>
      <ul className="list-none list-inside text-sm sm:text-base space-y-4 mt-4 mb-6">
  <li className="flex items-start gap-2">
    <span className="text-yellow-400">🔹</span> 
    <span>Starting the Game: Select difficulty, Click on the Start button, Timer starts</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-yellow-400">🔹</span> 
    <span><strong>Goal:</strong> Build a stack of numbers that adds up exactly to the <strong>target sum</strong> before the time runs out.</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-yellow-400">🔹</span> 
    <span><strong>What is a stack?</strong> Think of it like a vertical pile — you can only add or remove from the top.</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-yellow-400">🔹</span> 
    <span><strong>Push:</strong> Add a number to the top of the stack. <strong>Pop:</strong> Remove the top number.</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-yellow-400">🔹</span> 
    <span>When pushing, numbers will alternate in sign: <strong>+ - + -</strong>, starting with a <strong>positive</strong>.</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-yellow-400">🔹</span> 
    <span>You must have at least <strong>5 numbers</strong> in your stack to submit it.</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-yellow-400">🔹</span> 
    <span><strong>Tip:</strong> Use fewer pushes and pops for a better score!</span>
  </li>
  
</ul>

      
      <button
        type="button"
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full font-semibold w-3/4 mt-4 mx-auto block"
        onClick={onClose}
        aria-label="Close rules modal"
      >
        Close
      </button>
    </div>
  </div>
);

const Header = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="w-full bg-gray-900 text-white py-2 sm:py-4 shadow-md relative z-10">
        <div className="flex items-center justify-between px-4 sm:px-6">
          {/* Left section with logo and title */}
          <div className="flex items-center gap-x-2 sm:gap-x-4">
            <img 
              src="/Ds.png" 
              alt="Alter Stack game logo" 
              className="hidden sm:block sm:w-auto sm:h-10" 
            />
            <h1 className="text-lg sm:text-2xl md:text-4xl font-bold tracking-wide">
              Alter Stack
            </h1>
          </div>

          {/* Right section with buttons */}
          <div className="flex items-center gap-x-4">
            <Link
              to="/"
              className="p-1 block border sm:border-none sm:bg-violet-800 sm:hover:bg-violet-950 text-white py-1 px-2 sm:py-3 sm:px-6 rounded-lg shadow-md text-center"
            >
              Home
            </Link>
            <button
              type="button"
              className="border sm:border-none sm:bg-violet-800 sm:hover:bg-violet-950 cursor-pointer text-white py-1 px-2 sm:py-3 sm:px-6 rounded-lg transition text-center"
              onClick={() => setShowModal(true)}
              aria-label="Open rules modal"
            >
              Rules
            </button>
          </div>

        </div>
      </header>

      {/* Modal */}
      {showModal && <RulesModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Header;
