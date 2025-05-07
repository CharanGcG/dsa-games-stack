const Stats = ({ currentSum, pushes, pops, target, difficulty, gameStarted }) => {
    return (
        <div className="bg-gray-900 sm:bg-gradient-to-br sm:from-gray-800 sm:to-gray-900 text-white sm:rounded-2xl m-0 p-0 pt-0.5 sm:p-4 shadow-lg mb-4 md:h-3/4 w-full sm:h-full mx-auto sm:mx-0">
            <h1 className="hidden lg:block md:block text-xl sm:text-3xl font-extrabold text-center text-yellow-400 mb-3">Stats</h1>
            <div className="flex justify-around sm:text-2xl md:flex-col space-y-2 tracking-wide">
                <p className="hidden lg:block md:block p-3 m-3 border rounded-2xl"><span className="text-pink-400">Difficulty:</span> {difficulty.toUpperCase()}</p>
                <p className="hidden lg:block md:block p-3 m-3 border rounded-2xl"><span className="text-blue-400">Pushes:</span> {pushes}</p>
                <p className="hidden lg:block md:block p-3 m-3 border rounded-2xl"><span className="text-red-400">Pops:</span> {pops}</p>
                <p className="md:hidden sm:p-3 sm:m-3 sm:border sm:rounded-2xl"><span className="text-green-400">Target:</span> {gameStarted ? target : "XXX"}</p>
                <p className="md:hidden sm:p-3 sm:m-3 sm:border sm:rounded-2xl"><span className="text-purple-400">Current Sum:</span> {currentSum}</p>
            </div>
        </div>
    );
};

export default Stats;