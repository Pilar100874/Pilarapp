import { useThree } from '@react-three/fiber';

export const useResponsiveText = () => {
  const { viewport } = useThree();
  
  // Detect device type based on viewport width
  const isMobile = viewport.width < 5;
  const isTablet = viewport.width >= 5 && viewport.width < 8;
  const isDesktop = viewport.width >= 8;
  
  // Base font sizes for different screen sizes
  const getFontSize = (mobileSize: number, tabletSize?: number, desktopSize?: number) => {
    if (isMobile) return mobileSize;
    if (isTablet && tabletSize) return tabletSize;
    if (desktopSize) return desktopSize;
    
    // Fallback scaling based on viewport width
    const scaleFactor = Math.min(viewport.width / 10, 1.2);
    return mobileSize * scaleFactor;
  };
  
  // Spacing adjustments
  const getSpacing = (mobileSpacing: number, tabletSpacing?: number, desktopSpacing?: number) => {
    if (isMobile) return mobileSpacing;
    if (isTablet && tabletSpacing) return tabletSpacing;
    if (desktopSpacing) return desktopSpacing;
    
    const scaleFactor = Math.min(viewport.width / 10, 1.2);
    return mobileSpacing * scaleFactor;
  };
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    getFontSize,
    getSpacing,
    viewport
  };
};