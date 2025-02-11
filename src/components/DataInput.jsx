import React from "react";

const DataInput = ({
  inputData,
  setInputData,
  processData,
  clearData,
  copyToClipboard,
  summary,
}) => {
  return (
    <div>
      <textarea
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="10"
        placeholder="Paste data here..."
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
      />
      <div className="mt-4 flex space-x-4">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          onClick={processData}
        >
          Generate Summary
        </button>
        <button
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
          onClick={clearData}
        >
          Clear
        </button>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
          onClick={copyToClipboard}
          disabled={!summary}
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default DataInput;
