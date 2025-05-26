import { Scroll } from '@react-three/drei';
import { SCREEN4_OFFSET_START_Y } from './constants';
import { dataScreen4 } from './data';
import { PillarModel } from './PillarModel';
import { Word } from './word';

interface Screen4Props {
  isMobile: boolean;
}

export const Screen4 = ({ isMobile }: Screen4Props) => {
  return (
    <Scroll>
      {dataScreen4.map((word, i) => (
        <Word key={word} value={word} index={dataScreen4.length - i} isMobile={isMobile} />
      ))}
      <group position-y={SCREEN4_OFFSET_START_Y * (isMobile ? 0.85 : 0.75)}>
        <PillarModel />
      </group>
    </Scroll>
  );
};