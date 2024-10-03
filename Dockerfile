# Stage 1: Build the Next.js app with Bun
FROM oven/bun:latest as builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY bun.lockb package.json ./
RUN bun install

# Copy all files
COPY . .

# Build the Next.js app
RUN bun run build

# Stage 2: Serve the Next.js app
FROM oven/bun:latest as runner

# Set working directory
WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /next.config.js /next.config.js
COPY --from=builder /package.json /package.json

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js app
CMD ["bun", "run","next", "start"]
