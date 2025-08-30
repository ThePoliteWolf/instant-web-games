
import React from 'react';
import { Game } from '../types';

interface GameSelectorProps {
  currentGame: Game;
  setCurrentGame: (game: Game) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ currentGame, setCurrentGame }) => {
  const games = Object.values(Game);

  return (
    <div className="flex justify-center items-center bg-slate-200/80 rounded-full p-1.5 shadow-inner">
      {games.map((game) => (
        <button
          key={game}
          onClick={() => setCurrentGame(game)}
          className={`px-4 py-2 text-sm md:px-6 md:py-2 md:text-base font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            currentGame === game
              ? 'bg-white text-indigo-600 shadow-md'
              : 'text-slate-600 hover:bg-slate-300/60'
          }`}
        >
          {game}
        </button>
      ))}
    </div>
  );
};

export default GameSelector;
