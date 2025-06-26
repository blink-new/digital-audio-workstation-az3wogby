import { useState, useCallback, useEffect, useRef } from 'react'
import { Header } from './Header'
import { Timeline } from './Timeline'
import { TrackPanel } from './TrackPanel'
import { MixerPanel } from './MixerPanel'
import { TransportControls } from './TransportControls'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'
import toast from 'react-hot-toast'

export interface Track {
  id: string
  name: string
  volume: number
  pan: number
  muted: boolean
  solo: boolean
  color: string
  audioBuffer?: AudioBuffer
  waveformData?: number[]
}

export interface AudioWorkspaceState {
  tracks: Track[]
  isPlaying: boolean
  isRecording: boolean
  currentTime: number
  duration: number
  bpm: number
  selectedTrack: string | null
}

export function AudioWorkspace() {
  // Generate sample waveform data for demonstration
  const generateSampleWaveform = (length: number) => {
    const data = new Array(Math.floor(length / 100)) // Downsample for display
    for (let i = 0; i < data.length; i++) {
      // Create realistic audio waveform patterns
      const time = i / data.length
      let amplitude = 0
      
      // Add different frequency components
      amplitude += Math.sin(time * Math.PI * 20) * 0.3 // Low frequency
      amplitude += Math.sin(time * Math.PI * 100) * 0.2 // Mid frequency  
      amplitude += Math.sin(time * Math.PI * 300) * 0.1 // High frequency
      
      // Add some randomness for realistic look
      amplitude += (Math.random() - 0.5) * 0.2
      
      // Apply envelope (fade in/out)
      const envelope = Math.sin(time * Math.PI)
      amplitude *= envelope * 0.8
      
      data[i] = Math.max(-1, Math.min(1, amplitude))
    }
    return data
  }

  const [state, setState] = useState<AudioWorkspaceState>({
    tracks: [
      {
        id: '1',
        name: 'Drums',
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
        color: '#ef4444',
        waveformData: generateSampleWaveform(44100 * 30) // 30 seconds of drums
      },
      {
        id: '2',
        name: 'Bass',
        volume: 0.7,
        pan: -0.2,
        muted: false,
        solo: false,
        color: '#3b82f6',
        waveformData: generateSampleWaveform(44100 * 25) // 25 seconds of bass
      },
      {
        id: '3',
        name: 'Lead Synth',
        volume: 0.6,
        pan: 0.3,
        muted: false,
        solo: false,
        color: '#10b981',
        waveformData: generateSampleWaveform(44100 * 20) // 20 seconds of synth
      }
    ],
    isPlaying: false,
    isRecording: false,
    currentTime: 0,
    duration: 300, // 5 minutes
    bpm: 120,
    selectedTrack: null
  })

  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null)

  const updateTrack = useCallback((trackId: string, updates: Partial<Track>) => {
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => 
        track.id === trackId ? { ...track, ...updates } : track
      )
    }))
  }, [])

  const addTrack = useCallback(() => {
    const trackColors = ['#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
    const trackNames = ['Vocals', 'Guitar', 'Piano', 'Strings', 'Percussion', 'Pad', 'Arp']
    
    const newTrack: Track = {
      id: Date.now().toString(),
      name: trackNames[Math.floor(Math.random() * trackNames.length)],
      volume: 0.8,
      pan: (Math.random() - 0.5) * 0.6, // Random pan between -0.3 and 0.3
      muted: false,
      solo: false,
      color: trackColors[state.tracks.length % trackColors.length],
      waveformData: generateSampleWaveform(44100 * (15 + Math.random() * 20)) // 15-35 seconds
    }
    setState(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }))
    toast.success(`Added ${newTrack.name} track`)
  }, [state.tracks.length, generateSampleWaveform])

  const deleteTrack = useCallback((trackId: string) => {
    const track = state.tracks.find(t => t.id === trackId)
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.filter(track => track.id !== trackId),
      selectedTrack: prev.selectedTrack === trackId ? null : prev.selectedTrack
    }))
    if (track) {
      toast.success(`Deleted ${track.name} track`)
    }
  }, [state.tracks])

  const togglePlayback = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [])

  const toggleRecord = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: !prev.isRecording }))
  }, [])

  const stopPlayback = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, isRecording: false, currentTime: 0 }))
  }, [])

  const setCurrentTime = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }))
  }, [])

  useEffect(() => {
    if (state.isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setState(prev => {
          const newTime = prev.currentTime + 0.1
          if (newTime >= prev.duration) {
            return { ...prev, isPlaying: false, currentTime: 0 }
          }
          return { ...prev, currentTime: newTime }
        })
      }, 100) // Update every 100ms
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
        playbackTimerRef.current = null
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
      }
    }
  }, [state.isPlaying])

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <Header />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20} minSize={15}>
            <TrackPanel
              tracks={state.tracks}
              selectedTrack={state.selectedTrack}
              onTrackSelect={(trackId) => setState(prev => ({ ...prev, selectedTrack: trackId }))}
              onTrackUpdate={updateTrack}
              onAddTrack={addTrack}
              onDeleteTrack={deleteTrack}
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={60}>
            <Timeline
              tracks={state.tracks}
              currentTime={state.currentTime}
              duration={state.duration}
              bpm={state.bpm}
              isPlaying={state.isPlaying}
              onTimeChange={setCurrentTime}
              onTrackUpdate={updateTrack}
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={20} minSize={15}>
            <MixerPanel
              tracks={state.tracks}
              onTrackUpdate={updateTrack}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
        
        <TransportControls
          isPlaying={state.isPlaying}
          isRecording={state.isRecording}
          currentTime={state.currentTime}
          duration={state.duration}
          bpm={state.bpm}
          onPlay={togglePlayback}
          onStop={stopPlayback}
          onRecord={toggleRecord}
          onTimeChange={setCurrentTime}
          onBpmChange={(bpm) => setState(prev => ({ ...prev, bpm }))}
        />
      </div>
    </div>
  )
}