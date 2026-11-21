import album1 from './images/album1.png';
import album2 from './images/album2.png';
import album3 from './images/album3.png';
import albums from './images/albums.png';
import cam from './images/cam.png';

export const gallery = {
  album1: {png: album1},
  album2: {png: album2},
  album3: {png: album3},
  albums: {png: albums},
  cam: {png: cam},
} as const;
