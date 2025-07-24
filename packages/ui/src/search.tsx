import React from "react";
import { Lens } from "./lens";

const Search = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-gray-300 w-full">
      <div className="text-gray-400">
        <Lens />
      </div>
      <input
        placeholder="Search for chats"
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-[1rem]"
      />
    </div>
  );
};

export { Search };
