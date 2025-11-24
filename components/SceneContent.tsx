import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../types';

interface SceneContentProps {
  targetPosition: [number, number, number];
  showHelpers: boolean;
  viewMode: 'perspective' | 'left' | 'right';
}

export const SceneContent: React.FC<SceneContentProps> = ({ 
  targetPosition, 
  showHelpers,
  viewMode 
}) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (cubeRef.current) cubeRef.current.rotation.y += delta * 0.5;
    if (sphereRef.current) {
        sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 2 + 3;
    }
    if (torusRef.current) {
        torusRef.current.rotation.x += delta * 0.2;
        torusRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />

      {/* Floor Grid for perspective reference */}
      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        sectionColor="#4b5563" 
        cellColor="#374151" 
        position={[0, -2, 0]} 
      />

      {/* The Target Object (Focus Point) */}
      <group position={targetPosition}>
        <mesh ref={cubeRef} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={COLORS.target} roughness={0.3} metalness={0.8} />
        </mesh>
        {showHelpers && (
          <Text position={[0, 2.5, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="bottom">
            Target
          </Text>
        )}
        <pointLight intensity={2} distance={10} color={COLORS.target} />
      </group>

      {/* Background Objects to show Parallax */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
        <mesh ref={sphereRef} position={[-8, 3, -15]} castShadow>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial color="#8b5cf6" roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={torusRef} position={[8, 0, -25]} castShadow>
          <torusKnotGeometry args={[2, 0.6, 100, 16]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </Float>

      {/* Foreground Object */}
      <mesh position={[-5, -1, 10]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>
      
      {/* Reference pillars */}
      <mesh position={[10, 0, 0]}>
         <boxGeometry args={[1, 10, 1]} />
         <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-10, 0, 0]}>
         <boxGeometry args={[1, 10, 1]} />
         <meshStandardMaterial color="#333" />
      </mesh>

    </>
  );
};