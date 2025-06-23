import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils, Mesh, Shape, ShapeGeometry } from 'three';
import { Text } from '@react-three/drei';

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
  const buttonRef = useRef<Mesh>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { viewport } = useThree();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  const buttonFontSize = isMobile ? 0.15 : 0.18;
  
  // Position the button after screen9 content
  const buttonY = -75; // Position after screen9 content
  const buttonX = 0;
  const buttonZ = 0;

  // Create rounded rectangle geometry for button
  const buttonWidth = isMobile ? 2.2 : 2.8;
  const buttonHeight = isMobile ? 0.5 : 0.6;
  const borderRadius = 0.08; // Rounded corner radius
  const roundedShape = createRoundedRectShape(buttonWidth, buttonHeight, borderRadius);
  const roundedGeometry = new ShapeGeometry(roundedShape);

  useFrame((state) => {
    if (!buttonRef.current) return;

    // Button hover effect
    const buttonScale = isButtonHovered ? 1.1 : 1;
    buttonRef.current.scale.x = MathUtils.lerp(buttonRef.current.scale.x, buttonScale, 0.1);
    buttonRef.current.scale.y = MathUtils.lerp(buttonRef.current.scale.y, buttonScale, 0.1);
  });

  const handleButtonClick = () => {
    window.open('https://loja.pilar.com.br/', '_blank');
  };

  return (
    <group
      ref={buttonRef}
      position={[buttonX, buttonY, buttonZ]}
      onClick={handleButtonClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setIsButtonHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setIsButtonHovered(false);
      }}
    >
      {/* Button background with rounded corners */}
      <mesh position-z={0.01} geometry={roundedGeometry}>
        <meshBasicMaterial 
          color={isButtonHovered ? "#ffffff" : "#f0f0f0"} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Button text */}
      <Text
        fontSize={buttonFontSize}
        color={isButtonHovered ? "#000000" : "#333333"}
        position-z={0.02}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        Conhecer mais..
      </Text>
    </group>
  );
};