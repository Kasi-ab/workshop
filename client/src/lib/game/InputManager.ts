export class InputManager {
  private keys: { [key: string]: boolean } = {};
  private mobileInputs: { [direction: string]: boolean } = {};

  constructor() {
    this.setupKeyboardListeners();
  }

  private setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  public isPressed(action: string): boolean {
    switch (action) {
      case 'up':
        return this.keys['ArrowUp'] || this.keys['KeyW'] || this.mobileInputs['up'];
      case 'down':
        return this.keys['ArrowDown'] || this.keys['KeyS'] || this.mobileInputs['down'];
      case 'left':
        return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.mobileInputs['left'];
      case 'right':
        return this.keys['ArrowRight'] || this.keys['KeyD'] || this.mobileInputs['right'];
      case 'action':
        return this.keys['KeyE'] || this.keys['Space'];
      default:
        return false;
    }
  }

  public isActionPressed(): boolean {
    return this.isPressed('action');
  }

  public setMobileInput(direction: string, pressed: boolean) {
    this.mobileInputs[direction] = pressed;
  }

  public update() {
    // Could be used for input buffering or other input processing
  }
}
