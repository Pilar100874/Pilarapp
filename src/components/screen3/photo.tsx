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

  // Modern carousel configuration
  const getModernConfig = () => {
    if (props.useMobileLayout) {
      return {
        // Stack layout for mobile
        spacing: 0,
        baseScale: 0.8,
        activeScale: 1.0,
        inactiveScale: 0.7,
        zSpacing: 0.5,
        rotationIntensity: 0.1,
        parallaxStrength: 0.3,
        hoverLift: 0.2
      };
    } else {
      return {
        // Modern 3D carousel for desktop
        spacing: 3.5,
        baseScale: 0.9,
        activeScale: 1.2,
        inactiveScale: 0.7,
        zSpacing: 2.5,
        rotationIntensity: 0.4,
        parallaxStrength: 0.8,
        hoverLift: 0.5
      };
    }
  };

  const config = getModernConfig();

  // Calculate modern positioning
  const getModernPosition = () => {
    const relativeIndex = props.index - props.activeIndex;
    
    if (props.useMobileLayout) {
      // Stack layout - only show active and adjacent
      const isVisible = Math.abs(relativeIndex) <= 1;
      if (!isVisible) return { visible: false, x: 0, y: 0, z: -10 };
      
      return {
        visible: true,
        x: relativeIndex * 0.3, // Slight offset for depth
        y: relativeIndex * -0.2, // Slight vertical offset
        z: -Math.abs(relativeIndex) * config.zSpacing,
        rotation: relativeIndex * config.rotationIntensity
      };
    } else {
      // Modern 3D carousel
      const angle = (relativeIndex / props.totalPhotos) * Math.PI * 2;
      const radius = 4;
      
      return {
        visible: true,
        x: Math.sin(angle) * radius + relativeIndex * config.spacing * 0.3,
        y: Math.cos(angle) * 0.5, // Slight vertical wave
        z: Math.cos(angle) * radius - config.zSpacing,
        rotation: angle + relativeIndex * config.rotationIntensity
      };
    }
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
    const position = getModernPosition();
    
    if (!position.visible) {
      ref.current.visible = false;
      return;
    }
    
    ref.current.visible = true;

    // Modern smooth transitions
    const transitionSpeed = props.isTransitioning ? 0.15 : 0.08;
    
    // Position with parallax and mouse interaction
    const mouseInfluence = new Vector3(
      state.mouse.x * config.parallaxStrength,
      state.mouse.y * config.parallaxStrength * 0.5,
      0
    );
    
    const targetX = position.x + mouseInfluence.x;
    const targetY = position.y + mouseInfluence.y;
    const targetZ = position.z + (isHovered ? config.hoverLift : 0);

    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, transitionSpeed);
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, transitionSpeed);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, transitionSpeed);

    // Modern rotation with floating effect
    const floatingRotation = Math.sin(time * 0.5 + props.index) * 0.05;
    const targetRotationY = (position.rotation || 0) + floatingRotation;
    const targetRotationX = Math.sin(time * 0.3 + props.index) * 0.02;
    
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotationY, transitionSpeed);
    ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, targetRotationX, transitionSpeed);

    // Dynamic scaling with breathing effect
    const breathingScale = 1 + Math.sin(time * 0.8 + props.index) * 0.02;
    const baseScale = props.isActive ? config.activeScale : config.inactiveScale;
    const hoverScale = isHovered ? 1.1 : 1;
    const targetScale = baseScale * hoverScale * breathingScale;

    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, transitionSpeed);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, transitionSpeed);

    // Glow effect for active photo
    if (glowRef.current) {
      const glowOpacity = props.isActive ? 0.3 : 0;
      const currentOpacity = (glowRef.current.material as any).opacity;
      (glowRef.current.material as any).opacity = MathUtils.lerp(currentOpacity, glowOpacity, 0.1);
      
      // Pulsing glow
      const pulseIntensity = 0.1 + Math.sin(time * 2) * 0.05;
      glowRef.current.scale.setScalar(1.2 + pulseIntensity);
    }
  });

  const position = getModernPosition();
  if (!position.visible) return null;

  return (
    <group>
      {/* Glow effect for active photo */}
      <Plane
        ref={glowRef}
        args={[3.8, 5.2]}
        position-z={-0.1}
      >
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0}
          depthWrite={false}
        />
      </Plane>
      
      {/* Main photo with modern effects */}
      <Plane
        ref={ref}
        args={[3.25, 4.5]}
        material-map={photo}
        material-transparent
        material-alphaTest={0.1}
        material-depthWrite={false}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      
      {/* Reflection effect for active photo */}
      {props.isActive && !props.useMobileLayout && (
        <Plane
          args={[3.25, 4.5]}
          position-y={-5.5}
          rotation-x={Math.PI}
          scale-y={-0.3}
        >
          <meshBasicMaterial 
            map={photo}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </Plane>
      )}
    </group>
  );
};