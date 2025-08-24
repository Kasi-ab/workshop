export class SpriteRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public drawSprite(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    options: {
      alpha?: number;
      strokeColor?: string;
      strokeWidth?: number;
    } = {}
  ) {
    this.ctx.save();
    
    if (options.alpha !== undefined) {
      this.ctx.globalAlpha = options.alpha;
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);

    if (options.strokeColor && options.strokeWidth) {
      this.ctx.strokeStyle = options.strokeColor;
      this.ctx.lineWidth = options.strokeWidth;
      this.ctx.strokeRect(x, y, width, height);
    }

    this.ctx.restore();
  }

  public drawPixelArt(
    x: number,
    y: number,
    pixels: string[][],
    pixelSize: number = 2
  ) {
    for (let row = 0; row < pixels.length; row++) {
      for (let col = 0; col < pixels[row].length; col++) {
        const color = pixels[row][col];
        if (color && color !== 'transparent') {
          this.ctx.fillStyle = color;
          this.ctx.fillRect(
            x + col * pixelSize,
            y + row * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }

  public drawText(
    text: string,
    x: number,
    y: number,
    options: {
      font?: string;
      color?: string;
      align?: CanvasTextAlign;
      stroke?: boolean;
      strokeColor?: string;
      strokeWidth?: number;
    } = {}
  ) {
    this.ctx.save();

    this.ctx.font = options.font || '16px monospace';
    this.ctx.fillStyle = options.color || '#ffffff';
    this.ctx.textAlign = options.align || 'left';

    if (options.stroke) {
      this.ctx.strokeStyle = options.strokeColor || '#000000';
      this.ctx.lineWidth = options.strokeWidth || 2;
      this.ctx.strokeText(text, x, y);
    }

    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }
}
