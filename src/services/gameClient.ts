import { io, Socket } from 'socket.io-client';
import { Unit, ServerEvents, ClientEvents } from '../../shared/types';

export class GameClient {
  private socket: Socket<ServerEvents, ClientEvents> | null = null;
  private onUnitsUpdateCallback: ((units: Unit[]) => void) | null = null;
  private onUnitUpdateCallback: ((unit: Unit) => void) | null = null;
  private onErrorCallback: ((message: string) => void) | null = null;
  private onGameStateCallback: ((units: Unit[], boardSize: number) => void) | null = null;

  connect(serverUrl: string = 'http://localhost:3000'): void {
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Conectado ao servidor');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado do servidor');
    });

    this.socket.on('gameState', (data) => {
      if (this.onGameStateCallback) {
        this.onGameStateCallback(data.units, data.boardSize);
      }
    });

    this.socket.on('unitUpdated', (data) => {
      if (this.onUnitUpdateCallback) {
        this.onUnitUpdateCallback(data.unit);
      }
    });

    this.socket.on('unitsUpdated', (data) => {
      if (this.onUnitsUpdateCallback) {
        this.onUnitsUpdateCallback(data.units);
      }
    });

    this.socket.on('error', (data) => {
      console.error('Erro do servidor:', data.message);
      if (this.onErrorCallback) {
        this.onErrorCallback(data.message);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  selectUnit(unitId: string | null): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('selectUnit', { unitId });
    }
  }

  moveUnit(unitId: string, position: { x: number; y: number }): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('moveUnit', { unitId, position });
    }
  }

  onGameState(callback: (units: Unit[], boardSize: number) => void): void {
    this.onGameStateCallback = callback;
  }

  onUnitUpdate(callback: (unit: Unit) => void): void {
    this.onUnitUpdateCallback = callback;
  }

  onUnitsUpdate(callback: (units: Unit[]) => void): void {
    this.onUnitsUpdateCallback = callback;
  }

  onError(callback: (message: string) => void): void {
    this.onErrorCallback = callback;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

