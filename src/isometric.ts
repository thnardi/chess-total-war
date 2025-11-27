import { Position } from './types';

/**
 * Converte coordenadas do mundo (grid) para coordenadas isométricas na tela
 */
export function worldToIso(worldX: number, worldY: number): Position {
  const tileWidth = 64;
  const tileHeight = 32;
  
  const screenX = (worldX - worldY) * (tileWidth / 2);
  const screenY = (worldX + worldY) * (tileHeight / 2);
  
  return { x: screenX, y: screenY };
}

/**
 * Converte coordenadas isométricas da tela para coordenadas do mundo (grid)
 */
export function isoToWorld(screenX: number, screenY: number): Position {
  const tileWidth = 64;
  const tileHeight = 32;
  
  const worldX = (screenX / (tileWidth / 2) + screenY / (tileHeight / 2)) / 2;
  const worldY = (screenY / (tileHeight / 2) - screenX / (tileWidth / 2)) / 2;
  
  return { x: Math.floor(worldX), y: Math.floor(worldY) };
}

/**
 * Aplica transformação de câmera (posição e zoom) às coordenadas
 */
export function applyCamera(
  screenX: number,
  screenY: number,
  cameraX: number,
  cameraY: number,
  zoom: number
): Position {
  return {
    x: (screenX - cameraX) / zoom,
    y: (screenY - cameraY) / zoom
  };
}

/**
 * Remove transformação de câmera (converte coordenadas da tela para coordenadas do mundo com câmera)
 */
export function removeCamera(
  worldX: number,
  worldY: number,
  cameraX: number,
  cameraY: number,
  zoom: number
): Position {
  return {
    x: worldX * zoom + cameraX,
    y: worldY * zoom + cameraY
  };
}

