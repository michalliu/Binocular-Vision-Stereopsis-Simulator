import React from 'react';
import { Eye, Target, Ruler, Info, Monitor, Glasses, MoveHorizontal } from 'lucide-react';
import { SimulationState } from '../types';

interface ControlPanelProps {
  state: SimulationState;
  onChange: (key: keyof SimulationState, value: number | boolean | string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange }) => {
  return (
    <div className="bg-gray-900 border-l border-gray-800 w-full lg:w-80 h-full p-6 flex flex-col gap-8 overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          Controls
        </h2>
        <p className="text-gray-400 text-sm">Adjust optical parameters</p>
      </div>

      {/* View Mode Selector */}
      <div className="space-y-3 pb-4 border-b border-gray-800">
        <label className="text-sm font-medium text-gray-300">Viewing Mode</label>
        <div className="grid grid-cols-3 gap-2">
            <button
                onClick={() => onChange('viewMode', 'split')}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-colors ${
                    state.viewMode === 'split' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
                <Monitor className="w-4 h-4 mb-1" />
                Standard
            </button>
            <button
                onClick={() => onChange('viewMode', 'anaglyph')}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-colors ${
                    state.viewMode === 'anaglyph' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
                <Glasses className="w-4 h-4 mb-1" />
                Red/Cyan
            </button>
            <button
                onClick={() => onChange('viewMode', 'cross')}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-colors ${
                    state.viewMode === 'cross' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
                <MoveHorizontal className="w-4 h-4 mb-1" />
                Cross-Eye
            </button>
        </div>
        <p className="text-xs text-gray-500">
            {state.viewMode === 'split' && "Standard educational side-by-side view."}
            {state.viewMode === 'anaglyph' && "Requires Red/Blue 3D glasses. Provides real depth."}
            {state.viewMode === 'cross' && "Cross your eyes until the images overlap to see 3D."}
        </p>
      </div>

      {/* IPD Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Ruler className="w-4 h-4 text-indigo-400" />
                IPD (Separation)
            </label>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-indigo-300 font-mono">
                {state.ipd.toFixed(1)} cm
            </span>
        </div>
        <input
          type="range"
          min="0"
          max="15"
          step="0.1"
          value={state.ipd}
          onChange={(e) => onChange('ipd', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
        />
        <p className="text-xs text-gray-500">
            Simulates distance between pupils. Wider IPD increases depth perception.
        </p>
      </div>

      {/* Focus Distance Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Target className="w-4 h-4 text-emerald-400" />
                Object Distance
            </label>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-emerald-300 font-mono">
                {state.focusDistance.toFixed(1)} m
            </span>
        </div>
        <input
          type="range"
          min="5"
          max="30"
          step="0.5"
          value={state.focusDistance}
          onChange={(e) => onChange('focusDistance', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
        />
      </div>

      {/* Target X Position */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-300">
                Target Horizontal Shift
            </label>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 font-mono">
                {state.targetX.toFixed(1)}
            </span>
        </div>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.5"
          value={state.targetX}
          onChange={(e) => onChange('targetX', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-500 hover:accent-gray-400"
        />
      </div>

      {/* Toggles */}
      <div className="pt-4 border-t border-gray-800">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input 
                type="checkbox" 
                className="sr-only peer"
                checked={state.showHelpers}
                onChange={(e) => onChange('showHelpers', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Show Helpers</span>
        </label>
      </div>
      
      <div className="mt-auto bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
                <p className="text-xs text-gray-300 leading-relaxed">
                    <strong>Why can't I see 3D?</strong> Standard screens are 2D. To see depth, each eye must see a slightly different image.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Try <strong>Anaglyph</strong> mode with Red/Blue glasses, or <strong>Cross-Eye</strong> mode by crossing your eyes until the images merge.
                </p>
            </div>
          </div>
      </div>
    </div>
  );
};