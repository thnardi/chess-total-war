export enum UnitType {
  WARRIOR = 'warrior',
  ARCHER = 'archer',
  GENERAL = 'general',
  VILLAGER = 'villager',
  LIGHT_CAVALRY = 'light_cavalry',
  HEAVY_CAVALRY = 'heavy_cavalry'
}

export enum PlayerColor {
  BLUE = 'blue',
  RED = 'red'
}

export interface Position {
  x: number;
  y: number;
}

export interface Unit {
  id: string;
  type: UnitType;
  player: PlayerColor;
  position: Position;
  selected: boolean;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

