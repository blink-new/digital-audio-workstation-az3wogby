import { Button } from './ui/button'
import { Input } from './ui/input'
import { Slider } from './ui/slider'
import { 
  Play, 
  Pause, 
  Square, 
  Circle,
  SkipBack,
  SkipForward,
  Volume2
} from 'lucide-react'

interface TransportControlsProps {
  isPlaying: boolean
  isRecording: boolean
  currentTime: number
  duration: number
  bpm: number
  onPlay: () => void
  onStop: () => void
  onRecord: () => void
  onTimeChange: (time: number) => void
  onBpmChange: (bpm: number) => void
}

export function TransportControls({
  isPlaying,
  isRecording,
  currentTime,
  duration,
  bpm,
  onPlay,
  onStop,
  onRecord,
  onTimeChange,
  onBpmChange
}: TransportControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-900 border-t border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Transport Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => onTimeChange(0)}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              className={`${
                isPlaying 
                  ? 'text-blue-400 hover:text-blue-300 bg-blue-500/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={onPlay}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={onStop}
            >
              <Square className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`${
                isRecording 
                  ? 'text-red-400 hover:text-red-300 bg-red-500/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={onRecord}
            >
              <Circle className={`w-4 h-4 ${isRecording ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => onTimeChange(Math.min(duration, currentTime + 10))}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Time Display */}
          <div className="flex items-center space-x-4 ml-8">
            <div className="text-sm font-mono text-white bg-gray-800 px-3 py-1 rounded">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-gray-400">
              / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* BPM and Settings */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-400">BPM</label>
            <Input
              type="number"
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              className="w-16 text-center bg-gray-800 border-gray-700 text-white text-sm"
              min={60}
              max={200}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <Slider
              value={[75]}
              max={100}
              step={1}
              className="w-20"
            />
            <span className="text-xs text-gray-400 w-8">75%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="relative">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={([value]) => onTimeChange(value)}
            className="w-full"
          />
          
          {/* Time markers */}
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0:00</span>
            <span>1:00</span>
            <span>2:00</span>
            <span>3:00</span>
            <span>4:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}