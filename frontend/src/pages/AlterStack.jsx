import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import PushPool from "../components/AlterStack/PushPool";
import StackDiv from "../components/AlterStack/StackDiv";
import Stats from "../components/AlterStack/Stats";
import ResultOverlay from "../components/ResultOverlay";
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';


const generateGameData = (difficulty = "easy") => {
    const values = Array.from({ length: 20 }, (_, i) => i + 1);
    
    // Shuffle values
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }

    const pool = values.slice(0, 10);
    let target = 0;

    if (difficulty === "hard") {
        // Must use all elements to win
        const simulatedStack = pool.map((val, i) => (i % 2 === 0 ? val : -val));
        target = simulatedStack.reduce((a, b) => a + b, 0);
    } 
    else if (difficulty === "medium") {
        const subsetSize = Math.floor(Math.random() * 4) + 6; // 6–9 elements
        const subset = pool.slice(0, subsetSize);
        const simulatedStack = subset.map((val, i) => (i % 2 === 0 ? val : -val));
        target = simulatedStack.reduce((a, b) => a + b, 0);
    } 
    else {
        // Easy
        const subsetSize = Math.floor(Math.random() * 6) + 5; // 5–10
        const subset = pool.slice(0, subsetSize);
        const simulatedStack = subset.map((val, i) => (i % 2 === 0 ? val : -val));
        target = simulatedStack.reduce((a, b) => a + b, 0);
    }

    // Shuffle pool again so it's not in target-producing order
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return { pool, target };
};




