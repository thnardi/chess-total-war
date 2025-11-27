# Chess Total War - Cliente

Cliente React/Vite para o jogo de estratégia isométrico multiplayer em tempo real.

## Arquitetura

Este é o projeto do **cliente**. O servidor está em um projeto separado: `chess-total-war-server`.

- **Cliente**: Aplicação React/Vite que renderiza o jogo
- **Servidor**: Projeto separado em `chess-total-war-server` (Node.js/Express com Socket.io)
- **Shared**: Tipos TypeScript compartilhados (cópia local)

## Requisitos

- Node.js 18+ 
- npm ou yarn

## Instalação

```bash
npm install
```

## Executando o Projeto

### Desenvolvimento

Você precisa executar o servidor e o cliente em terminais separados:

**Terminal 1 - Servidor (na pasta chess-total-war-server):**
```bash
cd ../chess-total-war-server
npm install
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

**Terminal 2 - Cliente:**
```bash
npm install
npm run dev
```

O cliente estará rodando em `http://localhost:5173`

### Produção

**Build do cliente:**
```bash
npm run build
```

**Build do servidor (na pasta chess-total-war-server):**
```bash
cd ../chess-total-war-server
npm run build
npm start
```

## Como Funciona

1. **Servidor como Fonte Única da Verdade**: Todo o estado do jogo (unidades, posições, seleções) é gerenciado pelo servidor
2. **WebSockets para Sincronização**: O servidor usa Socket.io para sincronizar o estado em tempo real com todos os clientes conectados
3. **Validação no Servidor**: Todas as ações (mover unidades, selecionar) são validadas no servidor antes de serem aplicadas
4. **Sincronização Automática**: Quando um cliente faz uma ação, o servidor valida, aplica e propaga para todos os clientes

## Funcionalidades

- ✅ Seleção de unidades (sincronizada entre clientes)
- ✅ Movimento de unidades (validado no servidor)
- ✅ Câmera isométrica com zoom e pan
- ✅ Renderização de diferentes tipos de unidades
- ✅ Validação de regras (posição válida, unidade pertence ao jogador, etc.)

## Estrutura do Projeto

```
chess-total-war/
├── src/              # Código do cliente
│   ├── services/     # GameClient para comunicação com servidor
│   └── ...
├── shared/           # Tipos compartilhados (cópia local)
│   └── types.ts
└── ...

chess-total-war-server/  # Projeto separado
├── src/
│   ├── index.ts      # Servidor Express + Socket.io
│   └── GameState.ts  # Lógica do jogo
├── shared/           # Tipos compartilhados
│   └── types.ts
└── ...
```

## Próximos Passos

- [ ] Sistema de turnos
- [ ] Combate entre unidades
- [ ] Mais tipos de ações (atacar, construir, etc.)
- [ ] Sistema de autenticação
- [ ] Salas de jogo
- [ ] Persistência de partidas

