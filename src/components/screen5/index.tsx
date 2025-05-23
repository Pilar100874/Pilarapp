import { Scroll } from '@react-three/drei';
import { SCREEN5_OFFSET_START_Y } from './constants';
import { dataScreen5 } from './data';
import { PillarModel } from './PillarModel';
import { Word } from './word';

export const Screen5 = () => {
  return (
    <Scroll>
      {dataScreen5.map((word, i) => (
        <Word key={word} value={word} index={dataScreen5.length - i} />
      ))}
      <group position-y={SCREEN5_OFFSET_START_Y * 0.75}>
        <PillarModel />
      </group>
    </Scroll>
  );
};