const AlterStack = () => {
  const appName = 'Alter Stack';

  const rules = [
    "Starting the Game: Select difficulty, click on the Start button, timer starts.",
    "Goal: Build a stack of numbers that adds up exactly to the target sum before the time runs out.",
    "What is a stack? Think of it like a vertical pile — you can only add or remove from the top.",
    "Push: Add a number to the top of the stack. Pop: Remove the top number.",
    "When pushing, numbers will alternate in sign: + - + -, starting with a positive.",
    "You must have at least 5 numbers in your stack to submit it.",
    "Tip: Use fewer pushes and pops for a better score!"
  ];

    const gameEnded = useRef(false);
    const [difficulty, setDifficulty] = useState("easy");
    const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
    const [stack, setStack] = useState([]);
    const [disabledIndexes, setDisabledIndexes] = useState([]);
    const [currentSum, setCurrentSum] = useState(0);
    const [pushes, setPushes] = useState(0);
    const [pops, setPops] = useState(0);
    const [sign, setSign] = useState(true);
    const [poolValues, setPoolValues] = useState([]);
    const [target, setTarget] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerId, setTimerId] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [lastAction, setLastAction] = useState(null);


    useEffect(()=>{
        initializeGame();
        return () => {
            if (timerId) clearInterval(timerId);
        }
    }, []);

    const initializeGame = () => {
        if(timerId) clearInterval(timerId);
        const { pool, target } = generateGameData(difficulty);
        setPoolValues(pool);
        setTarget(target);
        setStack([]);
        setCurrentSum(0);
        setDisabledIndexes([]);
        setPops(0);
        setPushes(0);
        setSign(true);
        setDifficulty(selectedDifficulty);
        setGameStarted(false);
        setTimeLeft(0);
        setGameWon(false);
        setShowResult(false);
    };
    
    const handlePush = (value, index) => {
        if (!gameStarted) return;
    
        setStack(prev => {
            const val = sign ? value : -value;
            const newStack = [...prev, val];
            const newPushes = pushes + 1;
            const newSum = calculateSum(newStack);

            setPushes(newPushes);
            setCurrentSum(newSum);
            setSign(!sign);
            setLastAction('push');
    
            return newStack;
        });
    
        setDisabledIndexes(prev => [...prev, index]);
    };
    

    const handlePop = () => {
        if (!gameStarted) return;
    
        setStack(prev => {
            const newStack = [...prev];
            newStack.pop();
    
            const newPops = pops + 1;
            const newSum = calculateSum(newStack);
    
            setPops(newPops);
            setCurrentSum(newSum);
            setLastAction('pop');
    
            if (newStack.length === 0) {
                setSign(true);
            } else {
                setSign(!sign);
            }
    
            return newStack;
        });
    
        setDisabledIndexes(prev => {
            const newDisabled = [...prev];
            newDisabled.pop();
            return newDisabled;
        });
    };
    

    const calculateSum = (arr) => arr.reduce((acc, val) => acc + val, 0);

    const evaluateScore = () => {
        let base;
        if (difficulty === 'easy') base = 50;
        else if (difficulty === 'medium') base = 100;
        else base = 150; // hard
    
        const efficiency = (1 / (pushes + pops)) * 100;
    
        const timeBonus = timeLeft > 0 ? (timeLeft / 100) * 50 : 0;
    
        const totalScore = base + efficiency + timeBonus;
    
        return Math.round(totalScore);
    };
    
    

    const checkWin = () => {
        if (!gameStarted) return;
    
        if (timerId) {
            clearInterval(timerId);
            setTimeLeft(0); 
        }
    
        if (currentSum === target) {
            if (stack.length >= 5) {
                setShowResult(true);
                setGameWon(true); 
                setTimeLeft(timeLeft);  
                gameEnded.current = true; 
            } else {
                toast.error("The stack must contain at least 5 elements for the win.");
            }
        } else {
            toast.info("Not yet, keep trying!");
        }
    };
    

    const startTimer = () => {
        gameEnded.current = false; 
        initializeGame();
        

        let duration = 30;
        if (selectedDifficulty === 'medium') duration = 45;
        else if (selectedDifficulty === 'hard') duration = 90;
        
        setTimeLeft(duration);
        setGameStarted(true);
        setDifficulty(selectedDifficulty);
    
        if (timerId) clearInterval(timerId);
    
        const id = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (!gameEnded.current) {
                        clearInterval(id);
                        setGameStarted(false);
                        setGameWon(false);
                        setShowResult(true);
                        setTimeLeft(0);  
                        gameEnded.current = true;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    
        setTimerId(id);
    };
    

    const reset = () => {
        if (timerId) clearInterval(timerId);    
        setStack([]);
        setCurrentSum(0);
        setDisabledIndexes([]);
        setPops(0);
        setPushes(0);
        setSign(true);
        setDifficulty(selectedDifficulty); 
        setGameStarted(false);
        setTimeLeft(0);
        setGameWon(false);
        setShowResult(false);
        gameEnded.current = false;
    };
    


    return (
        <motion.div
          className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white audiowide-regular p-4 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ResultOverlay
            show={showResult}
            win={gameWon}
            message={gameWon ? 'Congratulations! You Win!' : 'Popped Out! Try Again?'}
            stats={{
              Score: gameWon ? evaluateScore() : '0',
              "🎯 Target": target,
              "➕ Current Sum": currentSum,
              "📦 Pushes": pushes,
              "📤 Pops": pops,
              "📈 Difficulty": difficulty,
              "⏱️ Time Left": `${timeLeft} sec`,
              
            }}
            
            onRestart={reset}
          />
      
          <motion.div
            className="text-xs mb-0 sm:mb-2 lg:block md:block"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80 }}
          >
            <Header appName={appName} rules={rules} />
          </motion.div>
      
          {/* Control Bar */}
          <motion.div
            className="text-xs m-0 p-0 pt-0.5 sm:text-sm md:text-base flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2 sm:gap-4 bg-gray-800 sm:p-3 sm:m-4 sm:rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* First Line on Mobile */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
              <label
                htmlFor="difficulty"
                className="hidden sm:block xs:inline text-sm sm:text-base font-semibold"
              >
                Difficulty:
              </label>
              <select
                id="difficulty"
                disabled={gameStarted}
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-black border border-gray-600 text-white px-2 py-1 rounded-lg shadow-md focus:outline-none text-xs sm:text-sm disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
      
              <button
                onClick={startTimer}
                disabled={gameStarted}
                className={`text-xs sm:text-sm bg-green-600 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold sm:font-bold shadow-md
                  ${!gameStarted ? ' bg-green-600 hover:bg-green-500 cursor-pointer' : 'bg-gray-600 cursor-not-allowed opacity-50'}
                `}
              >
                Start
              </button>
              <button
                onClick={reset}
                disabled={!gameStarted}
                className={`text-xs bg-red-600 sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold sm:font-bold shadow-md
                  ${gameStarted ? 'bg-red-600 hover:bg-red-500 cursor-pointer' : 'bg-gray-600 cursor-not-allowed opacity-50'}
                `}
              >
                Quit
              </button>
            </div>
      
            {/* Second Line on Mobile */}
            <span
              className={`border p-1.5 text-sm sm:text-lg font-bold text-center w-3/4 sm:w-60 mt-2 sm:mt-0 rounded-lg
                ${gameStarted && timeLeft < 10 ? 'bg-red-600 text-white' : 'text-yellow-400'}
              `}
            >
              ⏱️ {gameStarted ? `${timeLeft} sec` : 'Not Started'}
            </span>
          </motion.div>
      
          {/* Main Layout with PushPool and Stack Side-by-Side on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-[35%_65%] gap-0">
            {/* Stats component hidden on mobile */}
            <motion.div
              className="w-full md:block md:w-full"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Stats
                gameStarted={gameStarted}
                currentSum={currentSum}
                pushes={pushes}
                pops={pops}
                target={target}
                difficulty={difficulty}
              />
            </motion.div>
      
            {/* Main Flex Layout for PushPool and Stack Side-by-Side */}
            <div className="flex gap-4 sm:gap-6 p-2 sm:p-4 items-start justify-between sm:pt-1 sm:flex-row-reverse">
              {/* PushPool Component on the left (mobile view) */}
              {/* Stack Component on the right (mobile view) */}
              <motion.div
                className="w-1/2 sm:w-1/2 md:w-1/2 space-y-6"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StackDiv stack={stack} lastAction={lastAction} />
              </motion.div>
      
              <motion.div
                className="w-1/2 h-full sm:w-1/2 md:w-1/2 space-y-6"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <PushPool
                  onPush={handlePush}
                  disabledIndexes={disabledIndexes}
                  poolValues={poolValues}
                  gameStarted={gameStarted}
                  onPop={handlePop}
                  onSub={checkWin}
                  target={target}
                  currentSum={currentSum}
                  stack={stack}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      );
      
    
    
};

export default AlterStack;