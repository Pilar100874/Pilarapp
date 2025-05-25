import p1 from '/SP.png';
import p2 from '/RS.png';
import p3 from '/ES.png';
import p4 from '/TO.png';
import p5 from '/BA.png';
import p6 from '/PR.png';
import p6 from '/GO.png';

type Photos = 'Photo1' | 'Photo2' | 'Photo3' | 'Photo4' | 'Photo5' | 'Photo6' | 'Photo7';

type DataPhotos = Record<Photos, string>;

export const dataPhotos: DataPhotos = {
  Photo1: p1,
  Photo2: p2,
  Photo3: p3,
  Photo4: p4,
  Photo5: p5,
  Photo6: p6,
  Photo6: p7,
};
