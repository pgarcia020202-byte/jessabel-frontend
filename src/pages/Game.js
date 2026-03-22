import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  const gameData = [
    {
      question: "Which art style uses geometric shapes and bright colors?",
      options: ["Cubism", "Baroque", "Impressionism", "Renaissance"],
      answer: 0
    },
    {
      question: "Which tool is commonly used for digital drawing?",
      options: ["Paintbrush", "Tablet", "Pencil", "Spray"],
      answer: 1
    },
    {
      question: "What is 7 x 3?",
      options: ["20", "21", "24", "18"],
      answer: 1
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      answer: 2
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [resultColor, setResultColor] = useState('black');
  const [gameOver, setGameOver] = useState(false);

  const currentData = gameData[currentIndex];

  useEffect(() => {
    setSelectedOption(null);
    setResult('');
  }, [currentIndex]);

  const selectOption = (idx) => {
    setSelectedOption(idx);
  };

  const submitAnswer = () => {
    if (selectedOption === null) return;

    if (selectedOption === currentData.answer) {
      setScore(score + 1);
      setResult('Correct!');
      setResultColor('green');
    } else {
      setResult(`Wrong! Correct answer: ${currentData.options[currentData.answer]}`);
      setResultColor('red');
    }

    setSelectedOption(null);

    setTimeout(() => {
      if (currentIndex < gameData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameOver(true);
        setResult(`Your final score is ${score + (selectedOption === currentData.answer ? 1 : 0)} out of ${gameData.length}.`);
        setResultColor('black');
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setResult('');
    setResultColor('black');
    setGameOver(false);
  };

  return (
    <div className="game-page">
      <div className="game-container">
        <div className="game-logo">🎮 ArtVision Games</div>
        
        {!gameOver ? (
          <>
            <h2>{currentData.question}</h2>
            <div className="options">
              {currentData.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`option ${selectedOption === idx ? 'selected' : ''}`}
                  onClick={() => selectOption(idx)}
                >
                  {option}
                </div>
              ))}
            </div>
            <button 
              onClick={submitAnswer} 
              disabled={selectedOption === null}
            >
              Submit Answer
            </button>
            {result && <div id="result" style={{ color: resultColor }}>{result}</div>}
          </>
        ) : (
          <>
            <h2>Game Over!</h2>
            <div id="result" style={{ color: resultColor }}>{result}</div>
            <button onClick={resetGame}>Play Again</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
