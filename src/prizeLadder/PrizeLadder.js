import React from "react";
import "./prizeLadder.css";

const PrizeLadder = ({ currentPrizeIndex }) => {
  const prizes = [
    "$1,000,000",
    "$500,000",
    "$250,000",
    "$125,000",
    "$64,000",
    "$32,000",
    "$16,000",
    "$8,000",
    "$4,000",
    "$2,000",
    "$1,000",
    "$500",
    "$300",
    "$200",
    "$100",
  ];

  return (
    <div className="prize-ladder">
      {prizes.map((prize, index) => (
        <div
          key={index}
          className={`prize-item ${
            index === currentPrizeIndex ? "current" : ""
          }`}
        >
          <span className="prize-number">{15 - index}</span>
          <span className="prize-amount">{prize}</span>
        </div>
      ))}
    </div>
  );
};

export default PrizeLadder;
