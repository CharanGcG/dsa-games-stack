import { useState, useEffect } from "react";
import Header from "../components/Header";
import PushPool from "../components/PushPool";
import StackDiv from "../components/StackDiv";
import Stats from "../components/Stats";
import styles from "../styles/AlterStack.module.css";

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
    };
    

    const handlePush = (value,index)=>{
        if(!gameStarted)return;
        setStack(prev => {
            const val = sign ? value : -value;
            setSign(!sign);
            const newStack = [...prev, val];
            setPushes(pushes+1);
            setCurrentSum(calculateSum(newStack));
            return newStack;
        });
        setDisabledIndexes(prev => [...prev, index]);
        
    };

    const handlePop = () => {
        if(!gameStarted)return;
        if(stack.length === 0){
            setMessage("Stack is empty, cannot push");
        };

        setStack(prev => {
            const newStack = [...prev];
            newStack.pop();
            setPops(pops+1);
            setCurrentSum(calculateSum(newStack));
            if(newStack.length===0){
                setSign(true);
            }
            return newStack;
        });

        setDisabledIndexes(prev => {
            const newDisabled = [...prev];
            newDisabled.pop();
            return newDisabled;
        })
    }

    const calculateSum = (arr) => arr.reduce((acc, val) => acc + val, 0);

    const evaluateScore = () => {
        let base;
        if (difficulty === 'easy') base = 50;
        else if (difficulty === 'medium') base = 100;
        else base = 150; // hard
    
        const efficiency = (1 / (pushes + pops)) * 100; // more efficient => higher score
        return Math.round(base + efficiency);
    };
    

    const checkWin = () => {
        if(!gameStarted)return;
        if(currentSum === target){
            if(stack.length>=5){
                alert(`You win! Congrats! Your Score: ${evaluateScore()}`);
                initializeGame();
            }
            else{
                alert("The stack must contain atleast 5 elements for the win");
            }
            
        }else{
            alert("Not yet, keep trying!");
        }
    }

    const startTimer = () => {
        let duration = 90;
        if (selectedDifficulty==='medium') duration = 120;
        else if(selectedDifficulty==='hard') duration = 150;
        setTimeLeft(duration);
        setGameStarted(true);
        setDifficulty(selectedDifficulty);

        const id = setInterval(()=>{
            setTimeLeft(prev => {
                if(prev<=1){
                    clearInterval(id);
                    setGameStarted(false);
                    alert("Time's up! Game Over!");
                    return 0;
                }
                return prev-1;
            });
        }, 1000);
        setTimerId(id);
    }


    return (
        <div>
            <Header/>
            <div className={styles.controlBar}>
                <label htmlFor="difficulty">Difficulty: </label>
                <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e)=>setSelectedDifficulty(e.target.value)}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            <button onClick={initializeGame}>Reset</button>
            <button onClick={startTimer}>Start Game</button>
            <span>Time Left: {gameStarted ? `${timeLeft} sec` : `Not Started`}</span>
            </div>
            <div className={styles.mainWrapper}>
                <div className={styles.leftPanel}>
                    <Stats currentSum={currentSum} pushes={pushes} pops={pops} target={target} difficulty={difficulty} />
                    <PushPool onPush={handlePush} disabledIndexes={disabledIndexes} poolValues={poolValues} gameStarted={gameStarted} />
                </div>
                <div className={styles.rightPanel}>
                    <StackDiv stack={stack} onPop={handlePop} onSub={checkWin} target={target} currentSum={currentSum} gameStarted={gameStarted} />
                </div>
            </div>
        </div>
    )
};

export default AlterStack;