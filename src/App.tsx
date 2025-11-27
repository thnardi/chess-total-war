import { useEffect, useRef, useState } from "react";
import { CameraController } from "./camera";
import { Renderer } from "./renderer";
import { UnitManager } from "./units";
import { isoToWorld, applyCamera, worldToIso } from "./isometric";
import { Camera } from "./types";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const unitManagerRef = useRef<UnitManager | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const boardSize = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Inicializa os sistemas
    const renderer = new Renderer(canvas);
    const cameraController = new CameraController();
    const unitManager = new UnitManager();

    rendererRef.current = renderer;
    cameraControllerRef.current = cameraController;
    unitManagerRef.current = unitManager;

    // Inicializa unidades
    unitManager.initializeUnits();

    // Posiciona a câmera no centro do tabuleiro
    const centerX = boardSize / 2;
    const centerY = boardSize / 2;
    const centerIso = worldToIso(centerX, centerY);
    cameraController.getCamera().x = window.innerWidth / 2 - centerIso.x;
    cameraController.getCamera().y = window.innerHeight / 2 - centerIso.y;

    // Game loop
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (
        cameraControllerRef.current &&
        rendererRef.current &&
        unitManagerRef.current
      ) {
        // Atualiza a câmera
        cameraControllerRef.current.update(deltaTime);

        // Renderiza
        const camera = cameraControllerRef.current.getCamera();
        rendererRef.current.clear();
        rendererRef.current.renderBoard(boardSize, camera);
        rendererRef.current.renderUnits(
          unitManagerRef.current.getUnits(),
          camera
        );
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Event listener para cliques
    const handleMouseUp = (e: MouseEvent) => {
      if (!cameraControllerRef.current || !unitManagerRef.current) return;

      // Só processa clique se não houve arrasto
      if (!cameraControllerRef.current.wasDragging() && e.button === 0) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const camera = cameraControllerRef.current.getCamera();
        const worldPos = applyCamera(
          mouseX,
          mouseY,
          camera.x,
          camera.y,
          camera.zoom
        );
        const gridPos = isoToWorld(worldPos.x, worldPos.y);

        // Verifica se há uma unidade na posição clicada
        const unit = unitManagerRef.current.getUnitAt(gridPos);
        unitManagerRef.current.selectUnit(unit);
      }

      // Reseta a flag de arrasto
      cameraControllerRef.current.resetDragFlag();
    };

    canvas.addEventListener("mouseup", handleMouseUp);

    // Inicia o game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      canvas.removeEventListener("mouseup", handleMouseUp);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      <canvas ref={canvasRef} id="gameCanvas" />
      <div id="ui">
        <div>Use WASD ou setas para mover a câmera</div>
        <div>Roda do mouse para zoom</div>
        <div>Clique para selecionar unidades</div>
      </div>
    </div>
  );
}

export default App;
