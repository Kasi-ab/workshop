interface MobileControlsProps {
  onInput: (direction: string, pressed: boolean) => void;
}

export default function MobileControls({ onInput }: MobileControlsProps) {
  const handleTouchStart = (direction: string) => {
    onInput(direction, true);
  };

  const handleTouchEnd = (direction: string) => {
    onInput(direction, false);
  };

  return (
    <div className="mobile-controls">
      <div className="dpad">
        <button 
          className="dpad-btn up"
          onTouchStart={() => handleTouchStart('up')}
          onTouchEnd={() => handleTouchEnd('up')}
          onMouseDown={() => handleTouchStart('up')}
          onMouseUp={() => handleTouchEnd('up')}
        >
          ↑
        </button>
        <div className="dpad-middle">
          <button 
            className="dpad-btn left"
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
          >
            ←
          </button>
          <button 
            className="dpad-btn right"
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
          >
            →
          </button>
        </div>
        <button 
          className="dpad-btn down"
          onTouchStart={() => handleTouchStart('down')}
          onTouchEnd={() => handleTouchEnd('down')}
          onMouseDown={() => handleTouchStart('down')}
          onMouseUp={() => handleTouchEnd('down')}
        >
          ↓
        </button>
      </div>
    </div>
  );
}
