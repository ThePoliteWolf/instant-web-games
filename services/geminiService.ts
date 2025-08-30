
import { GoogleGenAI } from "@google/genai";
import { RpsChoice, TttSquare } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiRpsChoice = async (): Promise<RpsChoice> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Choose rock, paper, or scissors. Respond with only a single word.",
      config: {
          thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    
    const choice = response.text.toLowerCase().trim();

    if (choice === 'rock' || choice === 'paper' || choice === 'scissors') {
      return choice;
    }
  } catch (error) {
    console.error("Error getting AI choice for RPS:", error);
  }
  
  // Fallback to random choice on error or invalid response
  const choices: RpsChoice[] = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
};

export const getAiTttMove = async (board: TttSquare[]): Promise<number> => {
    const availableSpots = board.map((sq, i) => sq === null ? i : null).filter(i => i !== null);
    if(availableSpots.length === 0) return -1; // Should not happen in a real game flow

    try {
        const prompt = `You are playing Tic-Tac-Toe. You are 'O'. The human is 'X'. The board is an array of 9 items, indexed 0-8. Here is the current board state: [${board.map(cell => cell ? `"${cell}"` : 'null').join(', ')}]. It is your turn. Choose your next move by returning the index (0-8) of an empty (null) square. Respond with only the number of the index. Do not choose an occupied square.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const move = parseInt(response.text.trim(), 10);

        if (!isNaN(move) && availableSpots.includes(move)) {
            return move;
        }

    } catch (error) {
        console.error("Error getting AI move for Tic-Tac-Toe:", error);
    }
    
    // Fallback to random available spot on error or invalid response
    return availableSpots[Math.floor(Math.random() * availableSpots.length)] as number;
};
