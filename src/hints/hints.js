import React, { useState } from "react";
import "./hints.css";
const Hints = ({
  currentQuestion,
  lifelinesUsed,
  setLifelinesUsed,
  questions,
  setAvailableAnswers,
}) => {
  const [hintMessage, setHintMessage] = useState("");

  const handleFiftyFifty = () => {
    if (lifelinesUsed.fiftyFifty) return;

    const correctAnswer = questions[currentQuestion].correct;
    const incorrectAnswers = questions[currentQuestion].answers.filter(
      (answer) => answer !== correctAnswer
    );
    const randomIncorrect =
      incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];

    setAvailableAnswers([correctAnswer, randomIncorrect]); // Обновляем доступные ответы

    setHintMessage("50/50: Two answers remain.");
    setLifelinesUsed((prevState) => ({
      ...prevState,
      fiftyFifty: true,
    }));
  };

  const handleAskAudience = () => {
    if (lifelinesUsed.askAudience) return;

    const correctAnswer = questions[currentQuestion].correct;
    const audienceVotes = [
      { answer: correctAnswer, percentage: 60 },
      {
        answer: questions[currentQuestion].answers[0],
        percentage: Math.random() * 40,
      },
      {
        answer: questions[currentQuestion].answers[1],
        percentage: Math.random() * 40,
      },
      {
        answer: questions[currentQuestion].answers[2],
        percentage: Math.random() * 40,
      },
    ].sort((a, b) => b.percentage - a.percentage);

    setHintMessage(
      `Audience Votes:\n${audienceVotes
        .map((vote) => `${vote.answer}: ${Math.round(vote.percentage)}%`)
        .join("\n")}`
    );

    setLifelinesUsed((prevState) => ({
      ...prevState,
      askAudience: true,
    }));
  };

  const handlePhoneFriend = () => {
    if (lifelinesUsed.phoneFriend) return;

    setHintMessage(
      `Phone Friend: I think the answer is... ${questions[currentQuestion].correct}`
    );

    setLifelinesUsed((prevState) => ({
      ...prevState,
      phoneFriend: true,
    }));
  };

  return (
    <div className="lifelines-container">
      <div className="lifeline-buttons">
        <button
          className="lifeline-btn"
          onClick={handleFiftyFifty}
          disabled={lifelinesUsed.fiftyFifty}
        >
          50/50
        </button>
        <button
          className="lifeline-btn"
          onClick={handleAskAudience}
          disabled={lifelinesUsed.askAudience}
        >
          Ask Audience
        </button>
        <button
          className="lifeline-btn"
          onClick={handlePhoneFriend}
          disabled={lifelinesUsed.phoneFriend}
        >
          Phone Friend
        </button>
      </div>
      <div className="hint-message">{hintMessage}</div>
    </div>
  );
};

export default Hints;
