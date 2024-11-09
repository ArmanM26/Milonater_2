import React, { useState, useEffect } from "react";
import "./prizeLadder.css";

const PrizeLadder = ({ currentPrizeIndex, moveToNextPrize }) => {
  const firstRowPrizes = ["$100", "$200", "$300", "$500", "$1,000", "$2,000"];
  const secondRowPrizes = ["$4,000", "$8,000", "$16,000", "$32,000", "$64,000"];
  const thirdRowPrizes = ["$250,000", "$500,000", "$250,000", "$500,000"];
  const fourthRowPrizes = ["$1,000,000"];

  const totalPrizes = [
    ...firstRowPrizes,
    ...secondRowPrizes,
    ...thirdRowPrizes,
    ...fourthRowPrizes,
  ];

  // Local state for managing prize index
  const [localPrizeIndex, setLocalPrizeIndex] = useState(currentPrizeIndex);

  useEffect(() => {
    if (moveToNextPrize) {
      setLocalPrizeIndex((prevIndex) => {
        // Ensure we move to the next prize sequentially, without skipping
        if (prevIndex < totalPrizes.length - 1) {
          return prevIndex + 1; // Move to the next prize
        }
        return prevIndex; // Don't move beyond the last prize
      });
    }
  }, [moveToNextPrize]); // Trigger when moveToNextPrize changes

  useEffect(() => {
    // Ensure the local prize index always stays in sync with the parent component
    setLocalPrizeIndex(currentPrizeIndex);
  }, [currentPrizeIndex]);

  // Function to render the prize rows
  const renderPrizeRow = (prizes, rowIndex) => {
    return prizes.map((prize, index) => (
      <div
        key={index}
        className={`prize-item ${
          index + rowIndex === localPrizeIndex ? "current" : ""
        }`}
      >
        <span className="prize-number">{prize}</span>
      </div>
    ));
  };

  return (
    <div className="prize-ladder">
      {/* Render prize rows */}
      <div className="prize-row first-row">
        {renderPrizeRow(firstRowPrizes, 0)}
      </div>

      <div className="prize-row second-row">
        {renderPrizeRow(secondRowPrizes, firstRowPrizes.length)}
      </div>

      <div className="prize-row third-row">
        {renderPrizeRow(
          thirdRowPrizes,
          firstRowPrizes.length + secondRowPrizes.length
        )}
      </div>

      <div className="prize-row fourth-row">
        {renderPrizeRow(
          fourthRowPrizes,
          firstRowPrizes.length + secondRowPrizes.length + thirdRowPrizes.length
        )}
      </div>
    </div>
  );
};

export default PrizeLadder;
