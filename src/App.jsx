import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  const [summary, setSummary] = useState(null);
  const [inputData, setInputData] = useState("");

  const processData = () => {
    const rows = inputData.trim().split("\n").slice(0);
    let summaryObj = {};

    const baseColumns = [
      "Overall Pants",
      "Overall Jackets",
      "T-shirt",
      "Reflective Vest",
      "Boots",
    ];

    const headerRow = inputData.trim().split("\n")[0].split("\t");
    const extraColumns = headerRow
      .slice(9)
      .map((col, index) => `Other${index + 1}`);
    const allColumns = [...baseColumns, ...extraColumns];

    const normalizeString = (str) => {
      return str
        .toLowerCase()
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    rows.forEach((row) => {
      const values = row.split("\t");
      allColumns.forEach((col, index) => {
        const value = values[index + 4]?.trim();
        if (value && value.toLowerCase() !== "null") {
          const normalizedValue = normalizeString(value);
          if (!summaryObj[col]) summaryObj[col] = {};
          summaryObj[col][normalizedValue] =
            (summaryObj[col][normalizedValue] || 0) + 1;
        }
      });
    });

    setSummary(summaryObj);
  };

  const clearData = () => {
    setInputData("");
    setSummary(null);
  };
  const copyToClipboard = () => {
    if (!summary) return;
    const textToCopy = Object.entries(summary)
      .map(([category, values]) => {
        return (
          `${category}:\n` +
          Object.entries(values)
            .map(([key, count]) => `${count} x ${key}`)
            .join("\n")
        );
      })
      .join("\n\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Summary copied to clipboard!");
    });
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <textarea
        className="w-full p-2 border rounded"
        rows="6"
        placeholder="Paste data here..."
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
      />
      <div className="mt-3 flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={processData}
        >
          Generate Summary
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={clearData}
        >
          Clear
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={copyToClipboard}
          disabled={!summary}
        >
          Copy
        </button>
      </div>
      {summary && (
        <div className="mt-5 p-4 border rounded bg-gray-100">
          {Object.entries(summary).map(([category, values]) => (
            <div key={category} className="mb-3">
              <h3 className="font-bold">{category}:</h3>
              <div>
                {Object.entries(values).map(([key, count]) => (
                  <p key={key}>
                    {count} x {key}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
// updated works
