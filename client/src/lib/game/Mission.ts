import { Position } from './Player';
import { SpriteRenderer } from './SpriteRenderer';

export type MissionType = 'clock' | 'chalk' | 'bell' | 'paper';

export class Mission {
  public type: MissionType;
  public position: Position;
  public name: string;
  public isCompleted = false;
  public isOnCooldown = false;
  public canInteract = false;
  private cooldownTime = 0;
  private maxCooldownTime = 5; // 5 seconds
  private pulseTime = 0;

  constructor(type: MissionType, position: Position, name: string) {
    this.type = type;
    this.position = position;
    this.name = name;
  }

  public update(deltaTime: number) {
    this.pulseTime += deltaTime;

    if (this.isOnCooldown) {
      this.cooldownTime += deltaTime;
      if (this.cooldownTime >= this.maxCooldownTime) {
        this.isOnCooldown = false;
        this.cooldownTime = 0;
        this.isCompleted = false;
      }
    }
  }

  public complete() {
    this.isCompleted = true;
    this.isOnCooldown = true;
    this.cooldownTime = 0;
  }

  public render(ctx: CanvasRenderingContext2D, spriteRenderer: SpriteRenderer) {
    if (!ctx) {
      console.error('Canvas context not available for Mission rendering');
      return;
    }
    
    const x = this.position.x - 16;
    const y = this.position.y - 16;
    const size = 32;

    // Pulsing effect for available missions
    const pulse = this.isOnCooldown ? 0.5 : 0.8 + Math.sin(this.pulseTime * 4) * 0.2;
    const alpha = this.isCompleted ? 0.3 : pulse;

    ctx.save();
    ctx.globalAlpha = alpha;

    switch (this.type) {
      case 'clock':
        // Wall clock
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 4, y + 4, 24, 24);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 6, y + 6, 20, 20);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 15, y + 8, 2, 8);
        ctx.fillRect(x + 15, y + 16, 6, 2);
        break;

      case 'chalk':
        // Blackboard with chalk
        ctx.fillStyle = '#2F4F2F';
        ctx.fillRect(x, y + 8, size, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 4, y + 12, 4, 8);
        ctx.fillRect(x + 12, y + 10, 16, 2);
        ctx.fillRect(x + 12, y + 14, 12, 2);
        ctx.fillRect(x + 12, y + 18, 8, 2);
        break;

      case 'bell':
        // Intercom/speaker
        ctx.fillStyle = '#696969';
        ctx.fillRect(x + 6, y + 6, 20, 20);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 10, y + 10, 12, 12);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x + 14, y + 4, 4, 4);
        break;

      case 'paper':
        // Desk with paper
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y + 16, size, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 8, y + 8, 16, 12);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 10, y + 10, 12, 2);
        ctx.fillRect(x + 10, y + 14, 8, 2);
        break;
    }

    // Interaction indicator - only show when player can interact
    if (!this.isCompleted && !this.isOnCooldown && this.canInteract) {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(x + 12, y - 4, 8, 4);
      ctx.fillStyle = '#000000';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('E', x + 16, y - 1);
      
      // Highlight border when interactive
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, size + 4, size + 4);
    }

    // Proximity indicator when player is getting close but not quite ready
    if (!this.isCompleted && !this.isOnCooldown && !this.canInteract) {
      // Dim outline to show it's a mission object
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, size, size);
    }

    // Cooldown indicator
    if (this.isOnCooldown) {
      const progress = this.cooldownTime / this.maxCooldownTime;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(x, y + 28, size * progress, 4);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(x, y + 28, size, 4);
    }

    ctx.restore();
  }

  public setCanInteract(canInteract: boolean) {
    this.canInteract = canInteract;
  }

  public reset() {
    this.isCompleted = false;
    this.isOnCooldown = false;
    this.canInteract = false;
    this.cooldownTime = 0;
    this.pulseTime = 0;
  }
}
