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

// Eventos do cliente para o servidor
export interface ClientEvents {
  // Selecionar unidade
  selectUnit: (data: { unitId: string | null }) => void;
  // Mover unidade
  moveUnit: (data: { unitId: string; position: Position }) => void;
  // Ações futuras podem ser adicionadas aqui
}

// Eventos do servidor para o cliente
export interface ServerEvents {
  // Estado inicial do jogo
  gameState: (data: { units: Unit[]; boardSize: number }) => void;
  // Atualização de unidade
  unitUpdated: (data: { unit: Unit }) => void;
  // Múltiplas unidades atualizadas
  unitsUpdated: (data: { units: Unit[] }) => void;
  // Unidade selecionada
  unitSelected: (data: { unitId: string | null; playerId: string }) => void;
  // Erro
  error: (data: { message: string }) => void;
}

