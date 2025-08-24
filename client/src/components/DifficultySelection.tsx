interface DifficultySelectionProps {
  onSelect: (difficulty: string) => void;
  onBack: () => void;
  unlockedDifficulties: string[];
}

export default function DifficultySelection({ onSelect, onBack, unlockedDifficulties }: DifficultySelectionProps) {
  const difficulties = [
    { 
      id: 'rookie', 
      name: 'ROOKIE TEACHER', 
      description: 'Slow, predictable patrol. Perfect for beginners.',
      color: '#00ff00'
    },
    { 
      id: 'veteran', 
      name: 'VETERAN TEACHER', 
      description: 'Faster movement, better detection. Requires strategy.',
      color: '#ffaa00'
    },
    { 
      id: 'substitute', 
      name: 'SUBSTITUTE TEACHER', 
      description: 'Paranoid and unpredictable. Random patrol patterns.',
      color: '#ff6600'
    },
    { 
      id: 'principal', 
      name: 'PRINCIPAL MODE', 
      description: 'Multiple enemies, security cameras. Ultimate challenge.',
      color: '#ff0000'
    }
  ];

  return (
    <div className="difficulty-screen">
      <div className="scanlines"></div>
      <div className="difficulty-content">
        <h1 className="difficulty-title">SELECT DIFFICULTY</h1>
        <div className="subtitle">Choose your challenge level</div>
        
        <div className="difficulties-grid">
          {difficulties.map((diff, index) => {
            const isUnlocked = unlockedDifficulties.includes(diff.id);
            const isLocked = !isUnlocked;
            
            return (
              <div 
                key={diff.id}
                className={`difficulty-card ${isLocked ? 'locked' : ''}`}
                onClick={() => isUnlocked && onSelect(diff.id)}
              >
                <div className="difficulty-icon" style={{ color: diff.color }}>
                  {isLocked ? '🔒' : ['👨‍🏫', '👩‍🏫', '🤦‍♀️', '👮‍♂️'][index]}
                </div>
                <h3 className="difficulty-name" style={{ color: diff.color }}>
                  {diff.name}
                </h3>
                <p className="difficulty-desc">
                  {isLocked ? 'Complete previous difficulty to unlock' : diff.description}
                </p>
                {isUnlocked && (
                  <div className="difficulty-indicator">
                    PRESS TO SELECT
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="difficulty-controls">
          <button className="back-button" onClick={onBack}>
            BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}