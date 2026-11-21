import {images} from '@/assets';

export const products = [
  {id: 'catalogue-1', image: images.product1.png, category: 'dairy', named: true},
  {id: 'catalogue-2', image: images.product2.png, category: 'dairy', named: false},
  {id: 'catalogue-3', image: images.product3.png, category: 'dairy', named: false},
  {id: 'catalogue-4', image: images.product4.png, category: 'cheese', named: false},
  {id: 'catalogue-5', image: images.product4.png, category: 'cheese', named: false},
  {id: 'catalogue-6', image: images.product1.png, category: 'cheese', named: false},
  {id: 'catalogue-7', image: images.product2.png, category: 'cheese', named: false},
  {id: 'catalogue-8', image: images.product3.png, category: 'dairy', named: false},
  {id: 'catalogue-9', image: images.product4.png, category: 'salads', named: false},
  {id: 'catalogue-10', image: images.product4.png, category: 'salads', named: false},
  {id: 'catalogue-11', image: images.product1.png, category: 'salads', named: false},
  {id: 'catalogue-12', image: images.product2.png, category: 'salads', named: false},
  {id: 'catalogue-13', image: images.product3.png, category: 'cheese', named: false},
  {id: 'catalogue-14', image: images.product4.png, category: 'cheese', named: false},
  {id: 'catalogue-15', image: images.product4.png, category: 'dairy', named: false},
  {id: 'catalogue-16', image: images.product1.png, category: 'salads', named: false},
  {id: 'catalogue-17', image: images.product2.png, category: 'dairy', named: false},
  {id: 'catalogue-18', image: images.product3.png, category: 'cheese', named: false},
  {id: 'catalogue-19', image: images.product4.png, category: 'dairy', named: false},
  {id: 'catalogue-20', image: images.product4.png, category: 'dairy', named: false},
  {id: 'catalogue-21', image: images.product1.png, category: 'salads', named: false},
  {id: 'catalogue-22', image: images.product2.png, category: 'salads', named: false},
  {id: 'catalogue-23', image: images.product3.png, category: 'dairy', named: false},
  {id: 'catalogue-24', image: images.product4.png, category: 'salads', named: false},
  {id: 'catalogue-25', image: images.product4.png, category: 'salads', named: false},
] as const;

export const events = [
  {slug: 'rayeb-and-nutrition', title: 'rayeb', text: 'rayebText', date: '2021-03-12', image: images.news1.png},
  {slug: 'palestinian-industries', title: 'exhibition', text: 'exhibitionText', date: '2021-11-06', image: images.news2.png},
  {slug: 'jabalia-visit', title: 'visit', text: 'visitText', date: '2021-11-11', image: images.news3.png}
] as const;

export const galleryPhotos = [images.album1.png, images.album2.png, images.album3.png];

export const navItems = [
  {href: '/', key: 'home'}, {href: '/about', key: 'about'},
  {href: '/products', key: 'products'}, {href: '/events', key: 'events'},
  {href: '/gallery', key: 'gallery'}, {href: '/jobs', key: 'jobs'},
  {href: '/contact', key: 'contact'}
] as const;
