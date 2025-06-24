import { useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useCallback } from 'react';
import { MathUtils, Mesh, Vector3 } from 'three';
import { Plane } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';

type Photo = {
  src: string;
  index: number;
  isActive: boolean;
  totalPhotos: number;
  activeIndex: number;
  onClick?: () => void;
  useMobileLayout: boolean;
  isTransitioning: boolean;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scroll = useScroll();
  const { viewport } = useThree();
  const { 
    isMobilePortrait, 
    isTabletPortrait, 
    isMobile,
    isTablet 
  } = useResponsiveText();

  // Fan carousel configuration
  const getFanConfig = () => {
    if (props.useMobileLayout) {
      return {
        // Mobile fan layout
        fanRadius: 2.5,
        fanAngleSpread: Math.PI * 0.8, // 144 degrees spread
        centerOffset: { x: 0, y: -1, z: 0 },
        baseScale: 0.5, // Reduced by 20% from 0.625
        activeScale: 0.64, // Reduced by 20% from 0.8
        inactiveScale: 0.4, // Reduced by 20% from 0.5
        rotationIntensity: 0.15,
        hoverLift: 0.3,
        depthVariation: 1.2
      };
    } else {
      return {
        // Desktop fan layout
        fanRadius: 4.5,
        fanAngleSpread: Math.PI * 0.9, // 162 degrees spread
        centerOffset: { x: 0, y: -0.5, z: -1 },
        baseScale: 0.64, // Reduced by 20% from 0.8
        activeScale: 0.88, // Reduced by 20% from 1.1
        inactiveScale: 0.56, // Reduced by 20% from 0.7
        rotationIntensity: 0.25,
        hoverLift: 0.5,
        depthVariation: 2
      };
    }
  };

  const config = getFanConfig();

  // Calculate fan positioning
  const getFanPosition = () => {
    const relativeIndex = props.index - props.activeIndex;
    const totalPhotos = props.totalPhotos;
    
    // Calculate angle for fan spread
    const normalizedIndex = props.index / (totalPhotos - 1); // 0 to 1
    const fanAngle = (normalizedIndex - 0.5) * config.fanAngleSpread; // Center the fan
    
    // Calculate position on the fan arc
    const x = Math.sin(fanAngle) * config.fanRadius + config.centerOffset.x;
    const y = -Math.abs(Math.cos(fanAngle)) * (config.fanRadius * 0.3) + config.centerOffset.y;
    const z = Math.cos(fanAngle) * config.depthVariation + config.centerOffset.z;
    
    // Active photo comes forward
    const activeBoost = props.isActive ? 1.5 : 0;
    const finalZ = z + activeBoost;
    
    // Rotation to face the center (like cards in a fan)
    const cardRotation = fanAngle * 0.7; // Slight rotation towards center
    
    return {
      x,
      y,
      z: finalZ,
      rotation: cardRotation,
      fanAngle
    };
  };

  // Smooth click handler
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    
    const locationUrls: { [key: string]: string } = {
      '/sp.png': 'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=Rua+Jardim+Suspenso+126+Embu+das+Artes+SP',
      '/rs.png': 'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=Rua+Frederico+Groehs+Neto+755+Novo+Hamburgo+RS',
      '/es.png': 'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=RUA+OCIDENTAL+16+vila+velha+es',
      '/to.png': 'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=Q+1012+SUL+ALAMEDA+3+8+palmas+to',
      '/ba.png': 'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=AVENIDA+DUQUE+DE+CAXIAS+30+Bauru+SP',
      '/pr.png': 'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=ESTRADA+PROGRESSO+968+maringa+pr',
      '/go.png': 'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=Rua+250+933+Goiania+GO'
    };

    if (locationUrls[props.src]) {
      window.open(locationUrls[props.src], '_blank');
    }

    if (props.onClick) {
      props.onClick();
    }
  }, [props.src, props.onClick]);

  // Enhanced hover handlers
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (!isMobile && !isTablet) {
      document.body.style.cursor = 'pointer';
    }
  }, [isMobile, isTablet]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isMobile && !isTablet) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile, isTablet]);

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.getElapsedTime();
    const position = getFanPosition();
    
    // Smooth transitions with fan-specific easing
    const transitionSpeed = props.isTransitioning ? 0.12 : 0.06;
    
    // Mouse interaction for subtle parallax
    const mouseInfluence = new Vector3(
      state.mouse.x * 0.3,
      state.mouse.y * 0.2,
      0
    );
    
    // Target position with mouse influence
    const targetX = position.x + mouseInfluence.x;
    const targetY = position.y + mouseInfluence.y;
    const targetZ = position.z + (isHovered ? config.hoverLift : 0);

    // Smooth position interpolation
    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, transitionSpeed);
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, transitionSpeed);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, transitionSpeed);

    // Fan-style rotation with subtle floating
    const floatingRotation = Math.sin(time * 0.4 + props.index * 0.5) * 0.03;
    const targetRotationY = position.rotation + floatingRotation;
    const targetRotationX = Math.sin(time * 0.2 + props.index) * 0.01;
    const targetRotationZ = Math.sin(time * 0.3 + props.index) * 0.005; // Subtle card flutter
    
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotationY, transitionSpeed);
    ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, targetRotationX, transitionSpeed);
    ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, targetRotationZ, transitionSpeed);

    // Dynamic scaling with breathing effect
    const breathingScale = 1 + Math.sin(time * 0.6 + props.index * 0.3) * 0.015;
    const baseScale = props.isActive ? config.activeScale : config.inactiveScale;
    const hoverScale = isHovered ? 1.15 : 1;
    const targetScale = baseScale * hoverScale * breathingScale;

    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, transitionSpeed);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, transitionSpeed);

    // Enhanced glow effect for active photo
    if (glowRef.current) {
      const glowOpacity = props.isActive ? 0.4 : (isHovered ? 0.15 : 0);
      const currentOpacity = (glowRef.current.material as any).opacity;
      (glowRef.current.material as any).opacity = MathUtils.lerp(currentOpacity, glowOpacity, 0.08);
      
      // Pulsing glow with fan-specific timing
      const pulseIntensity = 0.15 + Math.sin(time * 1.5 + position.fanAngle) * 0.08;
      glowRef.current.scale.setScalar(1.3 + pulseIntensity);
      
      // Copy main photo transformations to glow
      glowRef.current.position.copy(ref.current.position);
      glowRef.current.rotation.copy(ref.current.rotation);
      glowRef.current.position.z -= 0.1; // Slightly behind
    }
  });

  // Reduced image dimensions by 20%
  const imageWidth = 3.25 * 0.8; // 2.6
  const imageHeight = 4.5 * 0.8; // 3.6

  return (
    <group>
      {/* Enhanced glow effect for fan cards */}
      <Plane
        ref={glowRef}
        args={[imageWidth * 1.4, imageHeight * 1.4]}
      >
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0}
          depthWrite={false}
        />
      </Plane>
      
      {/* Main photo card with fan positioning */}
      <Plane
        ref={ref}
        args={[imageWidth, imageHeight]}
        material-map={photo}
        material-transparent
        material-alphaTest={0.1}
        material-depthWrite={false}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      
      {/* Subtle shadow effect for depth */}
      {!props.useMobileLayout && (
        <Plane
          args={[imageWidth * 0.9, imageHeight * 0.9]}
          position-y={-0.1}
          position-z={-0.05}
          rotation-x={Math.PI * 0.1}
        >
          <meshBasicMaterial 
            color="#000000"
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </Plane>
      )}
    </group>
  );
};