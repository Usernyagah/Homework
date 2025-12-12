# Multi-stage build to bundle frontend and backend into one runtime image.

# Base image for building
FROM node:20-alpine AS builder
WORKDIR /app

# Root tooling (concurrently) if needed
COPY package.json package-lock.json ./
RUN npm ci

# Install backend deps
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci

# Install frontend deps
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

# Build frontend
COPY frontend ./frontend
RUN cd frontend && npm run build

# Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Copy backend deps and source
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY backend ./backend

# Copy built frontend assets
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 4000
CMD ["node", "backend/src/server.js"]

