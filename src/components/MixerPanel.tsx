import { Track } from './AudioWorkspace'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { Volume2, VolumeX, Headphones } from 'lucide-react'

interface MixerPanelProps {
  tracks: Track[]
  onTrackUpdate: (trackId: string, updates: Partial<Track>) => void
}

export function MixerPanel({ tracks, onTrackUpdate }: MixerPanelProps) {
  return (
    <div className="h-full bg-gray-900 border-l border-gray-800 flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-300">MIXER</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 p-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-gray-800 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: track.color }}
                  />
                  <span className="text-sm font-medium text-white truncate">
                    {track.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-6 h-6 p-0 ${
                      track.muted 
                        ? 'text-red-500 hover:text-red-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => onTrackUpdate(track.id, { muted: !track.muted })}
                  >
                    {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-6 h-6 p-0 ${
                      track.solo 
                        ? 'text-yellow-500 hover:text-yellow-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => onTrackUpdate(track.id, { solo: !track.solo })}
                  >
                    <Headphones className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Volume</label>
                  <span className="text-xs text-gray-300">
                    {Math.round(track.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[track.volume * 100]}
                  onValueChange={([value]) => 
                    onTrackUpdate(track.id, { volume: value / 100 })
                  }
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Pan Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Pan</label>
                  <span className="text-xs text-gray-300">
                    {track.pan > 0 ? `R${Math.round(track.pan * 100)}` : 
                     track.pan < 0 ? `L${Math.round(-track.pan * 100)}` : 'C'}
                  </span>
                </div>
                <Slider
                  value={[track.pan * 100]}
                  onValueChange={([value]) => 
                    onTrackUpdate(track.id, { pan: value / 100 })
                  }
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Level Meter */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Level</label>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                    style={{ width: `${track.volume * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Master Section */}
        <div className="border-t border-gray-800 p-4">
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Master</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Master Volume</label>
                <span className="text-xs text-gray-300">100%</span>
              </div>
              <Slider
                value={[100]}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}