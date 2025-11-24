import React, { useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { SceneContent } from './SceneContent';
import * as THREE from 'three';

interface EyeViewProps {
  eye: 'left' | 'right';
  ipd: number;
  focusDistance: number;
  targetX: number;
  showHelpers: boolean;
  colorMask?: { r: boolean; g: boolean; b: boolean }; // New: For Anaglyph
  className?: string;
}

// Helper component to apply WebGL Color Mask
const ColorMaskHandler = ({ r, g, b }: { r: boolean; g: boolean; b: boolean }) => {
  const { gl } = useThree();
  useLayoutEffect(() => {
    // FIX: gl is the WebGLRenderer, we need the underlying WebGL context to call colorMask
    const context = gl.getContext();
    
    // Safety check if context exists and has the method
    if (context && typeof context.colorMask === 'function') {
       context.colorMask(r, g, b, true);
    }

    return () => {
      // Reset to default on unmount or update
      if (context && typeof context.colorMask === 'function') {
        context.colorMask(true, true, true, true);
      }
    };
  }, [gl, r, g, b]);
  return null;
};

export const EyeView: React.FC<EyeViewProps> = ({ 
  eye, 
  ipd, 
  focusDistance, 
  targetX, 
  showHelpers,
  colorMask,
  className = ""
}) => {
  // Calculate camera position based on IPD
  const eyeX = eye === 'left' ? -ipd / 2 : ipd / 2;
  const eyePos = new THREE.Vector3(eyeX, 0, 20); // Eyes are at Z=20
  
  // Target position in 3D space
  const targetPos = new THREE.Vector3(targetX, 0, 20 - focusDistance);

  const label = eye === 'left' ? 'Left Eye' : 'Right Eye';
  const borderColor = eye === 'left' ? 'border-blue-500' : 'border-red-500';
  
  // For Anaglyph, we remove borders and backgrounds to allow blending
  const containerClasses = colorMask 
    ? `absolute top-0 left-0 w-full h-full ${className}` 
    : `relative w-full h-full border-2 ${borderColor} rounded-lg overflow-hidden bg-gray-900 shadow-lg ${className}`;

  return (
    <div className={containerClasses}>
      {!colorMask && (
        <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider">
          {label}
        </div>
      )}
      
      <Canvas shadows gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }} dpr={[1, 2]}>
        {/* If in Anaglyph mode, apply the color mask */}
        {colorMask && <ColorMaskHandler r={colorMask.r} g={colorMask.g} b={colorMask.b} />}

        <PerspectiveCamera 
            makeDefault 
            position={eyePos} 
            fov={45}
            onUpdate={(c) => c.lookAt(targetPos)}
        />
        
        {/* Pass explicit dark background only if NOT in anaglyph overlay mode. 
            Anaglyph needs transparent background for mix-blend-mode to work. */}
        {!colorMask && <color attach="background" args={['#111827']} />}

        <SceneContent 
            targetPosition={[targetPos.x, targetPos.y, targetPos.z]} 
            showHelpers={showHelpers} 
            viewMode={eye}
        />
        
        {/* Reticle/Crosshair for center reference */}
        {showHelpers && (
             <mesh position={[0,0,-1]} scale={[0.02, 0.02, 0.02]}>
                 <ringGeometry />
                 <meshBasicMaterial color="white" opacity={0.5} transparent />
             </mesh>
        )}
      </Canvas>
    </div>
  );
};