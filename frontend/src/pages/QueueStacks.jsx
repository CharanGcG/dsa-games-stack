import React from 'react';
import { Link } from 'react-router-dom';

const QueueStacks = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-black bg-opacity-50 rounded-lg shadow-lg p-8 text-center max-w-lg mx-auto">
        
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">QueueStacks - Coming Soon!</h1>
        <p className="text-lg mb-6">We're working hard to bring you the next exciting game! Stay tuned for updates. Try out Alter Stack!</p>

        
        <p className="text-sm mb-6">
          QueueStacks will challenge your problem-solving skills as you manage a queue of elements in a fun and interactive way.
          It will be a great addition to your DSA game collection! 🚀
        </p>

        
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default QueueStacks;

/*
import React from 'react';

const nodes = [
  { id: 8, left: 4, right: 12, level: 0, position: 1 },
  { id: 4, left: 2, right: 6, level: 1, position: 0.5 },
  { id: 12, left: 10, right: 14, level: 1, position: 1.5 },
  { id: 2, left: 1, right: 3, level: 2, position: 0.25 },
  { id: 6, left: 5, right: 7, level: 2, position: 0.75 },
  { id: 10, left: 9, right: 11, level: 2, position: 1.25 },
  { id: 14, left: 13, right: 15, level: 2, position: 1.75 },
  { id: 1, level: 3, position: 0.125 },
  { id: 3, level: 3, position: 0.375 },
  { id: 5, level: 3, position: 0.625 },
  { id: 7, level: 3, position: 0.875 },
  { id: 9, level: 3, position: 1.125 },
  { id: 11, level: 3, position: 1.375 },
  { id: 13, level: 3, position: 1.625 },
  { id: 15, level: 3, position: 1.875 },
];

const nodeSize = 40;
const verticalGap = 100;
const horizontalScale = 200;

const BinarySearchTree = () => {
  const getCoordinates = (node) => ({
    x: node.position * horizontalScale,
    y: node.level * verticalGap,
  });

  const lines = nodes.flatMap((node) => {
    const lines = [];
    const parentPos = getCoordinates(node);
    if (node.left) {
      const leftNode = nodes.find((n) => n.id === node.left);
      const childPos = getCoordinates(leftNode);
      lines.push({ x1: parentPos.x, y1: parentPos.y, x2: childPos.x, y2: childPos.y });
    }
    if (node.right) {
      const rightNode = nodes.find((n) => n.id === node.right);
      const childPos = getCoordinates(rightNode);
      lines.push({ x1: parentPos.x, y1: parentPos.y, x2: childPos.x, y2: childPos.y });
    }
    return lines;
  });

  return (
    <div className="relative w-[1000px] h-[450px] mx-auto">
      <svg className="absolute top-0 left-0 w-full h-full">
        {lines.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1 + nodeSize / 2}
            y1={line.y1 + nodeSize / 2}
            x2={line.x2 + nodeSize / 2}
            y2={line.y2 + nodeSize / 2}
            stroke="#94a3b8"
            strokeWidth={2}
          />
        ))}
      </svg>

      {nodes.map((node) => {
        const { x, y } = getCoordinates(node);
        return (
          <div
            key={node.id}
            className="absolute bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
            style={{
              width: `${nodeSize}px`,
              height: `${nodeSize}px`,
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {node.id}
          </div>
        );
      })}
    </div>
  );
};

export default BinarySearchTree;
*/
