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
  const { isTabletPortrait } = useResponsiveText();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  const spacing = isMobile ? 1.75 : 2.5;
  const centerZ = 0;
  const sideZ = isMobile ? -1.5 : -2;
  const rotationFactor = isMobile ? 0.25 : 0.35;
  const perspective = isMobile ? 1 : 1.5;
  
  // Base scale with 30% reduction for tablet portrait
  let baseScale = isMobile ? 0.7 : 1;
  if (isTabletPortrait) {
    baseScale = baseScale * 0.7; // 30% reduction for tablet portrait
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

  // Smooth hover handlers
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

    const relativeIndex = props.index - props.activeIndex;
    
    const targetX = relativeIndex * spacing;
    
    let targetZ = centerZ;
    if (relativeIndex !== 0) {
      targetZ = sideZ - Math.abs(relativeIndex) * perspective;
    }

    const targetRotationY = -relativeIndex * rotationFactor;

    const hoverScale = isHovered ? 1.05 : 1; // Reduced hover effect to prevent flicker
    const targetScale = props.isActive ? hoverScale * baseScale : hoverScale * baseScale * 0.85;

    // Smoother interpolation to prevent flicker
    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.08);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.08);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotationY, 0.08);
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.08);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.08);
  });

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