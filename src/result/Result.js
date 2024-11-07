import React from "react";
import "./styles.css"; // Import the CSS styles

const Result = ({ score }) => {
  return (
    <div>
      <h2>Game Over!</h2>
      <p>Your score: {score}</p>
    </div>
  );
};

export default Result;
