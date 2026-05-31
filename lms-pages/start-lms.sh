#!/bin/bash

echo "🚀 Starting SmartLMS with LocalAI..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found! Please install Docker Desktop first."
    exit 1
fi

# Start LocalAI
echo "📦 Starting LocalAI..."
docker run -d --rm \
  --name local-ai \
  -p 8080:8080 \
  -v $(pwd)/models:/models \
  -e MODELS_PATH=/models \
  localai/localai:latest

echo "⏳ Waiting for LocalAI to be ready..."
sleep 5

# Download model if not exists
if [ ! -f "models/model.gguf" ]; then
    echo "📥 Downloading AI model (this may take a few minutes)..."
    mkdir -p models
    curl -L -o models/model.gguf \
      https://huggingface.co/microsoft/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start backend
echo "🔧 Starting backend server..."
npm run server &

# Start frontend
echo "🎨 Starting frontend..."
npm run dev

# On exit, stop LocalAI
trap "docker stop local-ai" EXIT