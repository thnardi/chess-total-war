import { useEffect, useRef, useState } from "react";
import { CameraController } from "./camera";
import { Renderer } from "./renderer";
import { UnitManager } from "./units";
import { GameClient } from "./services/gameClient";
import { isoToWorld, applyCamera, worldToIso } from "./isometric";
import { Camera, Unit, Position } from "./types";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const unitManagerRef = useRef<UnitManager | null>(null);
  const gameClientRef = useRef<GameClient | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [boardSize, setBoardSize] = useState(50);
  const [connectionStatus, setConnectionStatus] = useState<string>("Conectando...");
  const selectedUnitRef = useRef<Unit | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Inicializa os sistemas
    const renderer = new Renderer(canvas);
    const cameraController = new CameraController();
    const unitManager = new UnitManager();
    const gameClient = new GameClient();

    rendererRef.current = renderer;
    cameraControllerRef.current = cameraController;
    unitManagerRef.current = unitManager;
    gameClientRef.current = gameClient;

    // Configura callbacks do GameClient
    gameClient.onGameState((units, boardSize) => {
      unitManager.setUnits(units);
      setBoardSize(boardSize);
      setConnectionStatus("Conectado");
      
      // Posiciona a câmera no centro do tabuleiro
      const centerX = boardSize / 2;
      const centerY = boardSize / 2;
      const centerIso = worldToIso(centerX, centerY);
      cameraController.getCamera().x = window.innerWidth / 2 - centerIso.x;
      cameraController.getCamera().y = window.innerHeight / 2 - centerIso.y;
    });

    gameClient.onUnitUpdate((unit) => {
      unitManager.updateUnit(unit);
      if (selectedUnitRef.current?.id === unit.id) {
        selectedUnitRef.current = unit;
      }
    });

    gameClient.onUnitsUpdate((units) => {
      unitManager.updateUnits(units);
    });

    gameClient.onError((message) => {
      console.error("Erro do servidor:", message);
      setConnectionStatus(`Erro: ${message}`);
    });

    // Conecta ao servidor
    gameClient.connect(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000');

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
      if (!cameraControllerRef.current || !unitManagerRef.current || !gameClientRef.current) return;

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
        
        if (unit) {
          // Seleciona a unidade via servidor
          selectedUnitRef.current = unit;
          gameClientRef.current.selectUnit(unit.id);
        } else if (selectedUnitRef.current) {
          // Tenta mover a unidade selecionada para a posição clicada
          gameClientRef.current.moveUnit(selectedUnitRef.current.id, gridPos);
          selectedUnitRef.current = null;
          gameClientRef.current.selectUnit(null);
        } else {
          // Deseleciona
          gameClientRef.current.selectUnit(null);
        }
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
      gameClient.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <canvas ref={canvasRef} id="gameCanvas" />
      <div id="ui">
        <div>Status: {connectionStatus}</div>
        <div>Use WASD ou setas para mover a câmera</div>
        <div>Roda do mouse para zoom</div>
        <div>Clique para selecionar unidades</div>
        <div>Clique em uma posição vazia para mover a unidade selecionada</div>
      </div>
    </div>
  );
}

export default App;
