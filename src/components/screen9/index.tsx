import { Scroll } from '@react-three/drei';
import { SCREEN9_OFFSET_START_Y } from './constants';
import { dataScreen9 } from './data';
import { Word } from './word';
import { ShopButton } from './ShopButton';

export const Screen9 = () => {
  return (
    <Scroll>
      {dataScreen9.map((word, i) => (
        <Word key={word} value={word} index={dataScreen9.length - i} />
      ))}
      <ShopButton />
    </Scroll>
  );
};