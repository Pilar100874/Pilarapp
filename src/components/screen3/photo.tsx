import { useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useCallback } from 'react';
import { MathUtils, Mesh } from 'three';
import { Plane } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';

type Photo = {
  src: string;
  index: number;
  isActive: boolean;
  totalPhotos: number;
  activeIndex: number;
  onClick?: () => void;
  useGridLayout: boolean;
  useCarouselLayout: boolean;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scroll = useScroll();
  const { viewport } = useThree();
  const { 
    isTabletPortrait, 
    isMobilePortrait, 
    isMobileLandscape, 
    isTabletLandscape,
    isMobile,
    isTablet 
  } = useResponsiveText();

  // Enhanced responsive configuration for different orientations
  const getLayoutConfig = () => {
    if (isMobileLandscape) {
      return {
        columns: 3,
        horizontalSpacing: 2.8,
        verticalSpacing: 4.2,
        baseScale: 0.5,
        carouselSpacing: 1.4,
        centerZ: 0,
        sideZ: -1.2,
        rotationFactor: 0.2,
        perspective: 0.8
      };
    } else if (isTabletLandscape) {
      return {
        columns: 3,
        horizontalSpacing: 4.0,
        verticalSpacing: 5.8,
        baseScale: 0.8,
        carouselSpacing: 2.2,
        centerZ: 0,
        sideZ: -1.8,
        rotationFactor: 0.3,
        perspective: 1.2
      };
    } else if (isMobilePortrait) {
      return {
        columns: 2,
        horizontalSpacing: 3.2,
        verticalSpacing: 5.0,
        baseScale: 0.6,
        carouselSpacing: 1.6,
        centerZ: 0,
        sideZ: -1.4,
        rotationFactor: 0.25,
        perspective: 1.0
      };
    } else if (isTabletPortrait) {
      return {
        columns: 2,
        horizontalSpacing: 4.5,
        verticalSpacing: 6.5,
        baseScale: 0.7,
        carouselSpacing: 2.0,
        centerZ: 0,
        sideZ: -1.6,
        rotationFactor: 0.28,
        perspective: 1.1
      };
    } else {
      // Desktop
      return {
        columns: 3,
        horizontalSpacing: 4.5,
        verticalSpacing: 6.5,
        baseScale: 1.0,
        carouselSpacing: 2.5,
        centerZ: 0,
        sideZ: -2,
        rotationFactor: 0.35,
        perspective: 1.5
      };
    }
  };

  const config = getLayoutConfig();

  // Calculate position in grid layout
  const column = props.index % config.columns;
  const row = Math.floor(props.index / config.columns);
  
  const baseX = (column - (config.columns - 1) / 2) * config.horizontalSpacing;
  const baseY = -row * config.verticalSpacing;
  
  // Only show active photo in carousel mode, or show all in grid mode
  const shouldShow = props.isActive || props.useGridLayout;
  
  // Smooth click handler to prevent flicker
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

  // Enhanced hover handlers for different devices
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

  useFrame(() => {
    if (!ref.current) return;

    if (props.useGridLayout) {
      // Grid layout for mobile/tablet portrait
      ref.current.position.x = baseX;
      ref.current.position.y = baseY;
      ref.current.position.z = 0;
      ref.current.rotation.y = 0;
      
      const hoverScale = isHovered ? 1.05 : 1;
      const targetScale = hoverScale * config.baseScale;
      
      ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.08);
      ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.08);
    } else {
      // Carousel layout for desktop/tablet landscape/mobile landscape
      const relativeIndex = props.index - props.activeIndex;
      
      const targetX = relativeIndex * config.carouselSpacing;
      
      let targetZ = config.centerZ;
      if (relativeIndex !== 0) {
        targetZ = config.sideZ - Math.abs(relativeIndex) * config.perspective;
      }

      const targetRotationY = -relativeIndex * config.rotationFactor;

      const hoverScale = isHovered ? 1.05 : 1;
      const targetScale = props.isActive ? 
        hoverScale * config.baseScale : 
        hoverScale * config.baseScale * 0.85;

      // Smoother interpolation to prevent flicker
      ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.08);
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.08);
      ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotationY, 0.08);
      ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.08);
      ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.08);
    }
  });

  // Don't render if not visible in carousel mode
  if (!shouldShow && props.useCarouselLayout) {
    return null;
  }

  return (
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
  );
};