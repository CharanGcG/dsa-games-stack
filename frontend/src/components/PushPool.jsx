import { motion, AnimatePresence } from 'framer-motion';

const PushPool = ({ onPush, disabledIndexes, stack, poolValues, gameStarted, onPop, onSub, target, currentSum }) => {
    // Common button disabled class logic
    const disabledButtonClass = "bg-gray-600 cursor-not-allowed opacity-50";
    const activeButtonClass = "bg-pink-600 hover:bg-pink-500 active:scale-95 shadow-md hover:shadow-xl";
    const popDisabledClass = "bg-gray-600 cursor-not-allowed opacity-50";
    const popActiveClass = "bg-red-600 hover:bg-red-500 active:scale-95 shadow-md";
    const submitDisabledClass = "bg-gray-600 cursor-not-allowed opacity-50";
    const submitActiveClass = "bg-green-600 hover:bg-green-500 active:scale-95 shadow-md";

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-4 shadow-lg w-full sm:h-full mx-auto sm:mx-0">
            <h1 className="text-xl sm:text-3xl font-extrabold text-center text-cyan-400 mb-2 lg:block hidden">Push Pool</h1>
            <div className='flex flex-row justify-center'>
            <p className="hidden md:block md:w-1/2 sm:p-3 sm:m-3 sm:border sm:rounded-2xl"><span className="text-green-400">Target:</span> {gameStarted ? target : "XXX"}</p>
            <p className="hidden md:block md:w-1/2 sm:p-3 sm:m-3 sm:border sm:rounded-2xl"><span className="text-purple-400">Current Sum:</span> {currentSum}</p>
            </div>
            <div className="flex flex-col sm:flex-col gap-3 mb-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
                    {poolValues.map((value, index) => {
                        const isDisabled = !gameStarted || disabledIndexes.includes(index);
                        const buttonClasses = isDisabled
                            ? `${disabledButtonClass} text-lg font-bold px-4 py-2 rounded-xl transition transform`
                            : `${activeButtonClass} text-lg font-bold px-4 py-2 rounded-xl transition transform`;

                        return (
                            <button
                                key={index}
                                onClick={() => onPush(value, index)}
                                disabled={isDisabled}
                                className={`${buttonClasses} ${index === 9 ? 'sm:col-start-2' : ''}`}
                            >
                                {gameStarted ? value : "X"}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <button
                    onClick={onPop}
                    disabled={!gameStarted || stack.length <= 0}
                    className={`px-6 py-2 font-bold rounded-xl transition transform 
                        ${(!gameStarted || stack.length <= 0) ? popDisabledClass : popActiveClass}`}
                >
                    Pop
                </button>
                <button
                    onClick={onSub}
                    disabled={!gameStarted || target !== currentSum || stack.length <= 5}
                    className={`px-6 py-2 font-bold rounded-xl transition transform 
                        ${(!gameStarted || target !== currentSum || stack.length <= 5) ? submitDisabledClass : submitActiveClass}`}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default PushPool;
