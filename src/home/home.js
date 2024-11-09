import React, { useState, useEffect, useRef } from "react";
import questionsData from "../questions/questions";
import Hints from "../hints/hints";
import PrizeLadder from "../prizeLadder/PrizeLadder";
import "./home.css";

// Import audio files
import backgroundMusic from "../music/backgroundMusic.mp3";
import winMusic from "../music/winMusic.mp3";
import loseMusic from "../music/loseMusic.mp3";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(100);
  const [moveToNextPrize, setMoveToNextPrize] = useState(false);
  const [lifelinesUsed, setLifelinesUsed] = useState({
    fiftyFifty: false,
    askAudience: false,
    phoneFriend: false,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [availableAnswers, setAvailableAnswers] = useState([]);

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
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, gameStarted]);

  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setQuestions(shuffleQuestions(questionsData).slice(0, 15));
      setTimeLeft(100);
      setCurrentQuestion(0);
      setCurrentPrizeIndex(0);
      setShowResult(false);
      setLifelinesUsed({
        fiftyFifty: false,
        askAudience: false,
        phoneFriend: false,
      });
      setAvailableAnswers(shuffleQuestions(questionsData[0].answers));
      playBackgroundMusic();
    } else {
      onRestart();
    }
  };

  const shuffleQuestions = (questionsArray) => {
    return questionsArray.sort(() => Math.random() - 0.5);
  };

  const playBackgroundMusic = () => {
    if (backgroundAudio.current.paused) {
      backgroundAudio.current.play().catch((error) => {
        console.error("Error playing background music:", error);
      });
    }
  };

  const stopBackgroundMusic = () => {
    backgroundAudio.current.pause();
  };

  const handleAnswer = (answer, index) => {
    if (!gameStarted) return;

    setSelectedAnswer(index);
    if (answer === questions[currentQuestion].correct) {
      setIsCorrect(true);
      setMoveToNextPrize(true);
      setCurrentPrizeIndex(currentPrizeIndex + 1);
      stopBackgroundMusic(); // Stop background music only
      playWinMusic();

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAvailableAnswers(
            shuffleQuestions(questions[currentQuestion + 1].answers)
          );
          setTimeLeft(100); // Reset timer for next question
          setMoveToNextPrize(false);
          playBackgroundMusic(); // Resume background music for next question
        } else {
          setShowResult(true);
        }
      }, 1000);
    } else {
      setIsCorrect(false);
      stopBackgroundMusic();
      playLoseMusic();
      setTimeout(() => onRestart(), 1000);
    }
  };

  const handleTimeout = () => {
    setIsCorrect(false);
    stopBackgroundMusic();
    playLoseMusic();
    setSelectedAnswer(null);
    setTimeout(() => onRestart(), 1000);
  };

  const onRestart = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setCurrentPrizeIndex(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(100);
  };

  const playLoseMusic = () => {
    loseAudio.current.play().catch((error) => {
      console.error("Error playing losing music:", error);
    });
  };

  const playWinMusic = () => {
    winAudio.current.play().catch((error) => {
      console.error("Error playing winning music:", error);
    });
  };

  return (
    <div className="main-container">
      <div className="home-container">
        <div className="question-container">
          <h2>{questions[currentQuestion]?.question}</h2>
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
                disabled={!gameStarted}
              >
                {String.fromCharCode(65 + index)}: {answer}
              </button>
            ))}
          </div>
          {gameStarted && (
            <Hints
              currentQuestion={currentQuestion}
              lifelinesUsed={lifelinesUsed}
              setLifelinesUsed={setLifelinesUsed}
              questions={questions}
              setAvailableAnswers={setAvailableAnswers}
            />
          )}
          <button onClick={startGame}>
            {gameStarted ? "Restart" : "Start Game"}
          </button>
        </div>

        {showResult && (
          <div className="result">
            Congratulations! You've completed the game!
          </div>
        )}
      </div>
      <PrizeLadder
        currentPrizeIndex={currentPrizeIndex}
        moveToNextPrize={moveToNextPrize}
      />
    </div>
  );
};

export default Home;
