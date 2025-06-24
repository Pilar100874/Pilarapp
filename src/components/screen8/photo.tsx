import { useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useCallback } from 'react';
import { MathUtils, Mesh, PlaneGeometry, Shape, ShapeGeometry, Group } from 'three';
import { Plane, Text } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';

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
  // Pre-load both textures to prevent flicker
  const defaultTexture = useTexture(props.defaultSrc);
  const alternateTexture = useTexture(props.alternateSrc);
  
  const ref = useRef<Mesh>(null);
  const buttonRef = useRef<Group>(null);
  const scroll = useScroll();
  const [isHovered, setIsHovered] = useState(false);
  const [isAlternate, setIsAlternate] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { viewport } = useThree();
  const { isMobilePortrait, isTabletPortrait } = useResponsiveText();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  const columns = isMobile ? 2 : 3;
  
  // Base spacing values
  let spacing = isMobile ? 2.2 : 2.8;
  let verticalSpacing = isMobile ? 3.2 : 4.3;
  
  // Reduce spacing by 20% for mobile portrait
  if (isMobilePortrait) {
    spacing = spacing * 0.8; // 20% reduction
    verticalSpacing = verticalSpacing * 0.8; // 20% reduction
  }
  
  const column = props.index % columns;
  const row = Math.floor(props.index / columns);
  
  const baseX = (column - (columns === 2 ? 0.5 : 1)) * spacing;
  const baseY = -row * verticalSpacing;
  const baseZ = 0;

  // Apply 20% reduction to the base scale, plus additional 10% for mobile portrait, plus 30% for tablet portrait
  const baseScale = 0.8; // 20% reduction from 1
  let scale = isMobile ? (baseScale * 0.7) : baseScale;
  
  // Additional 10% reduction for mobile portrait
  if (isMobilePortrait) {
    scale = scale * 0.9; // Additional 10% reduction
  }
  
  // Additional 30% reduction for tablet portrait
  if (isTabletPortrait) {
    scale = scale * 0.7; // 30% reduction for tablet portrait
  }

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

  // Define links for each image based on index
  const getButtonLink = () => {
    const links = [
      'https://www.pilar.com.br/papelaria',     // Image 1
      'https://www.pilar.com.br/construcao',   // Image 2
      'https://www.pilar.com.br/insumos',      // Image 3
      'https://www.pilar.com.br/industrial',   // Image 4
      'https://www.pilar.com.br/grafico',      // Image 5
      'https://www.pilar.com.br/descartaveis'  // Image 6
    ];
    return links[props.index] || 'https://www.pilar.com.br';
  };

  // Smooth image toggle with transition
  const handleImageToggle = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setIsTransitioning(true);
    setIsAlternate(!isAlternate);
    
    // Reset transition state after a short delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
  }, [isAlternate, isTransitioning]);

  useFrame((state) => {
    if (!ref.current) return;

    const scrollOffset = scroll.offset;
    const parallaxStrength = isMobile ? 1.5 : 2;
    const parallaxY = scrollOffset * parallaxStrength;
    
    const mouseX = state.mouse.x * (isMobile ? 0.3 : 0.5);
    const mouseY = state.mouse.y * (isMobile ? 0.3 : 0.5);

    // Smooth position interpolation
    const targetX = baseX + mouseX;
    const targetY = baseY + parallaxY + mouseY;
    const targetZ = baseZ + (isHovered ? 1 : 0);

    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.1);
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, 0.1);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.1);

    // Smooth scale interpolation
    const targetScale = (isHovered ? 1.1 : 1) * scale;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);

    // Smooth rotation interpolation
    const targetRotationX = mouseY * (isMobile ? 0.1 : 0.2);
    const targetRotationY = mouseX * (isMobile ? 0.1 : 0.2);
    
    ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, targetRotationX, 0.1);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotationY, 0.1);

    // Update button position to follow the image smoothly
    if (buttonRef.current) {
      buttonRef.current.position.x = MathUtils.lerp(buttonRef.current.position.x, targetX, 0.1);
      buttonRef.current.position.y = MathUtils.lerp(buttonRef.current.position.y, buttonY + parallaxY + mouseY, 0.1);
      buttonRef.current.position.z = MathUtils.lerp(buttonRef.current.position.z, targetZ + 0.1, 0.1);

      // Button hover effect
      const buttonScale = isButtonHovered ? 1.1 : 1;
      buttonRef.current.scale.x = MathUtils.lerp(buttonRef.current.scale.x, buttonScale, 0.1);
      buttonRef.current.scale.y = MathUtils.lerp(buttonRef.current.scale.y, buttonScale, 0.1);
    }
  });

  const handleButtonClick = useCallback((e: any) => {
    e.stopPropagation(); // Prevent image toggle when clicking button
    window.open(getButtonLink(), '_blank');
  }, [props.index]);

  // Get current texture without causing re-renders
  const currentTexture = isAlternate ? alternateTexture : defaultTexture;

  return (
    <group>
      <Plane
        ref={ref}
        args={[3.25, 4.5]}
        material-map={currentTexture}
        material-transparent
        material-alphaTest={0.1}
        material-depthWrite={false}
        onClick={handleImageToggle}
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
              depthWrite={false}
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