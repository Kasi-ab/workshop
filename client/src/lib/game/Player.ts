import { InputManager } from './InputManager';
import { SpriteRenderer } from './SpriteRenderer';

export interface Position {
  x: number;
  y: number;
}

export class Player {
  public position: Position;
  public velocity: Position = { x: 0, y: 0 };
  public isHiding = false;
  private speed = 120; // pixels per second
  private animationFrame = 0;
  private animationTime = 0;
  private facing = 'down'; // up, down, left, right

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  public update(deltaTime: number, inputManager: InputManager) {
    // Reset velocity
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.isHiding = false;

    // Handle movement input
    if (inputManager.isPressed('up')) {
      this.velocity.y = -this.speed;
      this.facing = 'up';
    }
    if (inputManager.isPressed('down')) {
      this.velocity.y = this.speed;
      this.facing = 'down';
    }
    if (inputManager.isPressed('left')) {
      this.velocity.x = -this.speed;
      this.facing = 'left';
    }
    if (inputManager.isPressed('right')) {
      this.velocity.x = this.speed;
      this.facing = 'right';
    }

    // Check if hiding behind desk (simple check for now)
    const deskPositions = [
      { x: 150, y: 200 }, { x: 250, y: 200 }, { x: 350, y: 200 },
      { x: 150, y: 300 }, { x: 250, y: 300 }, { x: 350, y: 300 },
      { x: 150, y: 400 }, { x: 250, y: 400 }, { x: 350, y: 400 }
    ];

    for (const desk of deskPositions) {
      const distance = Math.hypot(this.position.x - desk.x, this.position.y - desk.y);
      if (distance < 30) {
        this.isHiding = true;
        break;
      }
    }

    // Update position
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Keep player in bounds
    this.position.x = Math.max(16, Math.min(784, this.position.x));
    this.position.y = Math.max(16, Math.min(584, this.position.y));

    // Update animation
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.animationTime += deltaTime;
      if (this.animationTime > 0.2) {
        this.animationFrame = (this.animationFrame + 1) % 4;
        this.animationTime = 0;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, spriteRenderer: SpriteRenderer) {
    if (!ctx) {
      console.error('Canvas context not available for Player rendering');
      return;
    }
    
    // Draw player sprite (simplified pixel art)
    const size = 32;
    const x = this.position.x - size / 2;
    const y = this.position.y - size / 2;

    // Body (blue uniform)
    ctx.fillStyle = this.isHiding ? '#2244aa' : '#3366cc';
    ctx.fillRect(x + 8, y + 12, 16, 20);

    // Head (skin tone)
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(x + 10, y + 4, 12, 10);

    // Hair (brown)
    ctx.fillStyle = '#664422';
    ctx.fillRect(x + 9, y + 3, 14, 6);

    // Backpack
    ctx.fillStyle = '#aa4444';
    ctx.fillRect(x + 6, y + 14, 4, 8);
    ctx.fillRect(x + 22, y + 14, 4, 8);

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 12, y + 7, 2, 2);
    ctx.fillRect(x + 18, y + 7, 2, 2);

    // Movement animation (simple leg movement)
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      const legOffset = Math.sin(this.animationFrame) * 2;
      ctx.fillStyle = '#2244aa';
      ctx.fillRect(x + 10 + legOffset, y + 28, 4, 4);
      ctx.fillRect(x + 18 - legOffset, y + 28, 4, 4);
    } else {
      // Static legs
      ctx.fillStyle = '#2244aa';
      ctx.fillRect(x + 10, y + 28, 4, 4);
      ctx.fillRect(x + 18, y + 28, 4, 4);
    }

    // Hiding indicator
    if (this.isHiding) {
      ctx.strokeStyle = '#44ff44';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, size + 4, size + 4);
    }
  }

  public reset(x: number, y: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.isHiding = false;
    this.animationFrame = 0;
    this.animationTime = 0;
    this.facing = 'down';
  }
}
