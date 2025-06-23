import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useCallback } from 'react';
import { Shape, ShapeGeometry, Group } from 'three';
import { useResponsiveText } from '@/utils/responsive';

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
  const { getFontSize, getSpacing, isMobile } = useResponsiveText();

  // Responsive configuration with orientation consideration
  const buttonWidth = getFontSize(2.0, 2.5, 2.4, 2.8, 3.5);
  const buttonHeight = getFontSize(0.5, 0.45, 0.55, 0.65, 0.8);
  const fontSize = getFontSize(0.15, 0.13, 0.17, 0.2, 0.25);
  const borderRadius = getFontSize(0.08, 0.07, 0.09, 0.1, 0.12);

  // Create rounded rectangle geometry for button
  const roundedShape = createRoundedRectShape(buttonWidth, buttonHeight, borderRadius);
  const roundedGeometry = new ShapeGeometry(roundedShape);

  // Smooth handlers to prevent flicker
  const handlePointerOver = useCallback(() => {
    if (!isMobile) {
      document.body.style.cursor = 'pointer';
    }
    setIsHovered(true);
  }, [isMobile]);

  const handlePointerOut = useCallback(() => {
    if (!isMobile) {
      document.body.style.cursor = 'default';
    }
    setIsHovered(false);
  }, [isMobile]);

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    window.open('https://loja.pilar.com.br/', '_blank');
  }, []);

  useFrame(() => {
    if (!buttonRef.current) return;

    // Smoother button hover animation
    const targetScale = isHovered ? 1.05 : 1; // Reduced scale to prevent flicker
    buttonRef.current.scale.x = buttonRef.current.scale.x + (targetScale - buttonRef.current.scale.x) * 0.08;
    buttonRef.current.scale.y = buttonRef.current.scale.y + (targetScale - buttonRef.current.scale.y) * 0.08;

    // Subtle floating animation with responsive positioning
    const time = Date.now() * 0.001;
    const floatOffset = Math.sin(time) * 0.03; // Reduced float amplitude
    const baseOffset = getSpacing(-2.5, -2.0, -2.7, -2.9, -3.2);
    buttonRef.current.position.y = floatOffset + baseOffset;
  });

  return (
    <group
      ref={buttonRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Button background with rounded corners */}
      <mesh position-z={0.01} geometry={roundedGeometry}>
        <meshBasicMaterial 
          color={isHovered ? "#ffffff" : "#f0f0f0"} 
          transparent 
          opacity={0.95}
          depthWrite={false}
        />
      </mesh>
      
      {/* Button border */}
      <mesh position-z={0.005} geometry={roundedGeometry} scale={[1.02, 1.02, 1]}>
        <meshBasicMaterial 
          color={isHovered ? "#333333" : "#666666"} 
          transparent 
          opacity={0.3}
          depthWrite={false}
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
      >
        Conhecer mais..
      </Text>
    </group>
  );
};