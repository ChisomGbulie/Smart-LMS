// scripts/download-model.js
import { createWriteStream } from 'fs'
import { get } from 'https'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { mkdir } from 'fs/promises'

const streamPipeline = promisify(pipeline)

async function downloadModel() {
  console.log('📥 Downloading AI model (approx 500MB)...')
  
  await mkdir('./models', { recursive: true })
  
  const modelUrl = 'https://huggingface.co/microsoft/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf'
  const dest = './models/model.gguf'
  
  const response = await new Promise((resolve, reject) => {
    get(modelUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`))
        return
      }
      resolve(res)
    })
  })
  
  await streamPipeline(response, createWriteStream(dest))
  console.log('✅ Model downloaded successfully!')
}

downloadModel().catch(console.error)