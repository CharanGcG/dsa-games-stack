// RulesModal.jsx
import React from 'react';

const RulesModal = ({ onClose, rules }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div
      className="bg-gradient-to-tl from-gray-800 to-gray-900 text-white rounded-lg shadow-lg p-8 w-11/12 max-w-lg relative transition-transform transform scale-95 sm:scale-100 duration-300"
      style={{ transition: 'transform 0.3s ease-in-out' }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">Game Rules</h2>
      <ul className="list-none list-inside text-sm sm:text-base space-y-4 mt-4 mb-6">
        {
          rules.map((rule,index) => (
            <li key={index} className='flex items-start gap-2'>
              <span className="text-yellow-400">🔹</span>
              <span>{rule}</span>
            </li>
          ))
        }
      </ul>
      
      <button
        type="button"
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full font-semibold w-3/4 mt-4 mx-auto block"
        onClick={onClose}
        aria-label="Close rules modal"
      >
        Lets Play!
      </button>
    </div>
  </div>
);

export default RulesModal;
