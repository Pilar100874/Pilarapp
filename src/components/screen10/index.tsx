import { Scroll } from '@react-three/drei';
import { SCREEN10_OFFSET_START_Y } from './constants';
import { dataScreen10 } from './data';
import { Word } from './word';

export const Screen10 = () => {
  return (
    <Scroll>
      {dataScreen10.map((word, i) => (
        <Word key={word} value={word} index={dataScreen10.length - i} />
      ))}
    </Scroll>
  );
};