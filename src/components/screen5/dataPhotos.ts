import p1 from '/papel-01.jpg';
import p2 from '/papel-02.jpg';
import p3 from '/papel-03.jpg';
import p4 from '/papel-04.jpg';

type Photos = 'Photo1' | 'Photo2' | 'Photo3' | 'Photo4';

type DataPhotos = Record<Photos, string>;

export const dataPhotos: DataPhotos = {
  Photo1: p1,
  Photo2: p2,
  Photo3: p3,
  Photo4: p4,
};