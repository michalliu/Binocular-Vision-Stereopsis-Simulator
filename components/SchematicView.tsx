import React from 'react';
import { COLORS } from '../types';

interface SchematicViewProps {
  ipd: number;
  focusDistance: number;
  targetX: number;
}

export const SchematicView: React.FC<SchematicViewProps> = ({ ipd, focusDistance, targetX }) => {
  // Scaling factors to fit the simulation values into the SVG viewbox
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 300;
  const SCALE_X = 20; // Scale world units to pixels
  const SCALE_Y = 8;
  
  const centerX = CANVAS_WIDTH / 2;
  const bottomY = CANVAS_HEIGHT - 40;
  
  // Eye positions in SVG coords
  const leftEyeX = centerX - (ipd / 2) * SCALE_X;
  const rightEyeX = centerX + (ipd / 2) * SCALE_X;
  const eyesY = bottomY;

  // Target position in SVG coords
  // Focus distance is how far 'in' it is. In simulation, eyes are at Z=20, target at 20-dist.
  // Here, we draw eyes at bottom, target moves up.
  const targetSvgX = centerX + targetX * SCALE_X;
  const targetSvgY = bottomY - focusDistance * SCALE_Y;

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-700 relative flex flex-col items-center justify-center p-4">
       <h3 className="absolute top-2 left-4 text-gray-400 text-sm font-semibold uppercase tracking-widest">
         Optical Geometry (Top-Down)
       </h3>
       
       <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Vision Cones (Visual Field) */}
          <path 
            d={`M ${leftEyeX} ${eyesY} L ${targetSvgX - 200} 0 L ${targetSvgX + 100} 0 Z`} 
            fill={COLORS.leftEye} 
            fillOpacity="0.05" 
          />
          <path 
            d={`M ${rightEyeX} ${eyesY} L ${targetSvgX - 100} 0 L ${targetSvgX + 200} 0 Z`} 
            fill={COLORS.rightEye} 
            fillOpacity="0.05" 
          />

          {/* Gaze Lines */}
          <line 
            x1={leftEyeX} y1={eyesY} 
            x2={targetSvgX} y2={targetSvgY} 
            stroke={COLORS.leftEye} 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
          <line 
            x1={rightEyeX} y1={eyesY} 
            x2={targetSvgX} y2={targetSvgY} 
            stroke={COLORS.rightEye} 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />

          {/* Baseline (IPD) */}
          <line 
            x1={leftEyeX} y1={eyesY + 20} 
            x2={rightEyeX} y2={eyesY + 20} 
            stroke="#6b7280" 
            strokeWidth="2" 
            markerEnd="url(#arrow)" 
            markerStart="url(#arrow)"
          />
          <text x={centerX} y={eyesY + 35} fill="#9ca3af" fontSize="12" textAnchor="middle">
            IPD
          </text>

          {/* Eyes */}
          <circle cx={leftEyeX} cy={eyesY} r="8" fill={COLORS.leftEye} stroke="white" strokeWidth="2" />
          <circle cx={rightEyeX} cy={eyesY} r="8" fill={COLORS.rightEye} stroke="white" strokeWidth="2" />

          {/* Target */}
          <circle cx={targetSvgX} cy={targetSvgY} r="6" fill={COLORS.target} stroke="white" strokeWidth="2" />
          
          {/* Angle Visualization (Convergence) */}
          <path
             d={`M ${leftEyeX + 15} ${eyesY - 5} Q ${leftEyeX + 10} ${eyesY - 20} ${leftEyeX + 25} ${eyesY - 25}`}
             fill="none" stroke="white" opacity="0.3"
          />
       </svg>
       
       <div className="absolute bottom-4 right-4 bg-gray-800 p-2 rounded text-xs text-gray-400 border border-gray-700">
         <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Left Eye Ray
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Right Eye Ray
         </div>
       </div>
    </div>
  );
};