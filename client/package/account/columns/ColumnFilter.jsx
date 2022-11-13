import React from "react";
export const ColumnFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex items-center mb-2 w-full">
      <div className="ml-auto mr-1">Search:</div>
      <input
        className="w-1/3 appearance-none border-2 rounded-md p-3 text-gray-700 leading-tight focus:outline-none text-sm mr-0 border-black"
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
};
