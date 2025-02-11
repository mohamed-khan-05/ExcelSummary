import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, PlusCircle, MinusCircle } from "lucide-react";

const ColumnConfigurator = ({ headerRow, onUpdate, resetKey }) => {
  const [excludedColumns, setExcludedColumns] = useState(4);
  const [columns, setColumns] = useState([]);
  const detectColumnsRef = useRef(false);
  const isDisabled = headerRow.length === 1;

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

  const updateExcludedColumns = (change) => {
    setExcludedColumns((prev) =>
      Math.max(0, Math.min(headerRow.length - 1, prev + change))
    );
    detectColumnsRef.current = true;
  };

  const updateColumnName = (id, newName) => {
    const updatedColumns = columns.map((col) =>
      col.id === id ? { ...col, name: newName } : col
    );
    setColumns(updatedColumns);
    onUpdate({ columns: updatedColumns, excludedColumns });
  };

  return (
    <div
      className={`bg-white shadow-md rounded-lg p-5 border ${
        isDisabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
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
          disabled={isDisabled}
        />
        <button
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 cursor-pointer"
          onClick={() => updateExcludedColumns(-1)}
          disabled={isDisabled}
        >
          <MinusCircle size={20} />
        </button>
        <button
          className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 cursor-pointer"
          onClick={() => updateExcludedColumns(1)}
          disabled={isDisabled}
        >
          <PlusCircle size={20} />
        </button>
        <button
          className="relative p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 cursor-pointer group"
          onClick={detectColumns}
          disabled={isDisabled}
        >
          <RefreshCw size={20} />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
            Redetect columns
          </div>
        </button>
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
            disabled={isDisabled}
          />
        </div>
      ))}
    </div>
  );
};

export default ColumnConfigurator;
