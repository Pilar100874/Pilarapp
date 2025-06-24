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
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scroll = useScroll();
  const { viewport } = useThree();
  const { isTabletPortrait, isMobilePortrait } = useResponsiveText();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  
  // Use mobile portrait layout for both mobile portrait AND tablet portrait
  const useMobileLayout = isMobilePortrait || isTabletPortrait;

  // Layout configuration - organize in rows to prevent overlap
  const columns = useMobileLayout ? 2 : 3; // 2 columns for mobile, 3 for desktop
  const rows = Math.ceil(props.totalPhotos / columns);
  
  // Calculate position in grid
  const column = props.index % columns;
  const row = Math.floor(props.index / columns);
  
  // Spacing configuration with proper separation
  const horizontalSpacing = useMobileLayout ? 3.5 : 4.5; // Increased horizontal spacing
  const verticalSpacing = useMobileLayout ? 5.5 : 6.5; // Increased vertical spacing for clear separation
  
  // Calculate base position in grid layout
  const baseX = (column - (columns - 1) / 2) * horizontalSpacing;
  const baseY = -row * verticalSpacing; // Negative to stack downward
  
  // Only show active photo in carousel mode, or show all in grid mode
  const shouldShow = props.isActive || useMobileLayout;
  
  // For carousel mode (desktop/tablet landscape), use original carousel logic
  const carouselSpacing = isMobile ? 1.75 : 2.5;
  const centerZ = 0;
  const sideZ = isMobile ? -1.5 : -2;
  const rotationFactor = isMobile ? 0.25 : 0.35;
  const perspective = isMobile ? 1 : 1.5;
  
  // Base scale with reductions for tablet portrait (same as mobile portrait)
  let baseScale = isMobile ? 0.7 : 1;
  if (isTabletPortrait || isMobilePortrait) {
    baseScale = baseScale * 0.7; // 30% reduction for both tablet portrait and mobile portrait
  }

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

  // Smooth hover handlers - disable for both mobile portrait and tablet portrait
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (!isMobile && !isTabletPortrait) {
      document.body.style.cursor = 'pointer';
    }
  }, [isMobile, isTabletPortrait]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isMobile && !isTabletPortrait) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile, isTabletPortrait]);

  useFrame(() => {
    if (!ref.current) return;

    if (useMobileLayout) {
      // Grid layout for mobile - static positioning
      ref.current.position.x = baseX;
      ref.current.position.y = baseY;
      ref.current.position.z = 0;
      ref.current.rotation.y = 0;
      
      const hoverScale = isHovered ? 1.05 : 1;
      const targetScale = hoverScale * baseScale;
      
      ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.08);
      ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.08);
    } else {
      // Carousel layout for desktop/tablet landscape
      const relativeIndex = props.index - props.activeIndex;
      
      const targetX = relativeIndex * carouselSpacing;
      
      let targetZ = centerZ;
      if (relativeIndex !== 0) {
        targetZ = sideZ - Math.abs(relativeIndex) * perspective;
      }

      const targetRotationY = -relativeIndex * rotationFactor;

      const hoverScale = isHovered ? 1.05 : 1;
      const targetScale = props.isActive ? hoverScale * baseScale : hoverScale * baseScale * 0.85;

      // Smoother interpolation to prevent flicker
      ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.08);
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.08);
      ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotationY, 0.08);
      ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.08);
      ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.08);
    }
  });

  // Don't render if not visible in carousel mode
  if (!shouldShow && !useMobileLayout) {
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