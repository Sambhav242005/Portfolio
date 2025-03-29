# Stage 1: Build Stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY bun.lockb ./
RUN bun install

# Copy the rest of your source code
COPY . .

# Build your Next.js app (make sure your package.json has a "build" script)
RUN bun run build

# Stage 2: Production Stage
FROM oven/bun:latest

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src

# Install only production dependencies (if needed)
RUN bun install --production

# Start the production server
CMD ["bun", "run", "start"]
