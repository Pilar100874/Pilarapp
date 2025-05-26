import { useThree } from '@react-three/fiber';

export const useResponsive = () => {
  const { viewport } = useThree();
  
  const isPortrait = viewport.width < viewport.height;
  const isMobile = viewport.width < 5;
  
  const getTextSize = (baseSize: number) => {
    if (isPortrait) {
      return baseSize * 0.7;
    }
    return isMobile ? baseSize * 0.85 : baseSize;
  };

  const getSpacing = (baseSpacing: number) => {
    if (isPortrait) {
      return baseSpacing * 0.7;
    }
    return isMobile ? baseSpacing * 0.85 : baseSpacing;
  };

  return {
    isPortrait,
    isMobile,
    getTextSize,
    getSpacing,
  };
};