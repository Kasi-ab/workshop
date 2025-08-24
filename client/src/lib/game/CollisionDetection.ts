import { Position } from './Player';

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CollisionDetection {
  public static pointInRect(point: Position, rect: Rectangle): boolean {
    return point.x >= rect.x &&
           point.x <= rect.x + rect.width &&
           point.y >= rect.y &&
           point.y <= rect.y + rect.height;
  }

  public static rectIntersect(rect1: Rectangle, rect2: Rectangle): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  public static distance(pos1: Position, pos2: Position): number {
    return Math.hypot(pos1.x - pos2.x, pos1.y - pos2.y);
  }

  public static lineOfSight(
    from: Position,
    to: Position,
    obstacles: Rectangle[]
  ): boolean {
    // Simple line of sight check - can be improved with proper line-rectangle intersection
    for (const obstacle of obstacles) {
      const center = {
        x: obstacle.x + obstacle.width / 2,
        y: obstacle.y + obstacle.height / 2
      };
      
      // Check if obstacle is between the two points
      const distToObstacle = this.distance(from, center);
      const distTotal = this.distance(from, to);
      const distFromObstacle = this.distance(center, to);
      
      if (Math.abs(distToObstacle + distFromObstacle - distTotal) < 10) {
        return false; // Obstacle blocks line of sight
      }
    }
    
    return true;
  }
}
