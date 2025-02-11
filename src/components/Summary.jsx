import React from "react";

const Summary = ({ summary }) => {
  return (
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
  );
};

export default Summary;
