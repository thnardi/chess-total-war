import { Camera } from './types';

export class CameraController {
  private camera: Camera;
  private keys: Set<string> = new Set();
  private mouseX = 0;
  private mouseY = 0;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private lastCameraX = 0;
  private lastCameraY = 0;
  private hasDragged = false;
  private dragThreshold = 5; // pixels de movimento para considerar como drag

  constructor() {
    this.camera = {
      x: 0,
      y: 0,
      zoom: 1.0
    };
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Teclado
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    // Mouse
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      if (this.isDragging) {
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > this.dragThreshold) {
          this.hasDragged = true;
        }
        
        this.camera.x = this.lastCameraX + deltaX;
        this.camera.y = this.lastCameraY + deltaY;
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Botão esquerdo
        this.isDragging = true;
        this.hasDragged = false;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.lastCameraX = this.camera.x;
        this.lastCameraY = this.camera.y;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isDragging = false;
      }
    });

    // Zoom com roda do mouse
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 0.1;
      const zoomChange = e.deltaY > 0 ? -zoomFactor : zoomFactor;
      this.camera.zoom = Math.max(0.3, Math.min(3.0, this.camera.zoom + zoomChange));
    });
  }

  update(deltaTime: number): void {
    const moveSpeed = 300 * deltaTime; // pixels por segundo
    
    // Movimento com WASD ou setas
    if (this.keys.has('w') || this.keys.has('arrowup')) {
      this.camera.y += moveSpeed;
    }
    if (this.keys.has('s') || this.keys.has('arrowdown')) {
      this.camera.y -= moveSpeed;
    }
    if (this.keys.has('a') || this.keys.has('arrowleft')) {
      this.camera.x += moveSpeed;
    }
    if (this.keys.has('d') || this.keys.has('arrowright')) {
      this.camera.x -= moveSpeed;
    }
  }

  getCamera(): Camera {
    return this.camera;
  }

  getMousePosition(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }

  wasDragging(): boolean {
    return this.hasDragged;
  }

  resetDragFlag(): void {
    this.hasDragged = false;
  }
}

