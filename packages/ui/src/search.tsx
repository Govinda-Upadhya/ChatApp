import React, { useEffect, useState } from "react";
import { Lens } from "./lens";

interface SearchProps {
  placeholder: string;
  setSearch: (item: string) => void;
}
const Search = (props: SearchProps) => {
  const [item, setItem] = useState("none");
  useEffect(() => {
    const time = setTimeout(() => {
      props.setSearch(item);
    }, 1000);

    return () => {
      clearTimeout(time);
    };
  }, [item]);
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-gray-300 w-full">
      <div className="text-gray-400">
        <Lens />
      </div>
      <input
        placeholder={`search for ${props.placeholder}`}
        onChange={(e) => setItem(e.target.value)}
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-[1rem]"
      />
    </div>
  );
};

export { Search };
