import { Unit, UnitType, PlayerColor, Camera } from './types';
import { worldToIso, removeCamera } from './isometric';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = context;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  clear(): void {
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderBoard(boardSize: number, camera: Camera): void {
    this.ctx.save();
    
    // Aplica zoom e posição da câmera
    this.ctx.translate(camera.x, camera.y);
    this.ctx.scale(camera.zoom, camera.zoom);
    
    const tileWidth = 64;
    const tileHeight = 32;
    
    // Desenha o tabuleiro isométrico
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        const iso = worldToIso(x, y);
        
        // Cor alternada para criar padrão de xadrez
        const isEven = (x + y) % 2 === 0;
        this.ctx.fillStyle = isEven ? '#3a5a3a' : '#2a4a2a';
        
        // Desenha tile isométrico (losango)
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x, iso.y);
        this.ctx.lineTo(iso.x + tileWidth / 2, iso.y + tileHeight / 2);
        this.ctx.lineTo(iso.x, iso.y + tileHeight);
        this.ctx.lineTo(iso.x - tileWidth / 2, iso.y + tileHeight / 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Borda do tile
        this.ctx.strokeStyle = '#1a3a1a';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    }
    
    this.ctx.restore();
  }

  renderUnit(unit: Unit, camera: Camera): void {
    this.ctx.save();
    
    // Aplica zoom e posição da câmera
    this.ctx.translate(camera.x, camera.y);
    this.ctx.scale(camera.zoom, camera.zoom);
    
    const iso = worldToIso(unit.position.x, unit.position.y);
    const tileHeight = 32;
    
    // Cor baseada no jogador
    const baseColor = unit.player === PlayerColor.BLUE ? '#4a90e2' : '#e24a4a';
    const darkColor = unit.player === PlayerColor.BLUE ? '#2a5a9a' : '#9a2a2a';
    
    // Desenha a unidade baseada no tipo
    this.ctx.fillStyle = baseColor;
    this.ctx.strokeStyle = unit.selected ? '#ffff00' : darkColor;
    this.ctx.lineWidth = unit.selected ? 3 : 2;
    
    const size = this.getUnitSize(unit.type);
    
    // Desenha forma baseada no tipo de unidade
    this.ctx.beginPath();
    
    switch (unit.type) {
      case UnitType.WARRIOR:
        // Peão/guerreiro - círculo
        this.ctx.arc(iso.x, iso.y, size, 0, Math.PI * 2);
        break;
      case UnitType.ARCHER:
        // Arqueiro - triângulo
        this.ctx.moveTo(iso.x, iso.y - size);
        this.ctx.lineTo(iso.x - size, iso.y + size);
        this.ctx.lineTo(iso.x + size, iso.y + size);
        this.ctx.closePath();
        break;
      case UnitType.GENERAL:
        // General - estrela/pentágono
        const points = 5;
        for (let i = 0; i < points * 2; i++) {
          const angle = (i * Math.PI) / points;
          const radius = i % 2 === 0 ? size : size * 0.5;
          const x = iso.x + Math.cos(angle) * radius;
          const y = iso.y + Math.sin(angle) * radius;
          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        }
        this.ctx.closePath();
        break;
      case UnitType.VILLAGER:
        // Aldeão - quadrado
        this.ctx.rect(iso.x - size, iso.y - size, size * 2, size * 2);
        break;
      case UnitType.LIGHT_CAVALRY:
        // Cavalaria leve - losango
        this.ctx.moveTo(iso.x, iso.y - size);
        this.ctx.lineTo(iso.x + size, iso.y);
        this.ctx.lineTo(iso.x, iso.y + size);
        this.ctx.lineTo(iso.x - size, iso.y);
        this.ctx.closePath();
        break;
      case UnitType.HEAVY_CAVALRY:
        // Cavalaria pesada - hexágono
        const hexPoints = 6;
        for (let i = 0; i < hexPoints; i++) {
          const angle = (i * Math.PI * 2) / hexPoints;
          const x = iso.x + Math.cos(angle) * size;
          const y = iso.y + Math.sin(angle) * size;
          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        }
        this.ctx.closePath();
        break;
    }
    
    this.ctx.fill();
    this.ctx.stroke();
    
    // Sombra no chão
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.ellipse(iso.x, iso.y + tileHeight / 2, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  private getUnitSize(type: UnitType): number {
    switch (type) {
      case UnitType.WARRIOR:
        return 8;
      case UnitType.ARCHER:
        return 8;
      case UnitType.GENERAL:
        return 12;
      case UnitType.VILLAGER:
        return 6;
      case UnitType.LIGHT_CAVALRY:
        return 10;
      case UnitType.HEAVY_CAVALRY:
        return 12;
      default:
        return 8;
    }
  }

  renderUnits(units: Unit[], camera: Camera): void {
    // Ordena unidades por Y para renderizar corretamente (unidades mais ao fundo primeiro)
    const sortedUnits = [...units].sort((a, b) => {
      const depthA = a.position.x + a.position.y;
      const depthB = b.position.x + b.position.y;
      return depthA - depthB;
    });
    
    sortedUnits.forEach(unit => this.renderUnit(unit, camera));
  }
}

