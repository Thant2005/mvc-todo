import React, { useEffect, useState } from "react";

export default function TodoFilters({ filterBy }) {
  let [filter, setFilter] = useState("All");
  useEffect(() => {
    filterBy(filter);
  }, [filter, filterBy]);
  return (
    <div>
      <button
        onClick={() => setFilter("All")}
        className={`button filter-button ${
          filter === "All" ? "filter-button-active" : ""
        } `}
      >
        All
      </button>
      <button
        onClick={() => setFilter("Active")}
        className={`button filter-button ${
          filter === "Active" ? "filter-button-active" : ""
        } `}
      >
        Active
      </button>
      <button
        onClick={() => setFilter("Completed")}
        className={`button filter-button ${
          filter === "Completed" ? "filter-button-active" : ""
        } `}
      >
        Completed
      </button>
    </div>
  );
}
