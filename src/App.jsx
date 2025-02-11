import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ColumnConfigurator = ({ headerRow, onUpdate, resetKey }) => {
  const [excludedColumns, setExcludedColumns] = useState(4);
  const [columns, setColumns] = useState([]);
  const detectColumnsRef = useRef(false);

  useEffect(() => {
    setExcludedColumns(4);
    setColumns([]);
    detectColumnsRef.current = true;
  }, [resetKey]);

  useEffect(() => {
    if (headerRow.length > 0 && detectColumnsRef.current) {
      detectColumns();
      detectColumnsRef.current = false;
    }
  }, [headerRow, excludedColumns]);

  const detectColumns = () => {
    if (headerRow.length <= excludedColumns) {
      setColumns([]);
      onUpdate({ columns: [], excludedColumns });
      return;
    }

    const detectedColumns = headerRow.slice(excludedColumns);
    const initialConfig = detectedColumns.map((col, index) => ({
      id: index,
      name: col || `Other${index + 1}`,
    }));
    setColumns(initialConfig);
    onUpdate({ columns: initialConfig, excludedColumns });
  };

  const updateColumnName = (id, newName) => {
    const updatedColumns = columns.map((col) =>
      col.id === id ? { ...col, name: newName } : col
    );
    setColumns(updatedColumns);
    onUpdate({ columns: updatedColumns, excludedColumns });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 border">
      <h2 className="text-lg font-semibold mb-4">Column Configurator</h2>
      <div className="flex items-center space-x-3 mb-4">
        <label className="font-medium">Exclude Columns:</label>
        <input
          type="number"
          value={excludedColumns}
          min={0}
          max={headerRow.length - 1}
          className="w-16 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => {
            setExcludedColumns(Number(e.target.value));
            detectColumnsRef.current = true;
          }}
        />
      </div>
      {columns.map((col) => (
        <div key={col.id} className="mb-3">
          <label className="block text-sm font-medium">
            Column {col.id + 1}:
          </label>
          <input
            type="text"
            value={col.name}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => updateColumnName(col.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [summary, setSummary] = useState(null);
  const [inputData, setInputData] = useState("");
  const [columnConfig, setColumnConfig] = useState({
    columns: [],
    excludedColumns: 0,
  });
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (inputData.trim()) {
      detectHeaderAndColumns();
    }
  }, [inputData]);

  const detectHeaderAndColumns = () => {
    const headerRow = inputData.trim().split("\n")[0]?.split("\t") || [];
    setColumnConfig({
      columns: [],
      excludedColumns: columnConfig.excludedColumns,
    });
    setTimeout(() => setResetKey((prevKey) => prevKey + 1), 0);
  };

  const processData = () => {
    if (!inputData) {
      toast.error("Please paste some data.");
      return;
    }

    const rows = inputData.trim().split("\n").slice(1);
    const excludedColumns = columnConfig.excludedColumns;
    let summaryObj = {};

    const normalizeString = (str) =>
      str
        .toLowerCase()
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());

    rows.forEach((row) => {
      const values = row.split("\t").slice(excludedColumns);
      columnConfig.columns.forEach((col, index) => {
        const value = values[index]?.trim();
        if (value && value.toLowerCase() !== "null") {
          const normalizedValue = normalizeString(value);
          if (!summaryObj[col.name]) summaryObj[col.name] = {};
          summaryObj[col.name][normalizedValue] =
            (summaryObj[col.name][normalizedValue] || 0) + 1;
        }
      });
    });

    setSummary(summaryObj);
  };

  const clearData = () => {
    setInputData("");
    setSummary(null);
    setColumnConfig({ columns: [], excludedColumns: 0 });
    setResetKey((prevKey) => prevKey + 1);
  };

  const copyToClipboard = () => {
    if (!summary) return;
    const textToCopy = Object.entries(summary)
      .map(
        ([category, values]) =>
          `${category}:\n${Object.entries(values)
            .map(([key, count]) => `${count} x ${key}`)
            .join("\n")}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Summary copied to clipboard!");
    });
  };

  const headerRow = inputData.trim().split("\n")[0]?.split("\t") || [];

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="10"
            placeholder="Paste data here..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          <div className="mt-4 flex space-x-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={processData}
            >
              Generate Summary
            </button>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={clearData}
            >
              Clear
            </button>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={copyToClipboard}
              disabled={!summary}
            >
              Copy
            </button>
          </div>
        </div>
        <ColumnConfigurator
          headerRow={headerRow}
          onUpdate={setColumnConfig}
          resetKey={resetKey}
        />
      </div>

      {summary && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <div className="space-y-4">
            {Object.entries(summary).map(([category, values]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold">{category}:</h3>
                <div className="ml-4">
                  {Object.entries(values).map(([key, count]) => (
                    <p key={key}>
                      <span className="font-medium">{count}</span> x {key}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
// updated works
