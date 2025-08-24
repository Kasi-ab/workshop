import { Position } from './Player';
import { SpriteRenderer } from './SpriteRenderer';

export class Classroom {
  private desks: Position[] = [
    { x: 150, y: 200 }, { x: 250, y: 200 }, { x: 350, y: 200 },
    { x: 150, y: 300 }, { x: 250, y: 300 }, { x: 350, y: 300 },
    { x: 150, y: 400 }, { x: 250, y: 400 }, { x: 350, y: 400 }
  ];

  public getHidingSpots(): Position[] {
    return this.desks;
  }

  public render(ctx: CanvasRenderingContext2D, spriteRenderer: SpriteRenderer) {
    if (!ctx) {
      console.error('Canvas context not available for Classroom rendering');
      return;
    }
    
    // Floor
    ctx.fillStyle = '#f5f5dc';
    ctx.fillRect(0, 0, 800, 600);

    // Floor tiles pattern
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    for (let y = 0; y < 600; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // Walls
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, 800, 80); // Top wall
    ctx.fillRect(0, 0, 80, 600); // Left wall

    // Blackboard
    ctx.fillStyle = '#2F4F2F';
    ctx.fillRect(300, 20, 200, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MATH CLASS', 400, 40);
    ctx.fillText('2 + 2 = ?', 400, 55);

    // Teacher's desk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(500, 120, 80, 40);
    
    // Student desks
    this.desks.forEach(desk => {
      ctx.fillStyle = '#CD853F';
      ctx.fillRect(desk.x - 20, desk.y - 15, 40, 30);
      
      // Chair
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(desk.x - 15, desk.y + 20, 30, 8);
    });

    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(20, 200, 40, 80);
    ctx.fillRect(20, 320, 40, 80);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 200, 40, 80);
    ctx.strokeRect(20, 320, 40, 80);

    // Door
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(720, 250, 60, 100);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(765, 295, 8, 8);

    // Wall Clock (top right)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(730, 60, 40, 40);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(735, 65, 30, 30);
    ctx.fillStyle = '#000000';
    ctx.fillRect(748, 68, 4, 12);
    ctx.fillRect(748, 80, 8, 4);

    // Intercom (top left corner)
    ctx.fillStyle = '#696969';
    ctx.fillRect(30, 30, 40, 40);
    ctx.fillStyle = '#000000';
    ctx.fillRect(35, 35, 30, 30);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(45, 25, 10, 8);
  }
}
