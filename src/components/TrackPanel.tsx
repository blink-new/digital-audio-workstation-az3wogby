import { Button } from './ui/button'
import { Input } from './ui/input'
import { Track } from './AudioWorkspace'
import {
  Volume2,
  VolumeX,
  Headphones,
  Plus,
  Trash2,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface TrackPanelProps {
  tracks: Track[]
  selectedTrack: string | null
  onTrackSelect: (trackId: string) => void
  onTrackUpdate: (trackId: string, updates: Partial<Track>) => void
  onAddTrack: () => void
  onDeleteTrack: (trackId: string) => void
}

export function TrackPanel({
  tracks,
  selectedTrack,
  onTrackSelect,
  onTrackUpdate,
  onAddTrack,
  onDeleteTrack
}: TrackPanelProps) {
  return (
    <div className="h-full bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300">TRACKS</h2>
          <Button
            onClick={onAddTrack}
            size="sm"
            variant="ghost"
            className="text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`p-3 border-b border-gray-800 cursor-pointer transition-colors ${
              selectedTrack === track.id 
                ? 'bg-gray-800 border-l-4 border-l-blue-500' 
                : 'hover:bg-gray-850'
            }`}
            onClick={() => onTrackSelect(track.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: track.color }}
                />
                <Input
                  value={track.name}
                  onChange={(e) => onTrackUpdate(track.id, { name: e.target.value })}
                  className="text-xs bg-transparent border-none p-0 h-auto text-white w-16 focus:w-24 transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem 
                    className="text-red-400 hover:text-red-300"
                    onClick={() => onDeleteTrack(track.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete Track
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                onClick={(e) => {
                  e.stopPropagation()
                  onTrackUpdate(track.id, { muted: !track.muted })
                }}
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
                onClick={(e) => {
                  e.stopPropagation()
                  onTrackUpdate(track.id, { solo: !track.solo })
                }}
              >
                <Headphones className="w-3 h-3" />
              </Button>

              <div className="text-xs text-gray-500 ml-2">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}