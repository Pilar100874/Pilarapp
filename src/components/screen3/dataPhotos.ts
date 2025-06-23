type Photos = 'Photo1' | 'Photo2' | 'Photo3' | 'Photo4' | 'Photo5' | 'Photo6' | 'Photo7';

type DataPhotos = Record<Photos, string>;

export const dataPhotos: DataPhotos = {
  Photo1: '/sp.png',
  Photo2: '/rs.png',
  Photo3: '/es.png',
  Photo4: '/to.png',
  Photo5: '/ba.png',
  Photo6: '/pr.png',
  Photo7: '/go.png',
};