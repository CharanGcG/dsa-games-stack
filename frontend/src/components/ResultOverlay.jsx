import { motion, AnimatePresence } from 'framer-motion';

const ResultOverlay = ({
  show,
  win,
  timeTaken,
  pushes,
  pops,
  target,
  currentSum,
  difficulty,
  score,
  onRestart,
  onHome,
}) => {
  const buttonClass = "px-4 py-2 rounded-lg font-bold shadow-md transition";
  const winButtonClass = "bg-green-600 hover:bg-green-500";
  const loseButtonClass = "bg-blue-600 hover:bg-blue-500";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
          >
            <h2 className="text-3xl font-bold">
              {win ? 'Congratulations! You Win!' : 'Popped Out! Try Again?'}
            </h2>

            <div className="text-left text-sm sm:text-base space-y-1 bg-gray-800 p-4 rounded-lg">
              <h1 className='text-3xl text-center mb-5'>
                <span className="font-semibold">Score: </span> {win ? score : '0'}
              </h1>
              <p><span className="font-semibold">🎯 Target:</span> {target}</p>
              <p><span className="font-semibold">➕ Current Sum:</span> {currentSum}</p>
              <p><span className="font-semibold">📦 Pushes:</span> {pushes}</p>
              <p><span className="font-semibold">📤 Pops:</span> {pops}</p>
              <p><span className="font-semibold">📈 Difficulty:</span> {difficulty}</p>
              <p><span className="font-semibold">⏱️ Time Left:</span> {timeTaken} sec</p>
            </div>

            <button
              onClick={win ? onHome : onRestart}
              className={`${buttonClass} ${win ? winButtonClass : loseButtonClass}`}
            >
              {win ? 'Play New Game' : 'Play New Game'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultOverlay;
