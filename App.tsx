import React, { useState } from 'react';
import { EyeView } from './components/EyeView';
import { SchematicView } from './components/SchematicView';
import { ControlPanel } from './components/ControlPanel';
import { INITIAL_STATE, SimulationState } from './types';
import { Glasses } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);

  const handleStateChange = (key: keyof SimulationState, value: number | boolean | string) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="flex-none h-14 border-b border-gray-800 bg-gray-900 flex items-center px-6 gap-3">
        <Glasses className="w-6 h-6 text-blue-500" />
        <h1 className="text-lg font-bold tracking-tight">Binocular Vision & Stereopsis Simulator</h1>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto bg-black">
          
          {/* Top Half: The Eyes Simulation */}
          <div className="flex-none h-[55%] min-h-[350px] relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
             
             {/* Standard Side-by-Side Mode */}
             {state.viewMode === 'split' && (
               <div className="absolute inset-0 flex gap-4 p-4">
                  <div className="flex-1 relative">
                      <EyeView 
                        eye="left" 
                        ipd={state.ipd} 
                        focusDistance={state.focusDistance}
                        targetX={state.targetX}
                        showHelpers={state.showHelpers}
                      />
                  </div>
                  <div className="flex-1 relative">
                      <EyeView 
                        eye="right" 
                        ipd={state.ipd} 
                        focusDistance={state.focusDistance}
                        targetX={state.targetX}
                        showHelpers={state.showHelpers}
                      />
                  </div>
               </div>
             )}

             {/* Cross-Eye Mode (Swapped positions) */}
             {state.viewMode === 'cross' && (
               <div className="absolute inset-0 flex gap-4 p-4">
                  <div className="flex-1 relative order-2">
                      <EyeView 
                        eye="left" 
                        ipd={state.ipd} 
                        focusDistance={state.focusDistance}
                        targetX={state.targetX}
                        showHelpers={state.showHelpers}
                      />
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 text-[10px] text-blue-300 rounded">L (View with Right Eye)</div>
                  </div>
                  <div className="flex-1 relative order-1">
                      <EyeView 
                        eye="right" 
                        ipd={state.ipd} 
                        focusDistance={state.focusDistance}
                        targetX={state.targetX}
                        showHelpers={state.showHelpers}
                      />
                       <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-[10px] text-red-300 rounded">R (View with Left Eye)</div>
                  </div>
                  {/* Center fusion guide */}
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-700 transform -translate-x-1/2 z-20" />
               </div>
             )}

             {/* Anaglyph Mode (Red/Cyan Overlay) */}
             {state.viewMode === 'anaglyph' && (
               <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="relative w-full h-full">
                      {/* Left Eye (Red Channel) */}
                      <EyeView 
                        eye="left" 
                        ipd={state.ipd} 
                        focusDistance={state.focusDistance}
                        targetX={state.targetX}
                        showHelpers={state.showHelpers}
                        colorMask={{ r: true, g: false, b: false }}
                        className="mix-blend-screen pointer-events-none z-10"
                      />
                      {/* Right Eye (Cyan Channel: Green + Blue) */}
                      <EyeView 
                        eye="right" 
                        ipd={state.ipd} 
                        focusDistance={state.focusDistance}
                        targetX={state.targetX}
                        showHelpers={state.showHelpers}
                        colorMask={{ r: false, g: true, b: true }}
                        className="mix-blend-screen pointer-events-none z-10"
                      />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm font-mono">
                         Wear Red (Left) / Cyan (Right) Glasses
                      </div>
                  </div>
               </div>
             )}

          </div>

          {/* Bottom Half: Schematic Diagram */}
          <div className="flex-1 min-h-[200px] relative">
            <SchematicView 
               ipd={state.ipd} 
               focusDistance={state.focusDistance} 
               targetX={state.targetX}
            />
          </div>
        </div>

        {/* Right Sidebar: Controls */}
        <div className="flex-none z-20 shadow-xl border-l border-gray-800">
           <ControlPanel state={state} onChange={handleStateChange} />
        </div>
      </main>
    </div>
  );
};

export default App;