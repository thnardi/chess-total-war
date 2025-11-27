import { CameraController } from './camera';
import { Renderer } from './renderer';
import { UnitManager } from './units';
import { isoToWorld, applyCamera, worldToIso } from './isometric';

class Game {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private cameraController: CameraController;
  private unitManager: UnitManager;
  private boardSize = 50;
  private lastTime = 0;
  private animationFrameId: number | null = null;

  constructor() {
    const canvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error('Canvas element not found');
    }
    
    this.canvas = canvasElement;
    this.renderer = new Renderer(this.canvas);
    this.cameraController = new CameraController();
    this.unitManager = new UnitManager();
    
    this.setupEventListeners();
    this.unitManager.initializeUnits();
    
    // Posiciona a câmera no centro do tabuleiro
    const centerIso = this.getBoardCenterIso();
    this.cameraController.getCamera().x = window.innerWidth / 2 - centerIso.x;
    this.cameraController.getCamera().y = window.innerHeight / 2 - centerIso.y;
    
    this.gameLoop(0);
  }

  private getBoardCenterIso(): { x: number; y: number } {
    const centerX = this.boardSize / 2;
    const centerY = this.boardSize / 2;
    return worldToIso(centerX, centerY);
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mouseup', (e) => {
      // Só processa clique se não houve arrasto
      if (!this.cameraController.wasDragging() && e.button === 0) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const camera = this.cameraController.getCamera();
        const worldPos = applyCamera(mouseX, mouseY, camera.x, camera.y, camera.zoom);
        const gridPos = isoToWorld(worldPos.x, worldPos.y);
        
        // Verifica se há uma unidade na posição clicada
        const unit = this.unitManager.getUnitAt(gridPos);
        this.unitManager.selectUnit(unit);
      }
      
      // Reseta a flag de arrasto
      this.cameraController.resetDragFlag();
    });
  }

  private gameLoop(currentTime: number): void {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // Atualiza a câmera
    this.cameraController.update(deltaTime);
    
    // Renderiza
    this.renderer.clear();
    const camera = this.cameraController.getCamera();
    this.renderer.renderBoard(this.boardSize, camera);
    this.renderer.renderUnits(this.unitManager.getUnits(), camera);
    
    this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Inicia o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});

