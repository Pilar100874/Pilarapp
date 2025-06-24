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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const arrowTexture = useTexture('/seta_B.png');
  const { isMobilePortrait, isTabletPortrait, isMobile, isTablet } = useResponsiveText();
  const { gl } = useThree();
  
  // Touch handling refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeThreshold = 40;
  const swipeTimeThreshold = 600;
  const isDraggingRef = useRef(false);

  const handlePhotoClick = (index: number) => {
    if (!isDraggingRef.current && !isTransitioning) {
      setActiveIndex(index);
    }
  };

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photoList.length - 1));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [photoList.length, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev < photoList.length - 1 ? prev + 1 : 0));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [photoList.length, isTransitioning]);

  // Enhanced touch event handlers
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
    
    if (deltaX > deltaY && deltaX > 15) {
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

    if (
      distance > swipeThreshold && 
      deltaTime < swipeTimeThreshold && 
      distance > deltaY * 1.3
    ) {
      event.preventDefault();
      event.stopPropagation();
      
      if (deltaX > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }

    touchStartRef.current = null;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  }, [isMobile, isTablet, handlePrevious, handleNext]);

  // Setup touch event listeners
  useEffect(() => {
    if (!gl.domElement || (!isMobile && !isTablet)) return;
    
    const canvas = gl.domElement;
    
    const touchStartHandler = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const relativeY = (touch.clientY - rect.top) / rect.height;
      
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

  // Auto-play functionality (optional)
  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      if (!isTransitioning && !isDraggingRef.current) {
        handleNext();
      }
    }, 5000); // Auto advance every 5 seconds

    return () => clearInterval(autoPlayInterval);
  }, [handleNext, isTransitioning]);

  // Use mobile layout for portrait orientations
  const useMobileLayout = isMobilePortrait || isTabletPortrait;

  // Modern button styling
  const buttonScale = useMobileLayout ? 0.4 : 0.6;
  const buttonSpacing = useMobileLayout ? 4 : 6;
  const buttonY = useMobileLayout ? -0.5 : 0;

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} position-x={0}>
        {/* Modern Navigation Buttons with Glow Effect */}
        {!useMobileLayout && (
          <>
            {/* Previous Button with Glow */}
            <group position={[-buttonSpacing, buttonY, 0.5]}>
              {/* Glow effect */}
              <mesh scale={[buttonScale * 1.5, buttonScale * 1.5, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial 
                  color="#ffffff" 
                  transparent 
                  opacity={0.1} 
                  depthWrite={false}
                />
              </mesh>
              {/* Main button */}
              <mesh
                scale={[buttonScale, buttonScale, 1]}
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
                <meshBasicMaterial 
                  map={arrowTexture} 
                  transparent 
                  opacity={0.9}
                  depthWrite={false}
                />
              </mesh>
            </group>

            {/* Next Button with Glow */}
            <group position={[buttonSpacing, buttonY, 0.5]}>
              {/* Glow effect */}
              <mesh scale={[buttonScale * 1.5, buttonScale * 1.5, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial 
                  color="#ffffff" 
                  transparent 
                  opacity={0.1} 
                  depthWrite={false}
                />
              </mesh>
              {/* Main button */}
              <mesh
                scale={[buttonScale, buttonScale, 1]}
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
                <meshBasicMaterial 
                  map={arrowTexture} 
                  transparent 
                  opacity={0.9}
                  depthWrite={false}
                />
              </mesh>
            </group>
          </>
        )}

        {/* Modern Mobile Navigation */}
        {useMobileLayout && (
          <>
            {/* Sleek Navigation Bar */}
            <group position-y={-4}>
              {/* Background bar */}
              <mesh position-z={0.05}>
                <planeGeometry args={[6, 0.8]} />
                <meshBasicMaterial 
                  color="#000000" 
                  transparent 
                  opacity={0.3} 
                  depthWrite={false}
                />
              </mesh>
              
              {/* Navigation buttons */}
              <mesh
                position={[-1.5, 0, 0.1]}
                scale={[0.3, 0.3, 1]}
                rotation={[0, 0, Math.PI / 2]}
                onClick={handlePrevious}
              >
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial map={arrowTexture} transparent opacity={0.8} />
              </mesh>

              <mesh
                position={[1.5, 0, 0.1]}
                scale={[0.3, 0.3, 1]}
                rotation={[0, 0, -Math.PI / 2]}
                onClick={handleNext}
              >
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial map={arrowTexture} transparent opacity={0.8} />
              </mesh>

              {/* Modern Progress Indicators */}
              {photoList.map((_, index) => (
                <group key={`indicator-${index}`} position={[(index - Math.floor(photoList.length / 2)) * 0.4, -0.15, 0.1]}>
                  {/* Active indicator glow */}
                  {index === activeIndex && (
                    <mesh scale={[0.15, 0.15, 1]}>
                      <circleGeometry args={[1, 16]} />
                      <meshBasicMaterial 
                        color="#ffffff" 
                        transparent 
                        opacity={0.3} 
                        depthWrite={false}
                      />
                    </mesh>
                  )}
                  {/* Main indicator */}
                  <mesh
                    scale={[0.08, 0.08, 1]}
                    onClick={() => setActiveIndex(index)}
                  >
                    <circleGeometry args={[1, 16]} />
                    <meshBasicMaterial 
                      color={index === activeIndex ? "#ffffff" : "#666666"} 
                      transparent 
                      opacity={index === activeIndex ? 1 : 0.6} 
                      depthWrite={false}
                    />
                  </mesh>
                </group>
              ))}
            </group>
          </>
        )}

        {/* Render all photos with modern effects */}
        {photoList.map(([name, src], index) => (
          <Photo
            key={name}
            src={src}
            index={index}
            isActive={index === activeIndex}
            totalPhotos={photoList.length}
            activeIndex={activeIndex}
            onClick={() => handlePhotoClick(index)}
            useMobileLayout={useMobileLayout}
            isTransitioning={isTransitioning}
          />
        ))}
      </group>
    </Scroll>
  );
};