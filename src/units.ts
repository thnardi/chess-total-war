import { Unit, PlayerColor, Position } from './types';

/**
 * UnitManager agora é apenas um cache local do estado do servidor.
 * Todas as modificações devem ser feitas através do GameClient.
 */
export class UnitManager {
  private units: Map<string, Unit> = new Map();

  /**
   * Atualiza ou adiciona unidades do servidor
   */
  updateUnits(units: Unit[]): void {
    units.forEach(unit => {
      this.units.set(unit.id, { ...unit });
    });
  }

  /**
   * Atualiza uma única unidade
   */
  updateUnit(unit: Unit): void {
    this.units.set(unit.id, { ...unit });
  }

  /**
   * Define todas as unidades (usado no estado inicial)
   */
  setUnits(units: Unit[]): void {
    this.units.clear();
    units.forEach(unit => {
      this.units.set(unit.id, { ...unit });
    });
  }

  getUnits(): Unit[] {
    return Array.from(this.units.values());
  }

  getUnitsByPlayer(player: PlayerColor): Unit[] {
    return Array.from(this.units.values()).filter(u => u.player === player);
  }

  getUnitAt(position: Position): Unit | null {
    for (const unit of this.units.values()) {
      if (unit.position.x === position.x && unit.position.y === position.y) {
        return unit;
      }
    }
    return null;
  }

  getSelectedUnit(): Unit | null {
    return Array.from(this.units.values()).find(u => u.selected) || null;
  }

  getUnit(unitId: string): Unit | undefined {
    return this.units.get(unitId);
  }
}

