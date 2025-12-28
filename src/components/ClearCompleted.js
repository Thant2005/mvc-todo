import React from "react";

export default function ClearCompleted({ clearComplete }) {
  return (
    <div>
      <button onClick={clearComplete} className="button">
        Clear completed
      </button>
    </div>
  );
}
