import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Header from '../components/Header.jsx';
import NumberDisplay from '../components/BSTree/NumberDisplay.jsx';
import TreeVisualizer from '../components/BSTree/TreeVisualizer.jsx';
import ResultOverlay from "../components/ResultOverlay.jsx";

const generateValidNumbers = () => {
    const values = Array.from({ length: 101 }, (_, i) => i);
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    return values.slice(0, 15);
};

// Determine which indices are valid BST insertions based on sorted array logic
const getDisabledNodes = (tree, currentValue) => {
    const filled = tree.map((val, idx) => ({ val, idx })).filter(item => item.val !== null);
    filled.sort((a, b) => a.val - b.val);

    return tree.map((val, idx) => {
        if (val !== null) return true; // already filled

        const leftFilled = filled.filter(item => item.idx < idx);
        const rightFilled = filled.filter(item => item.idx > idx);

        const maxLeft = leftFilled.length ? Math.max(...leftFilled.map(item => item.val)) : -Infinity;
        const minRight = rightFilled.length ? Math.min(...rightFilled.map(item => item.val)) : Infinity;

        return !(currentValue > maxLeft && currentValue < minRight);
    });
};

const BSTree = () => {
    const appName = 'BSTree';
    const rules = [
        'Place the number one by one in a node that maintains Binary search tree property.',
        'Green Nodes: Number can be placed',
        'Red Nodes: Number cannot be placed',
        'Black Nodes: Number already placed',
        'You can skip a number, but cannot go back.',
        'Score depends on how many valid placements you make.',
        'Tree has fixed size (15 positions, index 0-14).'
    ];

    const [numbers, setNumbers] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [tree, setTree] = useState(Array(15).fill(null));
    const [occupied, setOccupied] = useState(0);
    const [disabledNodes, setDisabledNodes] = useState(Array(15).fill(true));
    const [gameWon, setGameWon] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [skippedNumbers, setSkippedNumbers] = useState(0);

    useEffect(() => {
        const nums = generateValidNumbers();
        setNumbers(nums);
    }, []);

    useEffect(() => {
        if (numbers.length === 15 && currentIdx < 15) {
            const currentVal = numbers[currentIdx];
            const newDisabled = getDisabledNodes(tree, currentVal);
            setDisabledNodes(newDisabled);
        }
    }, [tree, currentIdx, numbers]);

    const handleSkip = () => {
        if (currentIdx < 14) {
            setCurrentIdx(currentIdx + 1);
            setSkippedNumbers(skippedNumbers+1);
        } else {
            setSkippedNumbers(skippedNumbers+1);
            setShowResult(true);
            const score = Math.floor((occupied / 15) * 100);
            toast.success(`Game over! Score: ${score}/100`);
        }
    };

    const evaluateScore = () => {
        const max = 15;
        const normalized = occupied / max;
        return Math.round(Math.pow(normalized, 2) * 100);
    };
    

    const reset = () => {
        setNumbers(generateValidNumbers());
        setCurrentIdx(0);
        setTree(Array(15).fill(null));
        setOccupied(0);
        setDisabledNodes(Array(15).fill(true));
        setGameWon(false);
        setShowResult(false);
        setSkippedNumbers(0);
    }

    const handlePlacement = (index) => {
        const value = numbers[currentIdx];
        const newTree = [...tree];
        newTree[index] = value;
        setTree(newTree);
        setOccupied(prev => prev + 1);

        if (currentIdx < 14) {
            setCurrentIdx(currentIdx + 1);
        } else {
            setShowResult(true);
            const score = Math.floor(((occupied + 1) / 15) * 100);
            toast.success(`Game over! Score: ${score}/100`);
        }
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
                message={'Stats'}
                stats={{
                    Score: evaluateScore(),
                    "Occupied": occupied,
                    "Skipped": skippedNumbers
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




            <motion.div
                className="text-xs p-0 pt-0.5 sm:text-sm md:text-base flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2 sm:gap-4 bg-gray-800 sm:p-3 sm:m-4 sm:rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                aria-live="polite"
            >
                <div className="flex flex-col sm:flex-row space-x-4 w-full justify-center sm:justify-around font-semibold text-sm">
                    <p className="w-full sm:w-1/4 border border-b-0 sm:border-b-1 p-2 sm:rounded bg-gray-700 text-white text-center">Digits Left: {15 - currentIdx}</p>
                    <p className="w-full sm:w-1/4 border border-t-0 border-b-0 sm:border-b-1 sm:border-t-1 p-2 sm:rounded bg-gray-700 text-white text-center">Nodes Occupied: {occupied}</p>
                    <p className="w-full sm:w-1/4 border border-t-0 sm:border-t-1 p-2 sm:rounded bg-gray-700 text-white text-center">Nodes Skipped: {skippedNumbers}</p>
                </div>
            </motion.div>


            <div className="flex flex-col sm:flex-row gap-4">
                <motion.div className="sm:w-1/4 w-full flex justify-center"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}>
                    <NumberDisplay
                        number={numbers[currentIdx]}
                        onSkip={handleSkip}
                    />
                </motion.div>

                <motion.div className="sm:w-3/4 w-full"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <TreeVisualizer
                        tree={tree}
                        onPlace={handlePlacement}
                        currentValue={numbers[currentIdx]}
                        disabledNodes={disabledNodes}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BSTree;
