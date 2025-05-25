import p1 from '/k-01.png';
import p2 from '/k-02.png';
import p3 from '/k-03.png';
import p4 from '/k-04.png';
import p5 from '/k-05.png';
import p6 from '/k-06.png';

import p1b from '/k-01b.png';
import p2b from '/k-02b.png';
import p3b from '/k-03b.png';
import p4b from '/k-04b.png';
import p5b from '/k-05b.png';
import p6b from '/k-06b.png';

type Photos = 'Photo1' | 'Photo2' | 'Photo3' | 'Photo4' | 'Photo5' | 'Photo6';

type DataPhotos = Record<Photos, {
  default: string;
  alternate: string;
}>;

export const dataPhotos: DataPhotos = {
  Photo1: { default: p1, alternate: p1b },
  Photo2: { default: p2, alternate: p2b },
  Photo3: { default: p3, alternate: p3b },
  Photo4: { default: p4, alternate: p4b },
  Photo5: { default: p5, alternate: p5b },
  Photo6: { default: p6, alternate: p6b },
};