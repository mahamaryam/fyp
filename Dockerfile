# Use Node.js 20 LTS as the base image
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the TypeScript application
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env

# Set environment variables
ENV NODE_ENV=production
ENV NODE_PATH=./build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "--enable-source-maps", "build/main.js"]

