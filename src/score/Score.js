import React from "react";
import "./../styles.css";

const Score = ({ score, onRestart }) => {
  return (
    <div className="result">
      <h2>Your Score: {score}</h2>
      <button className="restart-button" onClick={onRestart}>
        Restart Game
      </button>
    </div>
  );
};

export default Score;
