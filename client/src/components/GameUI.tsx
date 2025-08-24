interface GameUIProps {
  gameState: {
    confusion: number;
    stealth: number;
    timeLeft: number;
    isGameOver: boolean;
    hasWon: boolean;
    isPaused: boolean;
  };
  onRestart: () => void;
  onPause: () => void;
  onMainMenu: () => void;
}

export default function GameUI({ gameState, onRestart, onPause, onMainMenu }: GameUIProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-ui">
      {/* Top HUD */}
      <div className="top-hud">
        <div className="timer">
          <span className="timer-label">TIME</span>
          <span className="timer-value">{formatTime(gameState.timeLeft)}</span>
        </div>
      </div>

      {/* Game Controls - Top Right */}
      <div className="game-controls-top-right">
        <button className="control-btn" onClick={onPause}>
          {gameState.isPaused ? "RESUME" : "PAUSE"}
        </button>
        <button className="control-btn" onClick={onRestart}>RESTART</button>
        <button className="control-btn" onClick={() => onMainMenu()}>MENU</button>
      </div>

      {/* Bottom HUD */}
      <div className="bottom-hud">
        <div className="meter-container">
          <div className="meter confusion-meter">
            <div className="meter-label">CONFUSION</div>
            <div className="meter-bar">
              <div 
                className="meter-fill confusion-fill"
                style={{ width: `${Math.min(gameState.confusion, 100)}%` }}
              />
            </div>
            <div className="meter-value">{Math.round(gameState.confusion)}%</div>
          </div>
          
          <div className="meter stealth-meter">
            <div className="meter-label">STEALTH</div>
            <div className="meter-bar">
              <div 
                className="meter-fill stealth-fill"
                style={{ width: `${Math.max(gameState.stealth, 0)}%` }}
              />
            </div>
            <div className="meter-value">{Math.round(gameState.stealth)}%</div>
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {gameState.isPaused && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h2>GAME PAUSED</h2>
            <p>Press RESUME to continue</p>
          </div>
        </div>
      )}
    </div>
  );
}
