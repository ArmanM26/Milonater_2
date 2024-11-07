import React, { useState, useEffect, useRef } from "react";
import questions from "../questions/questions";
import money from "../money/money";
import Score from "../score/Score";
import Hints from "../hints/hints";
import PrizeLadder from "../prizeLadder/PrizeLadder";
import "./home.css";

// Import your audio files
import backgroundMusic from "../music/backgroundMusic.mp3";
import winMusic from "../music/winMusic.mp3";
import loseMusic from "../music/loseMusic.mp3";

const Home = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(14); // Start at the lowest prize level
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(100); // Timer set to 100 seconds
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
      setTimeLeft(100);
      setCurrentQuestion(0);
      setScore(0);
      setCurrentPrizeIndex(14); // Reset to the lowest prize level
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
    setSelectedAnswer(index);
    if (answer === questions[currentQuestion].correct) {
      setIsCorrect(true);
      setScore(score + 1);
      setCurrentPrizeIndex(14 - score); // Move up the prize ladder

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAvailableAnswers(questions[currentQuestion + 1].answers);
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
    setScore(0);
    setCurrentPrizeIndex(14); // Reset to the lowest prize level
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAvailableAnswers(questions[0].answers);
    setTimeLeft(100);
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
    <div className="home-container">
      <div className="question-container">
        {!showResult ? (
          <>
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

            <div className="score">Score: {score}</div>

            <button onClick={startGame}>
              {gameStarted ? "Restart" : "Start Game"}
            </button>
          </>
        ) : (
          <Score score={score} />
        )}
      </div>
      <div className="prize-ladder-container">
        <PrizeLadder currentPrizeIndex={currentPrizeIndex} />
      </div>
    </div>
  );
};

export default Home;
