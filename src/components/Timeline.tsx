import { useRef, useEffect, useState, useCallback } from 'react'
import { Track } from './AudioWorkspace'

interface TimelineProps {
  tracks: Track[]
  currentTime: number
  duration: number
  bpm: number
  isPlaying: boolean
  onTimeChange: (time: number) => void
  onTrackUpdate: (trackId: string, updates: Partial<Track>) => void
}

export function Timeline({
  tracks,
  currentTime,
  duration,
  // bpm, // TODO: Use for beat grid
  // isPlaying, // TODO: Use for animation
  onTimeChange
  // onTrackUpdate // TODO: Use for track modifications
}: TimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [scale, setScale] = useState(1) // pixels per second

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const drawWaveform = useCallback((
    ctx: CanvasRenderingContext2D,
    track: Track,
    y: number,
    height: number,
    width: number
  ) => {
    if (!track.waveformData) {
      // Draw empty track
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y + height / 2)
      ctx.lineTo(width, y + height / 2)
      ctx.stroke()
      return
    }

    // Draw waveform
    ctx.strokeStyle = track.color
    ctx.lineWidth = 2
    ctx.beginPath()
    
    const samples = track.waveformData
    const samplesPerPixel = samples.length / width
    
    for (let x = 0; x < width; x++) {
      const sampleIndex = Math.floor(x * samplesPerPixel)
      const sample = samples[sampleIndex] || 0
      const waveY = y + height / 2 + (sample * height / 2)
      
      if (x === 0) {
        ctx.moveTo(x, waveY)
      } else {
        ctx.lineTo(x, waveY)
      }
    }
    
    ctx.stroke()
  }, [])

  const drawTimeline = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const trackHeight = 80
    const headerHeight = 40

    // Draw time ruler
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, headerHeight)

    // Draw time markers
    ctx.fillStyle = '#9ca3af'
    ctx.font = '12px monospace'
    
    const timeInterval = Math.max(1, Math.floor(30 / scale)) // Show time every N seconds
    for (let t = 0; t <= duration; t += timeInterval) {
      const x = t * scale
      if (x > canvas.width) break
      
      ctx.fillText(formatTime(t), x + 4, 15)
      
      // Draw tick marks
      ctx.strokeStyle = '#4b5563'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, headerHeight - 10)
      ctx.lineTo(x, headerHeight)
      ctx.stroke()
    }

    // Draw grid lines
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 1
    for (let t = 0; t <= duration; t += 1) {
      const x = t * scale
      if (x > canvas.width) break
      
      ctx.beginPath()
      ctx.moveTo(x, headerHeight)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw tracks
    tracks.forEach((track, index) => {
      const y = headerHeight + index * trackHeight
      
      // Track background
      ctx.fillStyle = index % 2 === 0 ? '#0f172a' : '#1e293b'
      ctx.fillRect(0, y, canvas.width, trackHeight)
      
      // Track border
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y + trackHeight)
      ctx.lineTo(canvas.width, y + trackHeight)
      ctx.stroke()

      // Draw waveform
      drawWaveform(ctx, track, y + 10, trackHeight - 20, canvas.width)
    })

    // Draw playhead
    const playheadX = currentTime * scale
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playheadX, 0)
    ctx.lineTo(playheadX, canvas.height)
    ctx.stroke()

    // Draw playhead handle
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(playheadX, 20, 6, 0, 2 * Math.PI)
    ctx.fill()

  }, [tracks, currentTime, duration, scale, drawWaveform, formatTime])

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const time = x / scale
    
    setIsDragging(true)
    onTimeChange(Math.max(0, Math.min(duration, time)))
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const time = x / scale
    
    onTimeChange(Math.max(0, Math.min(duration, time)))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    setScale(prev => Math.max(0.1, Math.min(10, prev * factor)))
  }

  useEffect(() => {
    drawTimeline()
  }, [drawTimeline])

  useEffect(() => {
    const handleResize = () => drawTimeline()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawTimeline])

  return (
    <div className="h-full bg-gray-950 flex flex-col">
      <div className="p-2 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300">TIMELINE</h2>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>Scale: {scale.toFixed(1)}x</span>
          <span>•</span>
          <span>Duration: {formatTime(duration)}</span>
        </div>
      </div>
      
      <div
        ref={containerRef}
        className="flex-1 relative overflow-auto cursor-pointer"
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  )
}