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
  const { isMobilePortrait, isMobile, isTablet } = useResponsiveText();
  const { gl } = useThree();
  
  // Touch handling refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeThreshold = 50;
  const swipeTimeThreshold = 500;

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
      distance > deltaY * 1.5 // Ensure it's more horizontal than vertical
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
  }, [isMobile, isTablet, handlePrevious, handleNext]);

  // Setup touch event listeners
  useEffect(() => {
    if (!gl.domElement || (!isMobile && !isTablet)) return;
    
    const canvas = gl.domElement;
    
    const touchStartHandler = (e: TouchEvent) => {
      // Only handle touches in the screen3 area (approximate)
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const relativeY = (touch.clientY - rect.top) / rect.height;
      
      // Screen3 is roughly in the middle section of the scroll
      if (relativeY > 0.2 && relativeY < 0.4) {
        handleTouchStart(e);
      }
    };
    
    const touchEndHandler = (e: TouchEvent) => {
      if (touchStartRef.current) {
        handleTouchEnd(e);
      }
    };
    
    canvas.addEventListener('touchstart', touchStartHandler, { passive: true });
    canvas.addEventListener('touchend', touchEndHandler, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchstart', touchStartHandler);
      canvas.removeEventListener('touchend', touchEndHandler);
    };
  }, [gl.domElement, handleTouchStart, handleTouchEnd, isMobile, isTablet]);

  // Button positioning based on orientation
  const buttonY = isMobilePortrait ? -3.0 : 0;
  const buttonScale = isMobilePortrait ? 0.4 : 0.5;
  const buttonSpacing = isMobilePortrait ? 2.5 : 5;

  // Mobile portrait navigation buttons (moved up 1cm from -3.5 to -3.4)
  const mobileNavButtonY = -3.4; // Moved up by 1cm (0.1 units)
  const mobileNavButtonScale = 0.378; // Reduced by additional 10% (0.42 * 0.9 = 0.378)
  const mobileNavButtonSpacing = 1.134; // Reduced by additional 10% (1.26 * 0.9 = 1.134)

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} position-x={0}>
        {/* Desktop/Tablet Navigation Buttons */}
        {!isMobilePortrait && (
          <>
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
          </>
        )}

        {/* Mobile Portrait Navigation Buttons (moved up 1cm) */}
        {isMobilePortrait && (
          <>
            {/* Previous Button */}
            <mesh
              position={[-mobileNavButtonSpacing, mobileNavButtonY, 0.1]}
              scale={[mobileNavButtonScale, mobileNavButtonScale, 1]}
              rotation={[0, 0, Math.PI / 2]}
              onClick={handlePrevious}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={arrowTexture} transparent opacity={0.9} />
            </mesh>

            {/* Next Button */}
            <mesh
              position={[mobileNavButtonSpacing, mobileNavButtonY, 0.1]}
              scale={[mobileNavButtonScale, mobileNavButtonScale, 1]}
              rotation={[0, 0, -Math.PI / 2]}
              onClick={handleNext}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={arrowTexture} transparent opacity={0.9} />
            </mesh>

            {/* Photo indicator dots (also moved up) */}
            {photoList.map((_, index) => (
              <mesh
                key={`dot-${index}`}
                position={[
                  (index - Math.floor(photoList.length / 2)) * 0.189, // Reduced spacing by additional 10% (0.21 * 0.9 = 0.189)
                  mobileNavButtonY - 0.504, // Reduced distance by additional 10% (0.56 * 0.9 = 0.504)
                  0.1
                ]}
                scale={[0.063, 0.063, 1]} // Reduced by additional 10% (0.07 * 0.9 = 0.063)
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