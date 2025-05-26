import { Scroll } from '@react-three/drei';
import { dataScreen2 } from '../screen2/data';
import { SCREEN5_OFFSET_START_Y } from './constants';
import { Word } from './word';

export const Screen5 = () => {
  return (
    <Scroll>
      {dataScreen2.map((word: string, i: number) => (
        <Word key={word} value={word} index={dataScreen2.length - i} />
      ))}
      <group position-y={SCREEN5_OFFSET_START_Y * 0.75}>
      </group>
    </Scroll>
  );
};