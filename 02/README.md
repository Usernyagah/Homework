# Online Coding Interview Platform

## Overview
A full-stack collaborative coding interview platform with real-time code syncing, language switching, and sandboxed code execution. The frontend is built with React + Vite, and the backend uses Express.js with Socket.IO for realtime collaboration and a sandboxed executor for multiple languages.

## Deployed Site
- https://homework-vqzh.onrender.com/

## Features
- Create and fetch interview rooms via REST API.
- Real-time collaboration: join rooms, live code updates, language changes, user presence.
- Sandboxed execution: JavaScript (vm2) and Python/C++/Java via child processes with timeouts.
- Health check endpoint for quick status verification.
- Automated integration, socket, and API tests.

## Tech Stack
- React + Vite (frontend)
- Express.js + Socket.IO (backend)
- vm2 sandbox + child_process for code execution
- Vitest, supertest, socket.io-client for testing

## Folder Structure
```
.
├─ frontend/               # React + Vite app
│  ├─ src/
│  └─ package.json
├─ backend/                # Express + Socket.IO server
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ sandbox/
│  │  ├─ utils/
│  │  ├─ socket.js
│  │  └─ server.js
│  ├─ tests/               # Vitest integration/unit tests
│  └─ package.json
└─ README.md
```

## Installation
### Frontend setup
```bash
cd frontend
npm install
```

### Backend setup
```bash
cd backend
npm install
```

## Running Locally
### Start backend (Express + Socket.IO)
```bash
cd backend
npm run dev    # starts dev server (port 4000 by default)
```

### Start frontend (Vite)
```bash
cd frontend
npm run dev    # starts Vite dev server (port 8080 by default)
```

## Running Tests
- Backend integration/API/socket tests (Vitest):
  ```bash
  cd backend
  npm run test
  ```
- Frontend tests (Vitest):
  ```bash
  cd frontend
  npm run test
  ```

## Testing
Integration tests spin up an ephemeral Express + Socket.IO server (no fixed port) and hit REST + WebSocket flows end to end. Vitest runs the suite; supertest is used for HTTP and socket.io-client for WebSocket assertions. A test-only helper builds and tears down the server per suite.

- Start test server (ephemeral, via helper):
  - No manual command needed; tests create an in-memory server in `tests/integration/setup.js`.
- Run integration tests:
  ```bash
  cd backend
  npm run test
  ```
- View coverage:
  ```bash
  cd backend
  npx vitest run --coverage
  ```
- Test folder layout:
  ```
  backend/tests/
    integration/
      api.test.js       # REST endpoints (/rooms, /execute)
      socket.test.js    # socket events: join_room, code_change, language_change, user_joined, user_left
      e2e.test.js       # room creation + socket sync + execute flow (execution mocked)
    executeService.test.js # unit tests for executor
    roomService.test.js    # unit tests for room store
  ```
- Socket tests:
  - Use `socket.io-client` to open two clients against the ephemeral server, join a room, and assert broadcasts (`code_change`, `language_change`, `user_joined`).
- Mocks:
  - Execution service is mocked in API/E2E tests to avoid running real VM2/child_process; e.g., `vi.spyOn(executeService, "executeCode").mockResolvedValue(...)`.
  - JS sandbox (vm2) and child_process executions are exercised in unit tests only, not during integration socket/API flows.

## Commands
- `npm run dev`   – start the development server (run in respective package).
- `npm run test`  – run the test suite (Vitest).
- `npm run build` – frontend: production build (backend: not required; run frontend build from `frontend`).

## API Reference
- `POST /rooms`  
  - Creates a room. Response: `{ roomId }`.
- `GET /rooms/:roomId`  
  - Returns room state: `{ roomId, code, language, users }`.
- `POST /execute`  
  - Executes code in sandbox. Body: `{ language, code, input? }`. Response: `{ output, error }`.

## WebSocket Events
- `join_room` – payload: `{ roomId, userId, username? }`; joins room and receives latest state.
- `code_change` – payload: `{ roomId, code }`; broadcast to other clients in room.
- `language_change` – payload: `{ roomId, language }`; broadcast to other clients.
- `user_joined` – emitted to others when a user joins: `{ userId, username? }`.
- `user_left` – emitted to others when a user leaves: `{ userId }`.

## Deployment
- Backend: deploy Express/Socket.IO server to your preferred host (e.g., Node-compatible PaaS or container). Ensure ports, CORS, and websockets are enabled.
- Frontend: build with `npm run build` in `frontend/` and host the static assets (e.g., CDN, static hosting). Configure the frontend to point to the deployed backend WebSocket/HTTP endpoints.

