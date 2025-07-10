"use client"

import { useEffect, useRef } from "react"

interface QRCodeGeneratorProps {
  value: string
  size?: number
}

export default function QRCodeGenerator({ value, size = 100 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      // Simple QR code placeholder - in production, use qrcode.js
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Clear canvas
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, size, size)

        // Draw simple QR pattern placeholder
        ctx.fillStyle = "black"
        const cellSize = size / 10

        // Create a simple pattern
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if ((i + j) % 2 === 0 || i === 0 || i === 9 || j === 0 || j === 9) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
            }
          }
        }

        // Add corner squares
        ctx.fillRect(0, 0, cellSize * 3, cellSize * 3)
        ctx.fillRect(size - cellSize * 3, 0, cellSize * 3, cellSize * 3)
        ctx.fillRect(0, size - cellSize * 3, cellSize * 3, cellSize * 3)

        // Add white centers
        ctx.fillStyle = "white"
        ctx.fillRect(cellSize, cellSize, cellSize, cellSize)
        ctx.fillRect(size - cellSize * 2, cellSize, cellSize, cellSize)
        ctx.fillRect(cellSize, size - cellSize * 2, cellSize, cellSize)
      }
    }
  }, [value, size])

  return <canvas ref={canvasRef} width={size} height={size} className="border border-gray-300 rounded" />
}
