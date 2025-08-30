
import React, { useState, useCallback } from 'react';
import { RpsChoice } from '../types';
import { getAiRpsChoice } from '../services/geminiService';
import { RockIcon, PaperIcon, ScissorsIcon } from './icons/RpsIcons';

type Result = 'You Win!' | 'You Lose!' | 'It\'s a Draw!' | null;

const choices: { name: RpsChoice; icon: JSX.Element }[] = [
  { name: 'rock', icon: <RockIcon /> },
  { name: 'paper', icon: <PaperIcon /> },
  { name: 'scissors', icon: <ScissorsIcon /> },
];

const ChoiceButton: React.FC<{ choice: RpsChoice; icon: JSX.Element; onSelect: (choice: RpsChoice) => void; disabled: boolean;}> = ({ choice, icon, onSelect, disabled }) => (
  <button
    onClick={() => onSelect(choice)}
    disabled={disabled}
    className="bg-white p-4 rounded-full shadow-lg border-4 border-transparent hover:border-indigo-500 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-transparent"
    aria-label={`Choose ${choice}`}
  >
    {icon}
  </button>
);

const ResultDisplay: React.FC<{ userChoice: RpsChoice | null, aiChoice: RpsChoice | null, result: Result }> = ({ userChoice, aiChoice, result }) => {
    if (!userChoice) return null;

    const userIcon = choices.find(c => c.name === userChoice)?.icon;
    const aiIcon = aiChoice ? choices.find(c => c.name === aiChoice)?.icon : <div className="w-20 h-20 bg-slate-200 rounded-full animate-pulse"></div>;
    
    return (
        <div className="mt-8 flex flex-col items-center">
            <div className="flex items-center justify-around w-full max-w-sm">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-slate-700 mb-2">You</span>
                    <div className="w-24 h-24 flex items-center justify-center">{userIcon}</div>
                </div>
                <span className="text-4xl font-bold text-slate-400">VS</span>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-slate-700 mb-2">AI</span>
                    <div className="w-24 h-24 flex items-center justify-center">{aiIcon}</div>
                </div>
            </div>
            {result && (
                <div className="mt-8 text-center animate-fade-in">
                    <p className={`text-4xl font-bold ${
                        result === 'You Win!' ? 'text-green-500' :
                        result === 'You Lose!' ? 'text-red-500' : 'text-slate-600'
                    }`}>{result}</p>
                </div>
            )}
        </div>
    );
};

const RockPaperScissors: React.FC = () => {
  const [userChoice, setUserChoice] = useState<RpsChoice | null>(null);
  const [aiChoice, setAiChoice] = useState<RpsChoice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const determineWinner = useCallback((user: RpsChoice, ai: RpsChoice): Result => {
    if (user === ai) return 'It\'s a Draw!';
    if (
      (user === 'rock' && ai === 'scissors') ||
      (user === 'scissors' && ai === 'paper') ||
      (user === 'paper' && ai === 'rock')
    ) {
      return 'You Win!';
    }
    return 'You Lose!';
  }, []);

  const playGame = async (choice: RpsChoice) => {
    setLoading(true);
    setUserChoice(choice);
    setAiChoice(null);
    setResult(null);

    const aiGeneratedChoice = await getAiRpsChoice();
    setAiChoice(aiGeneratedChoice);
    setResult(determineWinner(choice, aiGeneratedChoice));
    setLoading(false);
  };
  
  const resetGame = () => {
      setUserChoice(null);
      setAiChoice(null);
      setResult(null);
  }

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <h2 className="text-3xl font-bold text-slate-800">Rock Paper Scissors</h2>
      <p className="text-slate-500 mt-2 mb-8">Make your choice to challenge the AI!</p>
      
      {!userChoice && (
        <div className="flex items-center justify-center gap-6 md:gap-10">
          {choices.map(({ name, icon }) => (
            <ChoiceButton key={name} choice={name} icon={icon} onSelect={playGame} disabled={loading} />
          ))}
        </div>
      )}

      {loading && !result && <div className="mt-8 text-indigo-600">AI is thinking...</div>}

      <ResultDisplay userChoice={userChoice} aiChoice={aiChoice} result={result} />

      {result && <button onClick={resetGame} className="mt-8 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Play Again</button>}

    </div>
  );
};

export default RockPaperScissors;
