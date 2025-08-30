
import React, { useState } from 'react';
import { Game } from './types';
import GameSelector from './components/GameSelector';
import RockPaperScissors from './components/RockPaperScissors';
import GuessTheNumber from './components/GuessTheNumber';
import TicTacToe from './components/TicTacToe';

const App: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<Game>(Game.RockPaperScissors);

  const renderGame = () => {
    switch (currentGame) {
      case Game.RockPaperScissors:
        return <RockPaperScissors />;
      case Game.GuessTheNumber:
        return <GuessTheNumber />;
      case Game.TicTacToe:
        return <TicTacToe />;
      default:
        return <RockPaperScissors />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Instant Web Games
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            A collection of simple games powered by AI
          </p>
        </header>

        <GameSelector currentGame={currentGame} setCurrentGame={setCurrentGame} />

        <main className="mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-h-[400px]">
            {renderGame()}
          </div>
        </main>

        <footer className="text-center mt-8 text-slate-400 text-sm">
          <p>Built by a world-class senior frontend React engineer.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
