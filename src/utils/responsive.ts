import { useThree } from '@react-three/fiber';

export const useResponsiveScale = (baseScale: number, isMobile: boolean) => {
  const { viewport } = useThree();
  const aspectRatio = viewport.width / viewport.height;

  // Calculate base scale based on viewport size
  let scale = baseScale * Math.min(viewport.width, viewport.height) / 10;

  // Adjust for mobile devices
  if (isMobile) {
    scale *= aspectRatio < 1 ? 1.2 : 0.8; // Larger text for portrait, smaller for landscape
  }

  // Adjust for different aspect ratios
  if (aspectRatio < 0.6) { // Very tall
    scale *= 1.4;
  } else if (aspectRatio < 1) { // Portrait
    scale *= 1.2;
  } else if (aspectRatio > 2) { // Ultra-wide
    scale *= 0.8;
  }

  // Ensure minimum and maximum bounds
  const minScale = isMobile ? 0.5 : 0.4;
  const maxScale = isMobile ? 2.0 : 1.5;
  return Math.max(minScale, Math.min(scale, maxScale));
};

export const useResponsivePosition = (basePosition: number, isMobile: boolean) => {
  const { viewport } = useThree();
  const aspectRatio = viewport.width / viewport.height;

  let position = basePosition;

  // Adjust position based on viewport
  if (isMobile) {
    position *= aspectRatio < 1 ? 0.8 : 1.2;
  }

  return position;
};