#!/bin/bash

# Install dependencies
npm install

# Install vite explicitly if needed
npm install --save-dev vite @vitejs/plugin-react

# Build the project
npm run build