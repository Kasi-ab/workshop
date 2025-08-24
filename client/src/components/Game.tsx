import { useEffect, useRef, useState } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import MobileControls from "./MobileControls";
import { GameEngine } from "../lib/game/GameEngine";
import { useIsMobile } from "../hooks/use-is-mobile";

interface GameProps {
  difficulty: string;
  onGameEnd: (won: boolean, difficulty: string) => void;
}

export default function Game({ difficulty, onGameEnd }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState({
    confusion: 0,
    stealth: 100,
    timeLeft: 120, // 2 minutes
    isGameOver: false,
    hasWon: false,
    isPaused: false
  });
  
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize game engine
    const gameEngine = new GameEngine(canvasRef.current);
    gameEngineRef.current = gameEngine;

    // Set up game state update callback
    gameEngine.onStateUpdate = (newState) => {
      setGameState(newState);
    };

    // Set up game end callback
    gameEngine.onGameEnd = (won: boolean) => {
      setGameState(prev => ({ ...prev, isGameOver: true, hasWon: won }));
    };

    // Set difficulty
    gameEngine.setDifficulty(difficulty);

    // Start the game
    gameEngine.start();

    // Cleanup
    return () => {
      gameEngine.stop();
    };
  }, []);

  const handleRestart = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
      setGameState({
        confusion: 0,
        stealth: 100,
        timeLeft: 120,
        isGameOver: false,
        hasWon: false,
        isPaused: false
      });
    }
  };

  const handlePause = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.togglePause();
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }
  };

  const handleMobileInput = (direction: string, pressed: boolean) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.handleMobileInput(direction, pressed);
    }
  };

  return (
    <div className="game-container">
      <div className="scanlines"></div>
      
      <GameCanvas ref={canvasRef} />
      
      <GameUI 
        gameState={gameState}
        onRestart={handleRestart}
        onPause={handlePause}
        onMainMenu={() => onGameEnd(false, difficulty)}
      />

      {isMobile && (
        <MobileControls onInput={handleMobileInput} />
      )}

      {gameState.isGameOver && (
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2 className={gameState.hasWon ? "win-text" : "lose-text"}>
              {gameState.hasWon ? "HACKED SUCCESSFULLY!" : "BUSTED!"}
            </h2>
            <p>
              {gameState.hasWon 
                ? "You created enough confusion to escape!"
                : "The teacher caught you in the act!"
              }
            </p>
            <div className="final-stats">
              <div>Confusion: {Math.round(gameState.confusion)}%</div>
              <div>Stealth: {Math.round(gameState.stealth)}%</div>
              <div>Time Left: {Math.round(gameState.timeLeft)}s</div>
            </div>
            <div className="game-over-buttons">
              <button onClick={handleRestart}>PLAY AGAIN</button>
              <button onClick={() => onGameEnd(gameState.hasWon, difficulty)}>MAIN MENU</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
