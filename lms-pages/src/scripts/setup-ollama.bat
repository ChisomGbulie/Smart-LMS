@echo off
echo 🚀 Setting up Ollama for LMS project...

:: Check if Ollama is installed
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Ollama is not installed.
    echo 📥 Download from: https://ollama.com/download/windows
    exit /b 1
)

echo ✅ Ollama is installed!

:: Pull the model
echo 📥 Downloading Phi-2 model...
ollama pull phi:2.7b

echo ✅ Model ready!

:: Start Ollama server if not running
echo 🚀 Starting Ollama server...
start /b ollama serve

echo ✅ Ollama is running on http://localhost:11434
echo.
echo 📝 To test: ollama run phi:2.7b "Hello"