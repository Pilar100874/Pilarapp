import p1 from '/sp.png';
import p2 from '/rs.png';
import p3 from '/es.png';
import p4 from '/to.png';
import p5 from '/ba.png';
import p6 from '/pr.png';
import p7 from '/go.png';

type Photos = 'Photo1' | 'Photo2' | 'Photo3' | 'Photo4' | 'Photo5' | 'Photo6' | 'Photo7';

type DataPhotos = Record<Photos, string>;

export const dataPhotos: DataPhotos = {
  Photo1: p1,
  Photo2: p2,
  Photo3: p3,
  Photo4: p4,
  Photo5: p5,
  Photo6: p6,
  Photo7: p7,
};