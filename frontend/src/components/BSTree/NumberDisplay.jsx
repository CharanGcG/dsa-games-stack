const NumberDisplay = ({ number, onSkip }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center space-y-6 w-full sm:w-auto">
            <h2 className="text-2xl font-semibold text-white">Current Number</h2>
            <div className="flex flex-row sm:flex-col justify-around align-middle">
            <div className="text-4xl font-bold text-white">{number}</div>
            
            <button 
                onClick={onSkip}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold sm:mt-4 transition-colors duration-300"
            >
                Skip
            </button>
            </div>
            
            <div className="flex sm:flex-col gap-5 justify-center space-x-6 sm:mt-8">
                <div className="flex items-center space-x-4">
                    <div className="rounded-full h-14 w-14 bg-green-500 border-4 border-white flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">✓</span>
                    </div>
                    <p className=" hidden sm:block text-white text-lg font-medium">Allowed</p>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="rounded-full h-14 w-14 bg-red-500 border-4 border-white flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">✘</span>
                    </div>
                    <p className="hidden sm:block text-white text-lg font-medium">Not Allowed</p>
                </div>
            </div>
        </div>
    );
};

export default NumberDisplay;
