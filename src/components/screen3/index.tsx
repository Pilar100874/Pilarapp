import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';
import { useThree } from '@react-three/fiber';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [activeIndex, setActiveIndex] = useState(Math.floor(photoList.length / 2));
  const arrowTexture = useTexture('/seta_B.png');
  const { isMobilePortrait, isTabletPortrait, isMobile, isTablet, isMobileLandscape, isTabletLandscape } = useResponsiveText();
  const { gl } = useThree();
  
  // Touch handling refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeThreshold = 30; // Reduced threshold for easier swiping
  const swipeTimeThreshold = 800; // Increased time threshold
  const isDraggingRef = useRef(false);

  const handlePhotoClick = (index: number) => {
    if (!isDraggingRef.current) {
      setActiveIndex(index);
    }
  };

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photoList.length - 1));
  }, [photoList.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < photoList.length - 1 ? prev + 1 : 0));
  }, [photoList.length]);

  // Enhanced touch event handlers for all mobile and tablet orientations
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!isMobile && !isTablet) return;
    
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    isDraggingRef.current = false;
  }, [isMobile, isTablet]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!touchStartRef.current || (!isMobile && !isTablet)) return;
    
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // If moving horizontally more than vertically, prevent default scrolling
    if (deltaX > deltaY && deltaX > 10) {
      event.preventDefault();
      isDraggingRef.current = true;
    }
  }, [isMobile, isTablet]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!touchStartRef.current || (!isMobile && !isTablet)) return;
    
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    const deltaTime = Date.now() - touchStartRef.current.time;
    const distance = Math.abs(deltaX);

    // Check if it's a valid horizontal swipe
    if (
      distance > swipeThreshold && 
      deltaTime < swipeTimeThreshold && 
      distance > deltaY * 1.2 // Ensure it's more horizontal than vertical
    ) {
      event.preventDefault();
      event.stopPropagation();
      
      if (deltaX > 0) {
        // Swipe right - go to previous
        handlePrevious();
      } else {
        // Swipe left - go to next
        handleNext();
      }
    }

    touchStartRef.current = null;
    // Reset dragging state after a short delay
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  }, [isMobile, isTablet, handlePrevious, handleNext]);

  // Setup touch event listeners for all mobile and tablet orientations
  useEffect(() => {
    if (!gl.domElement || (!isMobile && !isTablet)) return;
    
    const canvas = gl.domElement;
    
    const touchStartHandler = (e: TouchEvent) => {
      // Only handle touches in the screen3 area (approximate)
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const relativeY = (touch.clientY - rect.top) / rect.height;
      
      // Screen3 is roughly in the middle section of the scroll
      if (relativeY > 0.15 && relativeY < 0.45) {
        handleTouchStart(e);
      }
    };
    
    const touchMoveHandler = (e: TouchEvent) => {
      if (touchStartRef.current) {
        handleTouchMove(e);
      }
    };
    
    const touchEndHandler = (e: TouchEvent) => {
      if (touchStartRef.current) {
        handleTouchEnd(e);
      }
    };
    
    canvas.addEventListener('touchstart', touchStartHandler, { passive: false });
    canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
    canvas.addEventListener('touchend', touchEndHandler, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchstart', touchStartHandler);
      canvas.removeEventListener('touchmove', touchMoveHandler);
      canvas.removeEventListener('touchend', touchEndHandler);
    };
  }, [gl.domElement, handleTouchStart, handleTouchMove, handleTouchEnd, isMobile, isTablet]);

  // Determine layout mode based on device and orientation
  const useGridLayout = isMobilePortrait || isTabletPortrait;
  const useCarouselLayout = !useGridLayout;

  // Enhanced button positioning for different orientations
  const getButtonConfig = () => {
    if (isMobileLandscape) {
      return {
        buttonY: 0,
        buttonScale: 0.4,
        buttonSpacing: 4,
        mobileNavButtonY: -2.8,
        mobileNavButtonScale: 0.3,
        mobileNavButtonSpacing: 0.9
      };
    } else if (isTabletLandscape) {
      return {
        buttonY: 0,
        buttonScale: 0.5,
        buttonSpacing: 5,
        mobileNavButtonY: -3.2,
        mobileNavButtonScale: 0.35,
        mobileNavButtonSpacing: 1.0
      };
    } else {
      // Portrait modes (mobile and tablet)
      return {
        buttonY: 0,
        buttonScale: 0.5,
        buttonSpacing: 5,
        mobileNavButtonY: -3.4,
        mobileNavButtonScale: 0.378,
        mobileNavButtonSpacing: 1.134
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} position-x={0}>
        {/* Desktop/Tablet Landscape Navigation Buttons - only for carousel mode */}
        {useCarouselLayout && (
          <>
            {/* Previous Button */}
            <mesh
              position={[-buttonConfig.buttonSpacing, buttonConfig.buttonY, 0]}
              scale={[buttonConfig.buttonScale, buttonConfig.buttonScale, 1]}
              rotation={[0, 0, Math.PI / 2]}
              onClick={handlePrevious}
              onPointerOver={() => { 
                if (!isMobile && !isTablet) {
                  document.body.style.cursor = 'pointer'; 
                }
              }}
              onPointerOut={() => { 
                if (!isMobile && !isTablet) {
                  document.body.style.cursor = 'default'; 
                }
              }}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={arrowTexture} transparent opacity={1} />
            </mesh>

            {/* Next Button */}
            <mesh
              position={[buttonConfig.buttonSpacing, buttonConfig.buttonY, 0]}
              scale={[buttonConfig.buttonScale, buttonConfig.buttonScale, 1]}
              rotation={[0, 0, -Math.PI / 2]}
              onClick={handleNext}
              onPointerOver={() => { 
                if (!isMobile && !isTablet) {
                  document.body.style.cursor = 'pointer'; 
                }
              }}
              onPointerOut={() => { 
                if (!isMobile && !isTablet) {
                  document.body.style.cursor = 'default'; 
                }
              }}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={arrowTexture} transparent opacity={1} />
            </mesh>
          </>
        )}

        {/* Mobile/Tablet Portrait Navigation Buttons (for grid layout) */}
        {useGridLayout && (
          <>
            {/* Previous Button */}
            <mesh
              position={[-buttonConfig.mobileNavButtonSpacing, buttonConfig.mobileNavButtonY, 0.1]}
              scale={[buttonConfig.mobileNavButtonScale, buttonConfig.mobileNavButtonScale, 1]}
              rotation={[0, 0, Math.PI / 2]}
              onClick={handlePrevious}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={arrowTexture} transparent opacity={0.9} />
            </mesh>

            {/* Next Button */}
            <mesh
              position={[buttonConfig.mobileNavButtonSpacing, buttonConfig.mobileNavButtonY, 0.1]}
              scale={[buttonConfig.mobileNavButtonScale, buttonConfig.mobileNavButtonScale, 1]}
              rotation={[0, 0, -Math.PI / 2]}
              onClick={handleNext}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={arrowTexture} transparent opacity={0.9} />
            </mesh>

            {/* Photo indicator dots */}
            {photoList.map((_, index) => (
              <mesh
                key={`dot-${index}`}
                position={[
                  (index - Math.floor(photoList.length / 2)) * 0.189,
                  buttonConfig.mobileNavButtonY - 0.504,
                  0.1
                ]}
                scale={[0.063, 0.063, 1]}
                onClick={() => setActiveIndex(index)}
              >
                <circleGeometry args={[1, 8]} />
                <meshBasicMaterial 
                  color={index === activeIndex ? "#ffffff" : "#666666"} 
                  transparent 
                  opacity={index === activeIndex ? 1 : 0.5} 
                />
              </mesh>
            ))}
          </>
        )}

        {/* Render all photos */}
        {photoList.map(([name, src], index) => (
          <Photo
            key={name}
            src={src}
            index={index}
            isActive={index === activeIndex}
            totalPhotos={photoList.length}
            activeIndex={activeIndex}
            onClick={() => handlePhotoClick(index)}
            useGridLayout={useGridLayout}
            useCarouselLayout={useCarouselLayout}
          />
        ))}
      </group>
    </Scroll>
  );
};