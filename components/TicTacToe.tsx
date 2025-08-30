
import React, { useState, useEffect, useCallback } from 'react';
import { TttSquare } from '../types';
import { getAiTttMove } from '../services/geminiService';

const calculateWinner = (squares: TttSquare[]): TttSquare => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const Square: React.FC<{ value: TttSquare; onClick: () => void; disabled: boolean }> = ({ value, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-20 h-20 md:w-24 md:h-24 bg-slate-200 rounded-lg flex items-center justify-center text-4xl md:text-5xl font-bold transition-colors hover:bg-slate-300 disabled:cursor-not-allowed"
  >
    {value === 'X' && <span className="text-indigo-600">{value}</span>}
    {value === 'O' && <span className="text-pink-500">{value}</span>}
  </button>
);

const TicTacToe: React.FC = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState<TttSquare[]>(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<TttSquare>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const handlePlayerMove = async (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner || !newBoard.includes(null)) {
        // Game ends on player's move, no need for AI to move
        return;
    }

    setLoadingAI(true);
    const aiMove = await getAiTttMove(newBoard);
    
    if (aiMove !== -1) {
      const finalBoard = [...newBoard];
      finalBoard[aiMove] = 'O';
      setBoard(finalBoard);
    }
    setLoadingAI(false);
    setIsPlayerTurn(true);
  };
  
  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setWinner(null);
    setIsDraw(false);
    setLoadingAI(false);
  }, [initialBoard]);

  useEffect(() => {
    const checkGameState = () => {
      const currentWinner = calculateWinner(board);
      if (currentWinner) {
        setWinner(currentWinner);
      } else if (!board.includes(null)) {
        setIsDraw(true);
      }
    };
    checkGameState();
  }, [board]);

  const getStatusMessage = () => {
    if (loadingAI) return "AI is thinking...";
    if (winner) return `Winner: ${winner}!`;
    if (isDraw) return "It's a draw!";
    return isPlayerTurn ? "Your turn (X)" : "AI's turn (O)";
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <h2 className="text-3xl font-bold text-slate-800">Tic-Tac-Toe</h2>
      <p className="text-slate-500 mt-2 mb-6">{getStatusMessage()}</p>

      <div className="grid grid-cols-3 gap-3">
        {board.map((square, i) => (
          <Square 
            key={i} 
            value={square} 
            onClick={() => handlePlayerMove(i)}
            disabled={!isPlayerTurn || loadingAI || !!winner || !!square}
          />
        ))}
      </div>
      
      {(winner || isDraw) && (
        <button
          onClick={resetGame}
          className="mt-8 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default TicTacToe;
