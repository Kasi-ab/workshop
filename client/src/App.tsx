import { useState } from "react";
import Game from "./components/Game";
import DifficultySelection from "./components/DifficultySelection";
import "./styles/game.css";

type AppScreen = 'title' | 'difficulty' | 'game';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('title');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('rookie');
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<string[]>(['rookie']);

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setCurrentScreen('game');
  };

  const handleGameEnd = (won: boolean, difficulty: string) => {
    if (won) {
      // Unlock next difficulty
      const difficulties = ['rookie', 'veteran', 'substitute', 'principal'];
      const currentIndex = difficulties.indexOf(difficulty);
      if (currentIndex < difficulties.length - 1) {
        const nextDifficulty = difficulties[currentIndex + 1];
        if (!unlockedDifficulties.includes(nextDifficulty)) {
          setUnlockedDifficulties(prev => [...prev, nextDifficulty]);
        }
      }
    }
    setCurrentScreen('title');
  };

  if (currentScreen === 'title') {
    return (
      <div className="title-screen">
        <div className="scanlines"></div>
        <div className="title-content">
          <h1 className="game-title">CLASS TIME HACKER</h1>
          <div className="subtitle">ESCAPE BEFORE THE BELL RINGS!</div>
          <div className="instructions">
            <p>Use ARROW KEYS or WASD to move</p>
            <p>Complete missions to fill the CONFUSION meter</p>
            <p>Hide behind desks to avoid detection</p>
            <p>Don't let your STEALTH reach zero!</p>
          </div>
          <button 
            className="start-button"
            onClick={() => setCurrentScreen('difficulty')}
          >
            START GAME
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'difficulty') {
    return (
      <DifficultySelection 
        onSelect={handleDifficultySelect}
        onBack={() => setCurrentScreen('title')}
        unlockedDifficulties={unlockedDifficulties}
      />
    );
  }

  return (
    <Game 
      difficulty={selectedDifficulty}
      onGameEnd={handleGameEnd} 
    />
  );
}

export default App;
