import p1 from '/assai.png';
import p2 from '/kalunga.png';
import p3 from '/latam.png';
import p4 from '/leroy.png';
import p5 from '/tintasmc.png';
import p6 from '/telha.png';

type Photos = 'Photo1' | 'Photo2' | 'Photo3' | 'Photo4' | 'Photo5' | 'Photo6';

type DataPhotos = Record<Photos, string>;

export const dataPhotos: DataPhotos = {
  Photo1: p1,
  Photo2: p2,
  Photo3: p3,
  Photo4: p4,
  Photo5: p5,
  Photo6: p6,
};