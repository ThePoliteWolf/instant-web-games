
import React, { useState, useEffect, useCallback } from 'react';

const GuessTheNumber: React.FC = () => {
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isNewGame, setIsNewGame] = useState(true);

  const startNewGame = useCallback(() => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setFeedback('');
    setAttempts(0);
    setGameOver(false);
    setIsNewGame(true);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) return;

    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess)) {
      setFeedback('Please enter a valid number.');
      return;
    }
    
    setIsNewGame(false);
    setAttempts(prev => prev + 1);

    if (numGuess < secretNumber) {
      setFeedback('Too low! Try again.');
    } else if (numGuess > secretNumber) {
      setFeedback('Too high! Try again.');
    } else {
      setFeedback(`You got it in ${attempts + 1} attempts!`);
      setGameOver(true);
    }
    setGuess('');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <h2 className="text-3xl font-bold text-slate-800">Guess The Number</h2>
      <p className="text-slate-500 mt-2 mb-8">I'm thinking of a number between 1 and 100.</p>
      
      <form onSubmit={handleGuess} className="flex flex-col items-center gap-4 w-full max-w-xs">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={gameOver}
          className="w-full text-center text-2xl p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Your guess"
        />
        <button
          type="submit"
          disabled={gameOver}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400"
        >
          Guess
        </button>
      </form>
      
      {!isNewGame && (
          <div className="mt-6 p-4 bg-slate-100 rounded-lg w-full max-w-xs min-h-[50px] flex items-center justify-center">
            <p className={`text-lg font-semibold ${
                gameOver ? 'text-green-600' : 'text-slate-700'
            }`}>
              {feedback}
            </p>
          </div>
      )}

      {gameOver && (
        <button
          onClick={startNewGame}
          className="mt-6 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default GuessTheNumber;
