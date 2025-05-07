import { useState } from 'react';
import { Link } from 'react-router-dom';
import RulesModal from './RulesModal';

const Header = ({appName, rules}) => {
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
              {appName}
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
      {showModal && <RulesModal onClose={() => setShowModal(false)} rules={rules} />}
    </>
  );
};

export default Header;
