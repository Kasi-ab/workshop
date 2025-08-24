import { forwardRef } from "react";

const GameCanvas = forwardRef<HTMLCanvasElement>((props, ref) => {
  return (
    <canvas
      ref={ref}
      width={800}
      height={600}
      className="game-canvas"
      {...props}
    />
  );
});

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;
