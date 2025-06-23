import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';

export const useResponsiveText = () => {
  const { viewport } = useThree();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  // Detect orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      setOrientation(aspectRatio > 1 ? 'landscape' : 'portrait');
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  
  // Enhanced device detection considering orientation
  const isPortrait = orientation === 'portrait';
  const isLandscape = orientation === 'landscape';
  
  // Device type detection with orientation consideration
  const isMobile = viewport.width < 5;
  const isTablet = viewport.width >= 5 && viewport.width < 8;
  const isDesktop = viewport.width >= 8;
  
  // Mobile landscape needs special handling (smaller text than portrait)
  const isMobileLandscape = isMobile && isLandscape;
  const isMobilePortrait = isMobile && isPortrait;
  
  // Tablet landscape vs portrait
  const isTabletLandscape = isTablet && isLandscape;
  const isTabletPortrait = isTablet && isPortrait;
  
  // Enhanced font size calculation with orientation
  const getFontSize = (
    mobilePortraitSize: number, 
    mobileLandscapeSize?: number,
    tabletPortraitSize?: number, 
    tabletLandscapeSize?: number,
    desktopSize?: number
  ) => {
    // Mobile landscape (phone rotated)
    if (isMobileLandscape && mobileLandscapeSize) {
      return mobileLandscapeSize;
    }
    
    // Mobile portrait (phone normal)
    if (isMobilePortrait) {
      return mobilePortraitSize;
    }
    
    // Tablet landscape
    if (isTabletLandscape && tabletLandscapeSize) {
      return tabletLandscapeSize;
    }
    
    // Tablet portrait
    if (isTabletPortrait && tabletPortraitSize) {
      return tabletPortraitSize;
    }
    
    // Desktop
    if (isDesktop && desktopSize) {
      return desktopSize;
    }
    
    // Fallback with orientation consideration
    const baseScale = Math.min(viewport.width / 10, 1.2);
    const orientationMultiplier = isLandscape ? 0.85 : 1; // Slightly smaller in landscape
    return mobilePortraitSize * baseScale * orientationMultiplier;
  };
  
  // Enhanced spacing calculation with orientation
  const getSpacing = (
    mobilePortraitSpacing: number,
    mobileLandscapeSpacing?: number,
    tabletPortraitSpacing?: number,
    tabletLandscapeSpacing?: number,
    desktopSpacing?: number
  ) => {
    // Mobile landscape
    if (isMobileLandscape && mobileLandscapeSpacing) {
      return mobileLandscapeSpacing;
    }
    
    // Mobile portrait
    if (isMobilePortrait) {
      return mobilePortraitSpacing;
    }
    
    // Tablet landscape
    if (isTabletLandscape && tabletLandscapeSpacing) {
      return tabletLandscapeSpacing;
    }
    
    // Tablet portrait
    if (isTabletPortrait && tabletPortraitSpacing) {
      return tabletPortraitSpacing;
    }
    
    // Desktop
    if (isDesktop && desktopSpacing) {
      return desktopSpacing;
    }
    
    // Fallback with orientation consideration
    const baseScale = Math.min(viewport.width / 10, 1.2);
    const orientationMultiplier = isLandscape ? 0.9 : 1; // Tighter spacing in landscape
    return mobilePortraitSpacing * baseScale * orientationMultiplier;
  };
  
  // Utility function for scale adjustments
  const getScale = (
    mobilePortraitScale: number,
    mobileLandscapeScale?: number,
    tabletPortraitScale?: number,
    tabletLandscapeScale?: number,
    desktopScale?: number
  ) => {
    if (isMobileLandscape && mobileLandscapeScale) return mobileLandscapeScale;
    if (isMobilePortrait) return mobilePortraitScale;
    if (isTabletLandscape && tabletLandscapeScale) return tabletLandscapeScale;
    if (isTabletPortrait && tabletPortraitScale) return tabletPortraitScale;
    if (isDesktop && desktopScale) return desktopScale;
    
    const baseScale = Math.min(viewport.width / 10, 1.2);
    const orientationMultiplier = isLandscape ? 0.9 : 1;
    return mobilePortraitScale * baseScale * orientationMultiplier;
  };
  
  return {
    // Device detection
    isMobile,
    isTablet,
    isDesktop,
    
    // Orientation detection
    isPortrait,
    isLandscape,
    isMobileLandscape,
    isMobilePortrait,
    isTabletLandscape,
    isTabletPortrait,
    
    // Utility functions
    getFontSize,
    getSpacing,
    getScale,
    viewport,
    orientation
  };
};