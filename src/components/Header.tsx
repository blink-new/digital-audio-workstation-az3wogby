import { Button } from './ui/button'
import { Input } from './ui/input'
import { 
  Music, 
  Save, 
  FolderOpen, 
  Download, 
  Upload,
  Settings,
  Volume2 
} from 'lucide-react'

export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-white">AudioForge</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <FolderOpen className="w-4 h-4 mr-1" />
            Open
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Project:</span>
          <Input
            defaultValue="Untitled Project"
            className="w-48 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-green-500"></div>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}