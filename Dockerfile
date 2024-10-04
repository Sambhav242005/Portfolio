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
RUN bun run next build

EXPOSE 3000

CMD [ "bun","start" ]