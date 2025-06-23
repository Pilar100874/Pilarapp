import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState, useRef, useCallback } from 'react';
import { useTexture } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';
import { useFrame, useThree } from '@react-three/fiber';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [activeIndex, setActiveIndex] = useState(Math.floor(photoList.length / 2));
  const arrowTexture = useTexture('/seta_B.png');
  const { isMobilePortrait, isMobile, isTablet } = useResponsiveText();
  const { gl } = useThree();
  
  // Touch/swipe handling
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwipingRef = useRef(false);
  const swipeThreshold = 50; // Minimum distance for swipe
  const swipeTimeThreshold = 500; // Maximum time for swipe (ms)

  const handlePhotoClick = (index: number) => {
    setActiveIndex(index);
  };

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photoList.length - 1));
  }, [photoList.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < photoList.length - 1 ? prev + 1 : 0));
  }, [photoList.length]);

  // Touch event handlers
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!isMobile && !isTablet) return;
    
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEndRef.current = null;
    isSwipingRef.current = false;
  }, [isMobile, isTablet]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!touchStartRef.current || (!isMobile && !isTablet)) return;
    
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // If horizontal movement is greater than vertical, prevent scrolling
    if (deltaX > deltaY && deltaX > 10) {
      event.preventDefault();
      isSwipingRef.current = true;
    }
  }, [isMobile, isTablet]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!touchStartRef.current || (!isMobile && !isTablet)) return;
    
    const touch = event.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = Math.abs(touchEndRef.current.y - touchStartRef.current.y);
    const deltaTime = touchEndRef.current.time - touchStartRef.current.time;
    const distance = Math.abs(deltaX);

    // Check if it's a valid swipe
    if (
      distance > swipeThreshold && 
      deltaTime < swipeTimeThreshold && 
      distance > deltaY && // Horizontal swipe
      isSwipingRef.current
    ) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        handlePrevious();
      } else {
        // Swipe left - go to next
        handleNext();
      }
    }

    // Reset touch tracking
    touchStartRef.current = null;
    touchEndRef.current = null;
    isSwipingRef.current = false;
  }, [isMobile, isTablet, handlePrevious, handleNext]);

  // Add touch event listeners to canvas
  useFrame(() => {
    if (!gl.domElement) return;
    
    const canvas = gl.domElement;
    
    // Remove existing listeners to prevent duplicates
    canvas.removeEventListener('touchstart', handleTouchStart as any);
    canvas.removeEventListener('touchmove', handleTouchMove as any);
    canvas.removeEventListener('touchend', handleTouchEnd as any);
    
    // Add new listeners
    canvas.addEventListener('touchstart', handleTouchStart as any, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd as any, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart as any);
      canvas.removeEventListener('touchmove', handleTouchMove as any);
      canvas.removeEventListener('touchend', handleTouchEnd as any);
    };
  });

  // Button positioning based on orientation
  const buttonY = isMobilePortrait ? -3.0 : 0; // Move buttons down 3 units in mobile portrait
  const buttonScale = isMobilePortrait ? 0.4 : 0.5; // Slightly smaller buttons in mobile portrait
  const buttonSpacing = isMobilePortrait ? 2.5 : 5; // Closer together in mobile portrait

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} position-x={0}>
        {/* Previous Button */}
        <mesh
          position={[-buttonSpacing, buttonY, 0]}
          scale={[buttonScale, buttonScale, 1]}
          rotation={[0, 0, Math.PI / 2]}
          onClick={handlePrevious}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={arrowTexture} transparent opacity={1} />
        </mesh>

        {/* Next Button */}
        <mesh
          position={[buttonSpacing, buttonY, 0]}
          scale={[buttonScale, buttonScale, 1]}
          rotation={[0, 0, -Math.PI / 2]}
          onClick={handleNext}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={arrowTexture} transparent opacity={1} />
        </mesh>

        {photoList.map(([name, src], index) => (
          <Photo
            key={name}
            src={src}
            index={index}
            isActive={index === activeIndex}
            totalPhotos={photoList.length}
            activeIndex={activeIndex}
            onClick={() => handlePhotoClick(index)}
          />
        ))}
      </group>
    </Scroll>
  );
};