import { Scroll } from '@react-three/drei';
import { SCREEN10_OFFSET_START_Y } from './constants';
import { dataScreen10 } from './data';
import { PillarModel } from './PillarModel';
import { Word } from './word';

interface Screen10Props {
  isMobile: boolean;
}

export const Screen10 = ({ isMobile }: Screen10Props) => {
  return (
    <Scroll>
      {dataScreen10.map((word, i) => (
        <Word key={word} value={word} index={dataScreen10.length - i} isMobile={isMobile} />
      ))}
      <group position-y={SCREEN10_OFFSET_START_Y * (isMobile ? 0.85 : 0.75)}>
        <PillarModel />
      </group>
    </Scroll>
  );
};