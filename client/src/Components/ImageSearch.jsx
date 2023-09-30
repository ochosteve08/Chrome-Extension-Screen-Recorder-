/* eslint-disable react/prop-types */
import { useState } from "react";

const  ImageSearch =({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input className="p-3 border text-md text-slate-500 border-blue-300 outline outline-blue-300 rounded-sm"
      type="text"
      placeholder="Search by tag..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
}

export default ImageSearch;
