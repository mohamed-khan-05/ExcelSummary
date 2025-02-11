import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ColumnConfigurator from "./components/ColumnConfigurator";
import DataInput from "./components/DataInput";
import Summary from "./components/Summary";

const App = () => {
  const [summary, setSummary] = useState(null);
  const [inputData, setInputData] = useState("");
  const [columnConfig, setColumnConfig] = useState({
    columns: [],
    excludedColumns: 0,
  });
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (inputData.trim()) detectHeaderAndColumns();
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
          <DataInput
            inputData={inputData}
            setInputData={setInputData}
            processData={processData}
            clearData={clearData}
            copyToClipboard={copyToClipboard}
            summary={summary}
          />
        </div>
        <ColumnConfigurator
          headerRow={headerRow}
          onUpdate={setColumnConfig}
          resetKey={resetKey}
        />
      </div>

      {summary && <Summary summary={summary} />}

      <ToastContainer />
    </div>
  );
};

export default App;
