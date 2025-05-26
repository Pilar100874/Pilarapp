import { useThree } from '@react-three/fiber';

export const useResponsiveScale = (baseScale: number, isMobile: boolean) => {
  const { viewport } = useThree();
  const aspectRatio = viewport.width / viewport.height;

  // Base multiplier for mobile devices
  const mobileMultiplier = isMobile ? 0.7 : 1;

  // Scale based on viewport width and aspect ratio
  let scale = baseScale * mobileMultiplier;

  // Adjust scale based on aspect ratio
  if (aspectRatio < 1) { // Portrait
    scale *= 0.8;
  } else if (aspectRatio > 2) { // Ultra-wide
    scale *= 1.2;
  }

  // Ensure minimum and maximum bounds
  scale = Math.max(0.4, Math.min(scale, 1.5));

  return scale;
};