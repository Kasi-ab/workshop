import { Position } from './Player';
import { SpriteRenderer } from './SpriteRenderer';

export type TeacherState = 'normal' | 'confused' | 'angry' | 'freakout';

export class Teacher {
  public position: Position;
  public state: TeacherState = 'normal';
  public isAlert = false;
  private patrolPoints: Position[] = [
    { x: 600, y: 150 },
    { x: 700, y: 150 },
    { x: 700, y: 450 },
    { x: 600, y: 450 }
  ];
  private currentPatrolIndex = 0;
  private patrolSpeed = 60;
  private alertTime = 0;
  private maxAlertTime = 3;
  private animationFrame = 0;
  private animationTime = 0;
  private lastPlayerPosition: Position | null = null;
  private detectionRange = 150;
  private alertnessMultiplier = 1.0;

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  public update(deltaTime: number, playerPosition: Position) {
    // Update animation
    this.animationTime += deltaTime;
    if (this.animationTime > 0.3) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTime = 0;
    }

    // Handle alert state
    if (this.isAlert) {
      this.alertTime += deltaTime;
      if (this.alertTime > this.maxAlertTime) {
        this.isAlert = false;
        this.alertTime = 0;
        this.state = 'normal';
      } else {
        // Move towards last known player position
        if (this.lastPlayerPosition) {
          this.moveTowards(this.lastPlayerPosition, deltaTime);
        }
        return;
      }
    }

    // Normal patrol behavior
    this.patrol(deltaTime);
  }

  private patrol(deltaTime: number) {
    // Check if teacher should wait at patrol point
    if (this.patrolDelay > 0) {
      this.patrolDelay -= deltaTime * 1000; // Convert to milliseconds
      return;
    }

    const target = this.patrolPoints[this.currentPatrolIndex];
    const distance = Math.hypot(
      target.x - this.position.x,
      target.y - this.position.y
    );

    if (distance < 10) {
      // Reached patrol point, wait before moving to next
      this.patrolDelay = this.maxPatrolDelay;
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    } else {
      // Move towards current patrol point
      this.moveTowards(target, deltaTime);
    }
  }

  private moveTowards(target: Position, deltaTime: number) {
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 0) {
      const moveX = (dx / distance) * this.patrolSpeed * deltaTime;
      const moveY = (dy / distance) * this.patrolSpeed * deltaTime;
      
      this.position.x += moveX;
      this.position.y += moveY;
    }
  }

  public canSeePlayer(playerPosition: Position, hidingSpots: Position[]): boolean {
    const distance = Math.hypot(
      playerPosition.x - this.position.x,
      playerPosition.y - this.position.y
    );

    // Too far to see (affected by difficulty)
    if (distance > this.detectionRange) return false;

    // Check if player is hiding behind a desk
    for (const spot of hidingSpots) {
      const spotDistance = Math.hypot(
        playerPosition.x - spot.x,
        playerPosition.y - spot.y
      );
      if (spotDistance < 30) return false; // Player is hiding
    }

    // Check line of sight (simplified - no obstacles for now)
    return true;
  }

  public becomeAlert(suspiciousPosition: Position) {
    this.isAlert = true;
    this.alertTime = 0;
    this.lastPlayerPosition = { ...suspiciousPosition };
    this.state = Math.random() > 0.5 ? 'confused' : 'angry';
  }

  public render(ctx: CanvasRenderingContext2D, spriteRenderer: SpriteRenderer) {
    if (!ctx) {
      console.error('Canvas context not available for Teacher rendering');
      return;
    }
    
    const size = 32;
    const x = this.position.x - size / 2;
    const y = this.position.y - size / 2;

    // Body color based on state
    let bodyColor = '#666666';
    if (this.state === 'confused') bodyColor = '#aa6666';
    if (this.state === 'angry') bodyColor = '#cc4444';
    if (this.state === 'freakout') bodyColor = '#ff0000';

    // Body (professional attire)
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 6, y + 12, 20, 20);

    // Head
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(x + 8, y + 4, 16, 10);

    // Hair (gray)
    ctx.fillStyle = '#888888';
    ctx.fillRect(x + 7, y + 3, 18, 6);

    // Glasses
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 10, y + 7, 4, 4);
    ctx.fillRect(x + 18, y + 7, 4, 4);
    ctx.fillRect(x + 14, y + 8, 4, 1);

    // Eyes (expression based on state)
    ctx.fillStyle = '#ffffff';
    if (this.state === 'confused') {
      // Confused expression
      ctx.fillRect(x + 11, y + 8, 2, 2);
      ctx.fillRect(x + 19, y + 8, 2, 2);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 12, y + 8, 1, 1);
      ctx.fillRect(x + 19, y + 8, 1, 1);
    } else if (this.state === 'angry') {
      // Angry expression
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(x + 11, y + 8, 2, 2);
      ctx.fillRect(x + 19, y + 8, 2, 2);
    } else {
      // Normal expression
      ctx.fillRect(x + 11, y + 8, 2, 2);
      ctx.fillRect(x + 19, y + 8, 2, 2);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 12, y + 9, 1, 1);
      ctx.fillRect(x + 20, y + 9, 1, 1);
    }

    // Legs (walking animation)
    ctx.fillStyle = '#444444';
    if (this.isAlert || (this.position.x !== this.patrolPoints[this.currentPatrolIndex]?.x && 
                        this.position.y !== this.patrolPoints[this.currentPatrolIndex]?.y)) {
      const legOffset = Math.sin(this.animationFrame) * 2;
      ctx.fillRect(x + 8 + legOffset, y + 28, 6, 4);
      ctx.fillRect(x + 18 - legOffset, y + 28, 6, 4);
    } else {
      ctx.fillRect(x + 8, y + 28, 6, 4);
      ctx.fillRect(x + 18, y + 28, 6, 4);
    }

    // Alert indicator
    if (this.isAlert) {
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(x + 12, y - 8, 8, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 14, y - 6, 1, 1);
      ctx.fillRect(x + 17, y - 6, 1, 1);
    }

    // Field of vision when alert
    if (this.isAlert) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, 150, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private patrolDelay = 0;
  private maxPatrolDelay = 2000; // 2 seconds default

  public setDifficultySettings(settings: { speed: number; alertness: number; detectionRange: number; patrolDelay: number }) {
    this.patrolSpeed = settings.speed;
    this.alertnessMultiplier = settings.alertness;
    this.detectionRange = settings.detectionRange;
    this.maxPatrolDelay = settings.patrolDelay;
  }

  public reset(x: number, y: number) {
    this.position = { x, y };
    this.state = 'normal';
    this.isAlert = false;
    this.currentPatrolIndex = 0;
    this.alertTime = 0;
    this.animationFrame = 0;
    this.animationTime = 0;
    this.lastPlayerPosition = null;
  }
}
