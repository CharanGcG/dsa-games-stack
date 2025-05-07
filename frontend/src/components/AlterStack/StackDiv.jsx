const StackDiv = ({ stack }) => {
  const getItemClass = (value) => {
    const baseClass =
      "w-full sm:w-1/2 text-center font-bold py-1 rounded shadow-inner transition-transform duration-300";
    const colorClass =
      value >= 0 ? "bg-green-400 text-black" : "bg-red-400 text-white";
    return `${baseClass} ${colorClass}`;
  };

  return (
    <div className="flex flex-col-reverse items-center justify-items-end gap-2 p-4 border-2 border-dashed border-white rounded-xl w-full min-h-[400px] sm:min-h-[60vh] bg-gray-800">
      {stack.map((value, index) => (
        <div key={index} className={getItemClass(value)}>
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
