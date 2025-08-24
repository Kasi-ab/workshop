import { GameState } from './GameState';
import { Player } from './Player';
import { Teacher } from './Teacher';
import { Classroom } from './Classroom';
import { Mission } from './Mission';
import { ParticleSystem } from './ParticleSystem';
import { InputManager } from './InputManager';
import { SpriteRenderer } from './SpriteRenderer';
import { CollisionDetection } from './CollisionDetection';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState: GameState;
  private player: Player;
  private teacher: Teacher;
  private classroom: Classroom;
  private missions: Mission[];
  private particleSystem: ParticleSystem;
  private inputManager: InputManager;
  private spriteRenderer: SpriteRenderer;
  private collisionDetection: CollisionDetection;
  
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private deltaTime = 0;
  
  public onStateUpdate?: (state: any) => void;
  public onGameEnd?: (won: boolean) => void;
  private difficulty: string = 'rookie';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D canvas context');
    }
    this.ctx = context;
    
    // Initialize game systems
    this.gameState = new GameState();
    this.inputManager = new InputManager();
    this.spriteRenderer = new SpriteRenderer(this.ctx);
    this.collisionDetection = new CollisionDetection();
    this.particleSystem = new ParticleSystem();
    this.classroom = new Classroom();
    
    // Initialize game objects
    this.player = new Player(100, 300);
    this.teacher = new Teacher(600, 200);
    this.missions = this.createMissions();
    
    // Set up canvas
    this.setupCanvas();
  }

  private setupCanvas() {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.ctx.imageSmoothingEnabled = false; // Pixel perfect rendering
  }

  private createMissions(): Mission[] {
    return [
      new Mission('clock', { x: 750, y: 80 }, 'Clock Hack'), // Near wall clock
      new Mission('chalk', { x: 400, y: 50 }, 'Chalk Drop'), // Near blackboard
      new Mission('bell', { x: 50, y: 50 }, 'Fake Bell'), // Near intercom
      new Mission('paper', { x: 250, y: 200 }, 'Paper Airplane') // Near student desks
    ];
  }

  public start() {
    this.gameLoop(0);
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public restart() {
    this.gameState.reset();
    this.player.reset(100, 300);
    this.teacher.reset(600, 200);
    this.particleSystem.clear();
    this.missions.forEach(mission => mission.reset());
    
    // Reapply difficulty settings when restarting
    if (this.difficulty) {
      this.setDifficulty(this.difficulty);
    }
  }

  public togglePause() {
    this.gameState.togglePause();
  }

  public handleMobileInput(direction: string, pressed: boolean) {
    this.inputManager.setMobileInput(direction, pressed);
  }

  public setDifficulty(difficulty: string) {
    this.difficulty = difficulty;
    
    // Apply difficulty settings to teacher
    const difficultySettings: { [key: string]: { speed: number; alertness: number; detectionRange: number; patrolDelay: number } } = {
      'rookie': { speed: 40, alertness: 1.0, detectionRange: 80, patrolDelay: 3000 },
      'veteran': { speed: 60, alertness: 1.3, detectionRange: 100, patrolDelay: 2000 },
      'substitute': { speed: 80, alertness: 1.6, detectionRange: 120, patrolDelay: 1000 },
      'principal': { speed: 100, alertness: 2.0, detectionRange: 140, patrolDelay: 500 }
    };
    
    const settings = difficultySettings[difficulty] || difficultySettings['rookie'];
    this.teacher.setDifficultySettings(settings);
  }

  private gameLoop = (currentTime: number) => {
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (!this.gameState.isPaused && !this.gameState.isGameOver) {
      this.update();
    }
    
    this.render();
    
    // Update UI
    if (this.onStateUpdate) {
      this.onStateUpdate({
        confusion: this.gameState.confusion,
        stealth: this.gameState.stealth,
        timeLeft: this.gameState.timeLeft,
        isGameOver: this.gameState.isGameOver,
        hasWon: this.gameState.hasWon,
        isPaused: this.gameState.isPaused
      });
    }

    // Check win/lose conditions
    if (!this.gameState.isGameOver) {
      if (this.gameState.confusion >= 100) {
        this.gameState.setGameWon();
        this.onGameEnd?.(true);
      } else if (this.gameState.stealth <= 0 || this.gameState.timeLeft <= 0) {
        this.gameState.setGameLost();
        this.onGameEnd?.(false);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update() {
    // Update timer
    this.gameState.updateTimer(this.deltaTime);
    
    // Update input
    this.inputManager.update();
    
    // Update player
    this.player.update(this.deltaTime, this.inputManager);
    
    // Update teacher AI
    this.teacher.update(this.deltaTime, this.player.position);
    
    // Check if player is detected
    if (this.teacher.canSeePlayer(this.player.position, this.classroom.getHidingSpots())) {
      const stealthPenalty = 30 * this.deltaTime;
      this.gameState.decreaseStealth(stealthPenalty);
      
      // Add confusion penalty based on difficulty (punishment mechanic)
      if (stealthPenalty > 0) {
        const confusionPenalty: { [key: string]: number } = {
          'rookie': 3,
          'veteran': 6, 
          'substitute': 9,
          'principal': 12
        };
        
        const penalty = confusionPenalty[this.difficulty] || confusionPenalty['rookie'];
        this.gameState.decreaseConfusion(penalty * this.deltaTime);
        
        // Add "CAUGHT!" floating text
        this.particleSystem.addFloatingText("CAUGHT!", this.player.position.x, this.player.position.y - 20, '#ff4444');
      }
    } else if (this.player.isHiding) {
      // Slowly recover stealth when hiding
      this.gameState.increaseStealth(10 * this.deltaTime);
    }
    
    // Check mission interactions with proximity requirements
    this.missions.forEach(mission => {
      if (!mission.isCompleted && !mission.isOnCooldown) {
        const canInteract = this.checkMissionProximity(mission);
        mission.setCanInteract(canInteract);
        
        if (canInteract && this.inputManager.isActionPressed()) {
          this.completeMission(mission);
        }
      }
      mission.update(this.deltaTime);
    });
    
    // Update particles
    this.particleSystem.update(this.deltaTime);
  }

  private completeMission(mission: Mission) {
    mission.complete();
    
    // Enhanced risk vs reward calculation
    const teacherDistance = Math.hypot(
      this.teacher.position.x - mission.position.x,
      this.teacher.position.y - mission.position.y
    );
    
    // Base confusion values by mission type
    const baseMissionValues = {
      'clock': 20,    // Higher value for complex hack
      'chalk': 15,    // Medium value
      'bell': 25,     // Highest value for school-wide disruption
      'paper': 10     // Lower value but easier/safer
    };
    
    const baseConfusion = baseMissionValues[mission.type] || 15;
    
    // Risk bonus calculation - closer to teacher = higher risk = higher reward
    let riskMultiplier = 1;
    if (teacherDistance < 100) {
      riskMultiplier = 2.5;  // Very high risk
      this.particleSystem.addFloatingText("EXTREME RISK!", mission.position.x, mission.position.y - 50, '#ff0000');
    } else if (teacherDistance < 150) {
      riskMultiplier = 1.8;  // High risk
      this.particleSystem.addFloatingText("HIGH RISK!", mission.position.x, mission.position.y - 50, '#ff8800');
    } else if (teacherDistance < 200) {
      riskMultiplier = 1.3;  // Medium risk
      this.particleSystem.addFloatingText("RISKY!", mission.position.x, mission.position.y - 50, '#ffaa00');
    }
    
    const totalConfusion = Math.round(baseConfusion * riskMultiplier);
    this.gameState.increaseConfusion(totalConfusion);
    
    // Add particle effects
    this.addMissionParticles(mission);
    
    // Add floating text with color based on bonus
    const textColor = riskMultiplier > 2 ? '#ffff00' : riskMultiplier > 1.5 ? '#44ff44' : '#88ff88';
    this.particleSystem.addFloatingText(
      `+${totalConfusion} CONFUSION!`,
      mission.position.x,
      mission.position.y - 30,
      textColor
    );
    
    // Teacher alertness based on proximity and mission type
    if (teacherDistance < 200) {
      this.teacher.becomeAlert(mission.position);
      this.particleSystem.addFloatingText("DETECTED!", this.teacher.position.x, this.teacher.position.y - 30, '#ff4444');
      
      // Extra stealth penalty for risky missions
      const stealthPenalty = Math.max(0, (200 - teacherDistance) / 4);
      this.gameState.decreaseStealth(stealthPenalty);
    }
  }

  private addMissionParticles(mission: Mission) {
    const { x, y } = mission.position;
    
    switch (mission.type) {
      case 'clock':
        // Sparks effect
        for (let i = 0; i < 15; i++) {
          this.particleSystem.addParticle({
            x, y,
            vx: (Math.random() - 0.5) * 100,
            vy: (Math.random() - 0.5) * 100,
            life: 1,
            maxLife: 1,
            color: '#ffff44',
            size: 2
          });
        }
        break;
        
      case 'chalk':
        // Dust cloud
        for (let i = 0; i < 20; i++) {
          this.particleSystem.addParticle({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 50,
            life: 2,
            maxLife: 2,
            color: '#dddddd',
            size: 3
          });
        }
        break;
        
      case 'bell':
        // Sound waves
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2;
          this.particleSystem.addParticle({
            x, y,
            vx: Math.cos(angle) * 80,
            vy: Math.sin(angle) * 80,
            life: 1.5,
            maxLife: 1.5,
            color: '#44ffff',
            size: 1
          });
        }
        break;
        
      case 'paper':
        // Paper trail
        for (let i = 0; i < 8; i++) {
          this.particleSystem.addParticle({
            x, y,
            vx: Math.random() * 60 - 30,
            vy: Math.random() * 60 - 30,
            life: 3,
            maxLife: 3,
            color: '#ffffff',
            size: 4
          });
        }
        break;
    }
  }

  private checkMissionProximity(mission: Mission): boolean {
    const playerPos = this.player.position;
    let targetArea = { x: 0, y: 0, width: 0, height: 0 };
    
    // Define interaction areas for each mission type
    switch (mission.type) {
      case 'clock':
        // Near wall clock
        targetArea = { x: 730, y: 60, width: 40, height: 40 };
        break;
      case 'chalk':
        // Near blackboard
        targetArea = { x: 300, y: 20, width: 200, height: 60 };
        break;
      case 'bell':
        // Near intercom
        targetArea = { x: 30, y: 30, width: 40, height: 40 };
        break;
      case 'paper':
        // Near any student desk
        for (const desk of this.classroom.getHidingSpots()) {
          const distance = Math.hypot(playerPos.x - desk.x, playerPos.y - desk.y);
          if (distance < 50) return true;
        }
        return false;
    }
    
    // Check if player is within the target area (with some tolerance)
    return playerPos.x >= targetArea.x - 30 && 
           playerPos.x <= targetArea.x + targetArea.width + 30 &&
           playerPos.y >= targetArea.y - 30 && 
           playerPos.y <= targetArea.y + targetArea.height + 30;
  }

  private render() {
    // Clear screen
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render classroom
    this.classroom.render(this.ctx, this.spriteRenderer);
    
    // Render missions
    this.missions.forEach(mission => {
      mission.render(this.ctx, this.spriteRenderer);
    });
    
    // Render teacher
    this.teacher.render(this.ctx, this.spriteRenderer);
    
    // Render player
    this.player.render(this.ctx, this.spriteRenderer);
    
    // Render particles
    this.particleSystem.render(this.ctx);
    
    // Render debug info (teacher's line of sight)
    if (this.teacher.isAlert) {
      this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(this.teacher.position.x, this.teacher.position.y);
      this.ctx.lineTo(this.player.position.x, this.player.position.y);
      this.ctx.stroke();
    }
  }
}
