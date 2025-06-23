type Photos = 'Photo1' | 'Photo2' | 'Photo3' | 'Photo4' | 'Photo5' | 'Photo6';

type DataPhotos = Record<Photos, {
  default: string;
  alternate: string;
}>;

export const dataPhotos: DataPhotos = {
  Photo1: { default: '/k-01.png', alternate: '/k-01b.png' },
  Photo2: { default: '/k-02.png', alternate: '/k-02b.png' },
  Photo3: { default: '/k-03.png', alternate: '/k-03b.png' },
  Photo4: { default: '/k-04.png', alternate: '/k-04b.png' },
  Photo5: { default: '/k-05.png', alternate: '/k-05b.png' },
  Photo6: { default: '/k-06.png', alternate: '/k-06b.png' },
};