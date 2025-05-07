/*const TreeVisualizer = ({ tree, onPlace, currentValue, disabledNodes }) => {
    const renderNode = (val, idx) => {
        const disabled = disabledNodes[idx];

        return (
            <button
                key={idx}
                onClick={() => !disabled && onPlace(idx)}
                disabled={disabled}
                className={`col-start-${idx+1} h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 text-base sm:text-xl font-bold transition-all duration-200 ${val !== null ? 'bg-black cursor-not-allowed' :
                        disabled ? 'bg-red-800 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'
                    }  `}
            >
                {val !== null ? val : ''}
            </button>
        );
    };

    return (
        <div className="space-y-2">
            <div className="grid [grid-template-columns:repeat(15,1fr)]">{renderNode(tree[7], 7)}</div>
            <div className="grid [grid-template-columns:repeat(15,1fr)]">
                {renderNode(tree[3], 3)}
                {renderNode(tree[11], 11)}
            </div>
            <div className="grid [grid-template-columns:repeat(15,1fr)]">
                {renderNode(tree[1], 1)}
                {renderNode(tree[5], 5)}
                {renderNode(tree[9], 9)}
                {renderNode(tree[13], 13)}
            </div>
            <div className="grid [grid-template-columns:repeat(15,1fr)]">
                {renderNode(tree[0], 0)}
                {renderNode(tree[2], 2)}
                {renderNode(tree[4], 4)}
                {renderNode(tree[6], 6)}
                {renderNode(tree[8], 8)}
                {renderNode(tree[10], 10)}
                {renderNode(tree[12], 12)}
                {renderNode(tree[14], 14)}
            </div>
        </div>
    );
};

export default TreeVisualizer;*/

const TreeVisualizer = ({ tree, onPlace, currentValue, disabledNodes }) => {
    const renderRow = (indicesInRow) => {
        return (
            <div className="grid [grid-template-columns:repeat(15,1fr)] gap-1 sm:mb-15 mb-7">
                {Array.from({ length: 15 }, (_, i) => {
                    const idx = indicesInRow.includes(i) ? i : null;
                    if (idx === null) return <div key={i} />; // empty placeholder cell

                    const val = tree[idx];
                    const disabled = disabledNodes[idx];

                    return (
                        <button
                            key={idx}
                            onClick={() => !disabled && onPlace(idx)}
                            disabled={disabled}
                            className={`h-7 w-7 sm:h-14 sm:w-14 rounded-full border-2 text-sm sm:text-xl font-bold transition-all duration-200 ${
                                val !== null
                                    ? 'bg-black cursor-not-allowed'
                                    : disabled
                                    ? 'bg-red-800 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-700'
                            }`}
                        >
                            {val !== null ? val : ''}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-2">
            {renderRow([7])}
            {renderRow([3, 11])}
            {renderRow([1, 5, 9, 13])}
            {renderRow([0, 2, 4, 6, 8, 10, 12, 14])}
        </div>
    );
};


export default TreeVisualizer;