import { Unit, UnitType, PlayerColor, Position } from './types';

export class UnitManager {
  private units: Unit[] = [];
  private nextId = 1;

  createUnit(type: UnitType, player: PlayerColor, position: Position): Unit {
    const unit: Unit = {
      id: `unit-${this.nextId++}`,
      type,
      player,
      position,
      selected: false
    };
    this.units.push(unit);
    return unit;
  }

  getUnits(): Unit[] {
    return this.units;
  }

  getUnitsByPlayer(player: PlayerColor): Unit[] {
    return this.units.filter(u => u.player === player);
  }

  getUnitAt(position: Position): Unit | null {
    return this.units.find(u => u.position.x === position.x && u.position.y === position.y) || null;
  }

  selectUnit(unit: Unit | null): void {
    // Deseleciona todas as unidades
    this.units.forEach(u => u.selected = false);
    // Seleciona a unidade especificada
    if (unit) {
      unit.selected = true;
    }
  }

  getSelectedUnit(): Unit | null {
    return this.units.find(u => u.selected) || null;
  }

  initializeUnits(): void {
    const boardSize = 50;
    
    // Jogador Azul (lado inferior esquerdo)
    // 10 Guerreiros
    for (let i = 0; i < 10; i++) {
      this.createUnit(
        UnitType.WARRIOR,
        PlayerColor.BLUE,
        { x: 5 + i, y: boardSize - 5 }
      );
    }
    
    // 4 Arqueiros
    for (let i = 0; i < 4; i++) {
      this.createUnit(
        UnitType.ARCHER,
        PlayerColor.BLUE,
        { x: 3 + i * 2, y: boardSize - 4 }
      );
    }
    
    // 1 General
    this.createUnit(
      UnitType.GENERAL,
      PlayerColor.BLUE,
      { x: boardSize / 2 - 5, y: boardSize - 3 }
    );
    
    // 3 Aldeões
    for (let i = 0; i < 3; i++) {
      this.createUnit(
        UnitType.VILLAGER,
        PlayerColor.BLUE,
        { x: 2 + i * 2, y: boardSize - 2 }
      );
    }
    
    // 2 Cavalaria Leve
    this.createUnit(
      UnitType.LIGHT_CAVALRY,
      PlayerColor.BLUE,
      { x: 1, y: boardSize - 3 }
    );
    this.createUnit(
      UnitType.LIGHT_CAVALRY,
      PlayerColor.BLUE,
      { x: boardSize - 2, y: boardSize - 3 }
    );
    
    // 2 Cavalaria Pesada
    this.createUnit(
      UnitType.HEAVY_CAVALRY,
      PlayerColor.BLUE,
      { x: 0, y: boardSize - 4 }
    );
    this.createUnit(
      UnitType.HEAVY_CAVALRY,
      PlayerColor.BLUE,
      { x: boardSize - 1, y: boardSize - 4 }
    );
    
    // Jogador Vermelho (lado superior direito)
    // 10 Guerreiros
    for (let i = 0; i < 10; i++) {
      this.createUnit(
        UnitType.WARRIOR,
        PlayerColor.RED,
        { x: boardSize - 6 - i, y: 4 }
      );
    }
    
    // 4 Arqueiros
    for (let i = 0; i < 4; i++) {
      this.createUnit(
        UnitType.ARCHER,
        PlayerColor.RED,
        { x: boardSize - 4 - i * 2, y: 3 }
      );
    }
    
    // 1 General
    this.createUnit(
      UnitType.GENERAL,
      PlayerColor.RED,
      { x: boardSize / 2 + 5, y: 2 }
    );
    
    // 3 Aldeões
    for (let i = 0; i < 3; i++) {
      this.createUnit(
        UnitType.VILLAGER,
        PlayerColor.RED,
        { x: boardSize - 3 - i * 2, y: 1 }
      );
    }
    
    // 2 Cavalaria Leve
    this.createUnit(
      UnitType.LIGHT_CAVALRY,
      PlayerColor.RED,
      { x: boardSize - 2, y: 2 }
    );
    this.createUnit(
      UnitType.LIGHT_CAVALRY,
      PlayerColor.RED,
      { x: 1, y: 2 }
    );
    
    // 2 Cavalaria Pesada
    this.createUnit(
      UnitType.HEAVY_CAVALRY,
      PlayerColor.RED,
      { x: boardSize - 1, y: 3 }
    );
    this.createUnit(
      UnitType.HEAVY_CAVALRY,
      PlayerColor.RED,
      { x: 0, y: 3 }
    );
  }
}

