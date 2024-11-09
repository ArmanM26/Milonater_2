import React, { useState, useEffect, useRef } from "react";
import questions from "../questions/questions";
import Hints from "../hints/hints";
import PrizeLadder from "../prizeLadder/PrizeLadder";
import "./home.css";

// Import audio files
import backgroundMusic from "../music/backgroundMusic.mp3";
import winMusic from "../music/winMusic.mp3";
import loseMusic from "../music/loseMusic.mp3";

const Home = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0); // Start at $100 prize
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(100); // Timer set to 100 seconds
  const [moveToNextPrize, setMoveToNextPrize] = useState(false);
  const [lifelinesUsed, setLifelinesUsed] = useState({
    fiftyFifty: false,
    askAudience: false,
    phoneFriend: false,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [availableAnswers, setAvailableAnswers] = useState(
    questions[0].answers
  ); // Initial answers

  const backgroundAudio = useRef(new Audio(backgroundMusic));
  const loseAudio = useRef(new Audio(loseMusic));
  const winAudio = useRef(new Audio(winMusic));

  useEffect(() => {
    backgroundAudio.current.loop = true;
    backgroundAudio.current.volume = 0.5;
    return () => backgroundAudio.current.pause();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const newTimer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(newTimer);
    }
  }, [timeLeft, gameStarted]);

  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setTimeLeft(100); // Reset timer to 100 seconds
      setCurrentQuestion(0);
      setCurrentPrizeIndex(0); // Reset to the lowest prize level
      setShowResult(false);
      setLifelinesUsed({
        fiftyFifty: false,
        askAudience: false,
        phoneFriend: false,
      });
      setAvailableAnswers(questions[0].answers);
      playBackgroundMusic();
    } else {
      onRestart();
    }
  };

  const playBackgroundMusic = () => {
    if (backgroundAudio.current.paused) {
      backgroundAudio.current.play().catch((error) => {
        console.error("Error playing background music:", error);
      });
    }
  };

  const stopAllMusic = () => {
    backgroundAudio.current.pause();
    loseAudio.current.pause();
    winAudio.current.pause();
  };

  const handleAnswer = (answer, index) => {
    if (!gameStarted) return; // Do nothing if the game hasn't started yet

    setSelectedAnswer(index);
    if (answer === questions[currentQuestion].correct) {
      setIsCorrect(true);
      setMoveToNextPrize(true); // Correct answer logic
      setCurrentPrizeIndex(currentPrizeIndex + 1); // Update prize ladder after correct answer
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAvailableAnswers(questions[currentQuestion + 1].answers);
          setTimeLeft(100); // Reset the timer to 100 seconds for the new question
          setMoveToNextPrize(false); // Reset moveToNextPrize after each question
        } else {
          stopAllMusic();
          playWinMusic();
          setShowResult(true);
        }
      }, 1000);
    } else {
      setIsCorrect(false);
      stopAllMusic();
      playLoseMusic();
      setTimeout(() => onRestart(), 1000);
    }
  };

  const handleTimeout = () => {
    setIsCorrect(false);
    stopAllMusic();
    playLoseMusic();
    setSelectedAnswer(null);
    setTimeout(() => onRestart(), 1000);
  };

  const onRestart = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setCurrentPrizeIndex(0); // Reset to the lowest prize level
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAvailableAnswers(questions[0].answers);
    setTimeLeft(100); // Reset the timer to 100 seconds
  };

  const playLoseMusic = () => {
    stopAllMusic();
    loseAudio.current.play().catch((error) => {
      console.error("Error playing losing music:", error);
    });
  };

  const playWinMusic = () => {
    stopAllMusic();
    winAudio.current.play().catch((error) => {
      console.error("Error playing winning music:", error);
    });
  };

  return (
    <div className="main-container">
      <div className="home-container">
        {/* Question and answer section */}
        <div className="question-container">
          <h2>{questions[currentQuestion].question}</h2>
          <div className="timer">Time Left: {timeLeft} seconds</div>
          <div className="answers">
            {availableAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer, index)}
                className={
                  selectedAnswer === index
                    ? isCorrect
                      ? "correct"
                      : "incorrect"
                    : ""
                }
                disabled={!gameStarted} // Disable the buttons until the game starts
              >
                {String.fromCharCode(65 + index)}: {answer}
              </button>
            ))}
          </div>
          <Hints
            currentQuestion={currentQuestion}
            lifelinesUsed={lifelinesUsed}
            setLifelinesUsed={setLifelinesUsed}
            questions={questions}
            setAvailableAnswers={setAvailableAnswers}
          />
          <button onClick={startGame}>
            {gameStarted ? "Restart" : "Start Game"}
          </button>
        </div>

        {/* Prize Ladder section */}
      </div>
      <PrizeLadder
        currentPrizeIndex={currentPrizeIndex}
        moveToNextPrize={moveToNextPrize}
      />
    </div>
  );
};

export default Home;
