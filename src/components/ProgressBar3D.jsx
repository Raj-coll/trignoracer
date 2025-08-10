// src/components/ProgressBar3D.jsx

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// This is the actual 3D bar component with textures
function Bar({ currentScore, maxScore }) {
  const fillRef = useRef();

  // 1. LOAD THE TEXTURES
  // The useTexture hook loads our images and prepares them for use in 3D.
  const [borderTexture, fillTexture] = useTexture([
    '/src/assets/images/progress-bar-border-texture.png',
    '/src/assets/images/progress-bar-fill-tile.png'
  ]);

  // 2. CONFIGURE THE FILL TEXTURE TO REPEAT
  // This is crucial for our scrolling animation.
  useEffect(() => {
    fillTexture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
    fillTexture.wrapT = THREE.RepeatWrapping; // Repeat vertically
  }, [fillTexture]);

  // Calculate the target scale based on score (unchanged)
  const targetScale = useMemo(() => {
    if (!maxScore) return 0;
    return Math.min(currentScore / maxScore, 1);
  }, [currentScore, maxScore]);

  // This hook runs on every frame to create animations
  useFrame(() => {
    if (fillRef.current) {
      // Animate the bar's width smoothly (lerping)
      fillRef.current.scale.x = THREE.MathUtils.lerp(
        fillRef.current.scale.x,
        targetScale,
        0.1
      );
      // Keep the bar left-aligned as it scales
      fillRef.current.position.x = -2 * (1 - fillRef.current.scale.x);
    }

    // 3. ANIMATE THE TEXTURE
    // We slowly change the texture's horizontal offset to make it scroll.
    fillTexture.offset.x -= 0.005;
  });

  return (
    <>
      {/* The Background Bar, now using the border texture */}
      <RoundedBox args={[4, 0.3, 0.3]} radius={0.15}>
        {/* We apply the texture using the 'map' property */}
        <meshStandardMaterial map={borderTexture} roughness={0.6} />
      </RoundedBox>

      {/* The Fill Bar, wrapped in a group for scaling */}
      {/* The position-z is slightly raised to prevent flickering */}
      <group ref={fillRef} position={[-2, 0, 0.01]}>
        <RoundedBox args={[4, 0.3, 0.3]} radius={0.15}>
          {/* Apply the scrolling fill texture */}
          <meshStandardMaterial map={fillTexture} roughness={0.4} />
        </RoundedBox>
      </group>
    </>
  );
}


// The main export component remains the same
export default function ProgressBar3D({ score, thresholds }) {
  return (
    <div style={{ width: '100%', maxWidth: '400px', height: '50px', margin: '15px 0 35px 0' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Bar currentScore={score} maxScore={thresholds.threeStars} />
      </Canvas>
    </div>
  );
}