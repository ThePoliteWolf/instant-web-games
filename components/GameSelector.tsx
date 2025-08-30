import React from 'react';
import { Game } from '../types';
import { RpsGameIcon, GuessNumberIcon, TicTacToeIcon } from './icons/GameIcons';

interface GameSelectorProps {
  currentGame: Game;
  setCurrentGame: (game: Game) => void;
}

const gameInfo: Record<Game, { icon: JSX.Element }> = {
  [Game.RockPaperScissors]: { icon: <RpsGameIcon /> },
  [Game.GuessTheNumber]: { icon: <GuessNumberIcon /> },
  [Game.TicTacToe]: { icon: <TicTacToeIcon /> },
};


const GameSelector: React.FC<GameSelectorProps> = ({ currentGame, setCurrentGame }) => {
  const games = Object.values(Game);

  return (
    <div className="flex justify-center items-center bg-slate-200/80 rounded-full p-1.5 shadow-inner flex-wrap">
      {games.map((game) => (
        <button
          key={game}
          onClick={() => setCurrentGame(game)}
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm md:px-6 md:py-2 md:text-base font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            currentGame === game
              ? 'bg-white text-indigo-600 shadow-md'
              : 'text-slate-600 hover:bg-slate-300/60'
          }`}
          aria-label={`Select ${game} game`}
        >
          {gameInfo[game].icon}
          <span>{game}</span>
        </button>
      ))}
    </div>
  );
};

export default GameSelector;
