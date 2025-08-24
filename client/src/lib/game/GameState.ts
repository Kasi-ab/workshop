export class GameState {
  public confusion = 0;
  public stealth = 100;
  public timeLeft = 120; // 2 minutes
  public isGameOver = false;
  public hasWon = false;
  public isPaused = false;

  public increaseConfusion(amount: number) {
    this.confusion = Math.min(100, this.confusion + amount);
  }

  public decreaseConfusion(amount: number) {
    this.confusion = Math.max(0, this.confusion - amount);
  }

  public increaseStealth(amount: number) {
    this.stealth = Math.min(100, this.stealth + amount);
  }

  public decreaseStealth(amount: number) {
    this.stealth = Math.max(0, this.stealth - amount);
  }

  public updateTimer(deltaTime: number) {
    if (!this.isPaused && !this.isGameOver) {
      this.timeLeft = Math.max(0, this.timeLeft - deltaTime);
    }
  }

  public setGameWon() {
    this.isGameOver = true;
    this.hasWon = true;
  }

  public setGameLost() {
    this.isGameOver = true;
    this.hasWon = false;
  }

  public togglePause() {
    this.isPaused = !this.isPaused;
  }

  public reset() {
    this.confusion = 0;
    this.stealth = 100;
    this.timeLeft = 120;
    this.isGameOver = false;
    this.hasWon = false;
    this.isPaused = false;
  }
}
