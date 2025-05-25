import { Scroll } from '@react-three/drei';
import { SCREEN9_OFFSET_START_Y } from './constants';
import { dataScreen9 } from './data';
import { PillarModel } from './PillarModel';
import { Word } from './word';

export const Screen9 = () => {
  return (
    <Scroll>
      {dataScreen9.map((word, i) => (
        <Word key={word} value={word} index={dataScreen9.length - i} />
      ))}
      <group position-y={SCREEN9_OFFSET_START_Y * 0.75}>
        <PillarModel />
      </group>
    </Scroll>
  );
};