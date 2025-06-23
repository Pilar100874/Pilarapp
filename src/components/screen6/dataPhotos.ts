type Photos = 'Photo1' | 'Photo2' | 'Photo3' | 'Photo4' | 'Photo5' | 'Photo6';

type DataPhotos = Record<Photos, string>;

export const dataPhotos: DataPhotos = {
  Photo1: '/assai.png',
  Photo2: '/kalunga.png',
  Photo3: '/latam.png',
  Photo4: '/leroy.png',
  Photo5: '/tintasmc.png',
  Photo6: '/telha.png',
};