import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Shape, ShapeGeometry, Group } from 'three';

// Function to create rounded rectangle shape
const createRoundedRectShape = (width: number, height: number, radius: number) => {
  const shape = new Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  
  return shape;
};

export const ShopButton = () => {
  const buttonRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  const buttonWidth = isMobile ? 2.5 : 3.5;
  const buttonHeight = isMobile ? 0.6 : 0.8;
  const fontSize = isMobile ? 0.18 : 0.25;
  const borderRadius = 0.12;

  // Create rounded rectangle geometry for button
  const roundedShape = createRoundedRectShape(buttonWidth, buttonHeight, borderRadius);
  const roundedGeometry = new ShapeGeometry(roundedShape);

  useFrame(() => {
    if (!buttonRef.current) return;

    // Button hover animation
    const targetScale = isHovered ? 1.1 : 1;
    buttonRef.current.scale.x = buttonRef.current.scale.x + (targetScale - buttonRef.current.scale.x) * 0.1;
    buttonRef.current.scale.y = buttonRef.current.scale.y + (targetScale - buttonRef.current.scale.y) * 0.1;

    // Subtle floating animation - moved down 32cm total (3.2 units)
    const time = Date.now() * 0.001;
    buttonRef.current.position.y = Math.sin(time) * 0.05 - 3.2;
  });

  const handleClick = () => {
    window.open('https://loja.pilar.com.br/', '_blank');
  };

  return (
    <group
      ref={buttonRef}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setIsHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setIsHovered(false);
      }}
    >
      {/* Button background with rounded corners */}
      <mesh position-z={0.01} geometry={roundedGeometry}>
        <meshBasicMaterial 
          color={isHovered ? "#ffffff" : "#f0f0f0"} 
          transparent 
          opacity={0.95}
        />
      </mesh>
      
      {/* Button border */}
      <mesh position-z={0.005} geometry={roundedGeometry} scale={[1.02, 1.02, 1]}>
        <meshBasicMaterial 
          color={isHovered ? "#333333" : "#666666"} 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Button text */}
      <Text
        fontSize={fontSize}
        color={isHovered ? "#000000" : "#333333"}
        position-z={0.02}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        Conhecer mais..
      </Text>
    </group>
  );
};