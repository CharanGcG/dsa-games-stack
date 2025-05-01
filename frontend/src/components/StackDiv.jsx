const StackDiv = ({ stack }) => {
  const baseClass =
    "w-full sm:w-1/2 text-center bg-yellow-400 text-black font-bold py-1 rounded shadow-inner transition-transform duration-300";

  return (
    <div className="flex flex-col-reverse items-center justify-items-end gap-2 p-4 border-2 border-dashed border-white rounded-xl w-full min-h-[400px] sm:min-h-[60vh] bg-gray-800">
      {stack.map((value, index) => (
        <div key={index} className={baseClass}>
          {value}
        </div>
      ))}

      {stack.length === 0 && (
        <p className="text-sm text-gray-400 italic">Stack Empty</p>
      )}
    </div>
  );
};

export default StackDiv;
