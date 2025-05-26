import { Scroll } from '@react-three/drei';
import { SCREEN2_OFFSET_START_Y } from './constants';
import { dataScreen2 } from './data';
import { PillarModel } from './PillarModel';
import { Word } from './word';

interface Screen2Props {
  isMobile: boolean;
}

export const Screen2 = ({ isMobile }: Screen2Props) => {
  return (
    <Scroll>
      {dataScreen2.map((word, i) => (
        <Word key={word} value={word} index={dataScreen2.length - i} isMobile={isMobile} />
      ))}
      <group position-y={SCREEN2_OFFSET_START_Y * (isMobile ? 0.85 : 0.75)}>
        <PillarModel />
      </group>
    </Scroll>
  );
};