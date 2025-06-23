import { Scroll } from '@react-three/drei';
import { SCREEN6_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';
import { useThree } from '@react-three/fiber';

export const Screen6 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const playTexture = useTexture('/play.png');
  const arrowTexture = useTexture('/seta_B.png');
  const { isMobilePortrait, isMobile, isTablet } = useResponsiveText();
  const { gl } = useThree();
  
  // Touch handling refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeThreshold = 50;
  const swipeTimeThreshold = 500;

  const rotatePhotos = (clickedIndex: number) => {
    const newOrder = [...order];
    const currentPosition = order.indexOf(clickedIndex);
    
    // Move clicked photo to front by rotating array
    const itemsToRotate = newOrder.splice(currentPosition);
    newOrder.unshift(...itemsToRotate);
    
    setOrder(newOrder);
  };

  const handlePrevious = useCallback(() => {
    // Rotate to previous photo (move last item to front)
    const newOrder = [...order];
    const lastItem = newOrder.pop();
    if (lastItem !== undefined) {
      newOrder.unshift(lastItem);
    }
    setOrder(newOrder);
  }, [order]);

  const handleNext = useCallback(() => {
    // Rotate to next photo (move first item to back)
    const newOrder = [...order];
    const firstItem = newOrder.shift();
    if (firstItem !== undefined) {
      newOrder.push(firstItem);
    }
    setOrder(newOrder);
  }, [order]);

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
      // Only handle touches in the screen6 area (approximate)
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const relativeY = (touch.clientY - rect.top) / rect.height;
      
      // Screen6 is roughly in the clients section
      if (relativeY > 0.6 && relativeY < 0.8) {
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
  const buttonY = isMobilePortrait ? -2.0 : 0;
  const buttonScale = isMobilePortrait ? 0.4 : 0.5;
  const buttonSpacing = isMobilePortrait ? 2.5 : 5;

  // Mobile portrait navigation buttons (same positioning as Screen3)
  const mobileNavButtonY = -2.4; // Positioned relative to Screen6
  const mobileNavButtonScale = 0.378; // Same size as Screen3
  const mobileNavButtonSpacing = 1.134; // Same spacing as Screen3

  return (
    <Scroll>
      <group position-y={SCREEN6_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {/* Play/Pause Button */}
        <mesh
          position={[-2, 0, 2]}
          scale={[0.45, 0.45, 1]}
          rotation={[0, 0, isAnimationPaused ? Math.PI : 0]}
          onClick={() => setIsAnimationPaused(!isAnimationPaused)}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={playTexture} 
            transparent 
            opacity={1} 
            depthTest={false}
            alphaTest={0.1}
          />
        </mesh>

        {/* Desktop/Tablet Navigation Buttons */}
        {!isMobilePortrait && (
          <>
            {/* Previous Button */}
            <mesh
              position={[-buttonSpacing, buttonY, 2]}
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
              position={[buttonSpacing, buttonY, 2]}
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

        {/* Mobile Portrait Navigation Buttons */}
        {isMobilePortrait && (
          <>
            {/* Previous Button */}
            <mesh
              position={[-mobileNavButtonSpacing, mobileNavButtonY, 2.1]}
              scale={[mobileNavButtonScale, mobileNavButtonScale, 1]}
              rotation={[0, 0, Math.PI / 2]}
              onClick={handlePrevious}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={arrowTexture} transparent opacity={0.9} />
            </mesh>

            {/* Next Button */}
            <mesh
              position={[mobileNavButtonSpacing, mobileNavButtonY, 2.1]}
              scale={[mobileNavButtonScale, mobileNavButtonScale, 1]}
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
                  mobileNavButtonY - 0.504,
                  2.1
                ]}
                scale={[0.063, 0.063, 1]}
                onClick={() => rotatePhotos(index)}
              >
                <circleGeometry args={[1, 8]} />
                <meshBasicMaterial 
                  color={order[0] === index ? "#ffffff" : "#666666"} 
                  transparent 
                  opacity={order[0] === index ? 1 : 0.5} 
                />
              </mesh>
            ))}
          </>
        )}

        {order.map((originalIndex, displayIndex) => {
          const [name, src] = photoList[originalIndex];
          return (
            <Photo
              key={name}
              src={src}
              z={-displayIndex * 0.35}
              index={displayIndex}
              totalPhotos={photoList.length}
              onClick={() => rotatePhotos(originalIndex)}
              isPaused={isAnimationPaused}
            />
          );
        })}
      </group>
    </Scroll>
  );
};