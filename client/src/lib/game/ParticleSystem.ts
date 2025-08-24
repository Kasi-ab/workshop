interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
  color: string;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];

  public addParticle(particle: Particle) {
    this.particles.push(particle);
  }

  public addFloatingText(text: string, x: number, y: number, color: string = '#ffffff') {
    this.floatingTexts.push({
      x,
      y,
      text,
      life: 2,
      maxLife: 2,
      color
    });
  }

  public update(deltaTime: number) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.life -= deltaTime;
      
      // Add gravity to some particles
      if (particle.color === '#dddddd') { // dust particles
        particle.vy += 50 * deltaTime;
      }
      
      // Fade out particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const text = this.floatingTexts[i];
      
      text.y -= 30 * deltaTime; // Float upward
      text.life -= deltaTime;
      
      if (text.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    // Render particles
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(
        particle.x - particle.size / 2,
        particle.y - particle.size / 2,
        particle.size,
        particle.size
      );
      ctx.restore();
    });

    // Render floating text
    this.floatingTexts.forEach(text => {
      const alpha = text.life / text.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = text.color;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeText(text.text, text.x, text.y);
      ctx.fillText(text.text, text.x, text.y);
      ctx.restore();
    });
  }

  public clear() {
    this.particles = [];
    this.floatingTexts = [];
  }
}
