import { Scroll } from '@react-three/drei';
import { SCREEN8_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useThree } from '@react-three/fiber';

export const Screen8 = () => {
  const photoList = Object.entries(dataPhotos);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  // Adjust vertical offset for mobile
  const verticalOffset = isMobile ? SCREEN8_OFFSET_START_Y * 0.8 : SCREEN8_OFFSET_START_Y;

  return (
    <Scroll>
      <group position-y={verticalOffset}>
        {photoList.map(([name, src], index) => (
          <Photo
            key={name}
            defaultSrc={src.default}
            alternateSrc={src.alternate}
            index={index}
            totalPhotos={photoList.length}
          />
        ))}
      </group>
    </Scroll>
  );
};