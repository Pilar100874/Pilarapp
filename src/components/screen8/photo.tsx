import { useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils, Mesh, PlaneGeometry, Shape, ShapeGeometry } from 'three';
import { Plane, Text } from '@react-three/drei';

type Photo = {
  defaultSrc: string;
  alternateSrc: string;
  index: number;
  totalPhotos: number;
};

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

export const Photo = (props: Photo) => {
  const defaultTexture = useTexture(props.defaultSrc);
  const alternateTexture = useTexture(props.alternateSrc);
  const ref = useRef<Mesh>(null);
  const buttonRef = useRef<Mesh>(null);
  const scroll = useScroll();
  const [isHovered, setIsHovered] = useState(false);
  const [isAlternate, setIsAlternate] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { viewport } = useThree();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  const columns = isMobile ? 2 : 3;
  // Further reduced spacing between images
  const spacing = isMobile ? 2.2 : 2.8;
  const verticalSpacing = isMobile ? 3.2 : 4.3;
  
  const column = props.index % columns;
  const row = Math.floor(props.index / columns);
  
  const baseX = (column - (columns === 2 ? 0.5 : 1)) * spacing;
  const baseY = -row * verticalSpacing;
  const baseZ = 0;

  // Apply 20% reduction to the base scale
  const baseScale = 0.8; // 20% reduction from 1
  const scale = isMobile ? (baseScale * 0.7) : baseScale;

  // Button configuration - moved up 3cm (0.3 units) from previous position
  const buttonFontSize = isMobile ? 0.12 : 0.15;
  const imageHeight = 4.5 * scale; // Image height with scale applied
  const buttonY = baseY - (imageHeight / 2) + 0.05 + 0.3; // Added 0.3 units (3cm) to move up

  // Create rounded rectangle geometry for button
  const buttonWidth = 1.5;
  const buttonHeight = 0.4;
  const borderRadius = 0.08; // Rounded corner radius
  const roundedShape = createRoundedRectShape(buttonWidth, buttonHeight, borderRadius);
  const roundedGeometry = new ShapeGeometry(roundedShape);

  useFrame((state) => {
    if (!ref.current) return;

    const scrollOffset = scroll.offset;
    const parallaxStrength = isMobile ? 1.5 : 2;
    const parallaxY = scrollOffset * parallaxStrength;
    
    const mouseX = state.mouse.x * (isMobile ? 0.3 : 0.5);
    const mouseY = state.mouse.y * (isMobile ? 0.3 : 0.5);

    ref.current.position.x = MathUtils.lerp(
      ref.current.position.x,
      baseX + mouseX,
      0.1
    );
    ref.current.position.y = MathUtils.lerp(
      ref.current.position.y,
      baseY + parallaxY + mouseY,
      0.1
    );
    ref.current.position.z = MathUtils.lerp(
      ref.current.position.z,
      baseZ + (isHovered ? 1 : 0),
      0.1
    );

    const targetScale = (isHovered ? 1.1 : 1) * scale;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);

    ref.current.rotation.x = MathUtils.lerp(
      ref.current.rotation.x,
      mouseY * (isMobile ? 0.1 : 0.2),
      0.1
    );
    ref.current.rotation.y = MathUtils.lerp(
      ref.current.rotation.y,
      mouseX * (isMobile ? 0.1 : 0.2),
      0.1
    );

    // Update button position to follow the image
    if (buttonRef.current) {
      buttonRef.current.position.x = MathUtils.lerp(
        buttonRef.current.position.x,
        baseX + mouseX,
        0.1
      );
      buttonRef.current.position.y = MathUtils.lerp(
        buttonRef.current.position.y,
        buttonY + parallaxY + mouseY,
        0.1
      );
      buttonRef.current.position.z = MathUtils.lerp(
        buttonRef.current.position.z,
        baseZ + (isHovered ? 1 : 0) + 0.1,
        0.1
      );

      // Button hover effect
      const buttonScale = isButtonHovered ? 1.1 : 1;
      buttonRef.current.scale.x = MathUtils.lerp(buttonRef.current.scale.x, buttonScale, 0.1);
      buttonRef.current.scale.y = MathUtils.lerp(buttonRef.current.scale.y, buttonScale, 0.1);
    }
  });

  const handleButtonClick = () => {
    window.open('https://www.pilar.com.br', '_blank');
  };

  return (
    <group>
      <Plane
        ref={ref}
        args={[3.25, 4.5]}
        material-map={isAlternate ? alternateTexture : defaultTexture}
        material-transparent
        material-alphaTest={0.1}
        onClick={() => setIsAlternate(!isAlternate)}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          setIsHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setIsHovered(false);
        }}
      />
      
      {/* Button - only show when alternate image is displayed, moved up 3cm with rounded borders */}
      {isAlternate && (
        <group
          ref={buttonRef}
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
            Conhecer ..
          </Text>
        </group>
      )}
    </group>
  );
};