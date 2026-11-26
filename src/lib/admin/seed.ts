import {images} from '@/assets';
import {events, galleryPhotos, products} from '@/lib/content';
import en from '@/messages/en/pages.json';
import ar from '@/messages/ar/pages.json';
import enCommon from '@/messages/en/common.json';
import arCommon from '@/messages/ar/common.json';
import type {ContentRecord, MediaAsset, SectionKey, Workspace} from './types';

const image = (id: string, src: string, name: string): MediaAsset => ({
  id,
  src,
  name,
  type: 'image',
  alt: name,
  caption: '',
});
const base = (id: string, section: SectionKey): ContentRecord => ({
  id,
  section,
  en: {},
  ar: {},
  values: {slug: id},
  published: true,
  featured: false,
  assets: [],
  coverId: `${id}-cover`,
  updatedAt: '2026-11-26T00:00:00.000Z',
});

export function seedWorkspace(): Workspace {
  const records: ContentRecord[] = products.map((product, index) => {
    const title = product.named
      ? en.products.rayeb
      : en.products.catalogueItem.replace('{number}', String(index + 1));
    return {
      ...base(product.id, 'products'),
      en: {
        title,
        description: en.products.imageNote,
        size: product.named ? en.products.size : '',
      },
      ar: {
        title: product.named
          ? ar.products.rayeb
          : ar.products.catalogueItem.replace('{number}', String(index + 1)),
        description: ar.products.imageNote,
        size: product.named ? ar.products.size : '',
      },
      values: {slug: product.id, category: product.category, sku: ''},
      featured: product.named,
      assets: [image(`${product.id}-cover`, product.image.src, title)],
    };
  });
  for (const event of events) {
    const title = en.events[event.title];
    const body = [
      en.events[event.text],
      ...(event.slug === 'palestinian-industries'
        ? [en.events.article, en.events.articleMore]
        : []),
    ].join('\n\n');
    const arBody = [
      ar.events[event.text],
      ...(event.slug === 'palestinian-industries'
        ? [ar.events.article, ar.events.articleMore]
        : []),
    ].join('\n\n');
    records.push({
      ...base(event.slug, 'news'),
      en: {title, summary: en.events[event.text], body},
      ar: {
        title: ar.events[event.title],
        summary: ar.events[event.text],
        body: arBody,
      },
      values: {
        slug: event.slug,
        date: event.date,
        author: '',
        category: 'news',
      },
      assets: [
        image(`${event.slug}-cover`, event.image.src, title),
        ...(event.slug === 'palestinian-industries'
          ? [image(`${event.slug}-detail`, images.event_details.png.src, title)]
          : []),
      ],
    });
  }
  galleryPhotos.forEach((photo, index) => {
    const id = `album-${index + 1}`;
    const title = en.gallery.album.replace('{number}', String(index + 1));
    records.push({
      ...base(id, 'gallery'),
      en: {title, description: en.gallery.subtitle},
      ar: {
        title: ar.gallery.album.replace('{number}', String(index + 1)),
        description: ar.gallery.subtitle,
      },
      values: {slug: id, category: 'company', date: ''},
      assets: [image(`${id}-cover`, photo.src, title)],
    });
  });
  records.push({
    ...base('field-marketing', 'careers'),
    en: {
      title: en.jobs.role,
      description: en.jobs.descriptionText,
      requirements: [
        en.jobs.requirement1,
        en.jobs.requirement2,
        en.jobs.requirement3,
      ].join('\n'),
      location: enCommon.address,
      responsibilities: '',
      department: '',
    },
    ar: {
      title: ar.jobs.role,
      description: ar.jobs.descriptionText,
      requirements: [
        ar.jobs.requirement1,
        ar.jobs.requirement2,
        ar.jobs.requirement3,
      ].join('\n'),
      location: arCommon.address,
    },
    values: {
      slug: 'field-marketing',
      employmentType: 'fullTime',
      date: '2021-03-12',
      deadline: '2022-03-25',
      status: 'closed',
      applicationEmail: '',
    },
    coverId: '',
    assets: [],
  });
  records.push({
    ...base('company-office', 'contact'),
    en: {
      title: en.contact.office,
      address: enCommon.address,
      description: en.contact.subtitle,
    },
    ar: {
      title: ar.contact.office,
      address: arCommon.address,
      description: ar.contact.subtitle,
    },
    values: {
      slug: 'company-office',
      type: 'office',
      phone: '0598893600',
      landline: '082455020',
      salesPhone: '0566606600',
      email: 'info@abuaitah.ps',
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=Salah+Al+Din+Street+North+Gaza',
    },
    assets: [image('company-office-cover', images.map.png.src, en.contact.map)],
  });
  for (const region of ['north', 'central', 'rafah', 'gaza', 'khan'] as const) {
    records.push({
      ...base(`distributor-${region}`, 'contact'),
      en: {title: en.contact[region], address: '', description: ''},
      ar: {title: ar.contact[region]},
      values: {
        slug: `distributor-${region}`,
        type: 'distributor',
        phone: '0594220235',
      },
      coverId: '',
    });
  }
  const page = (
    key: SectionKey,
    source: 'products' | 'events' | 'gallery' | 'jobs' | 'contact',
    src: string,
  ) => ({
    en: {title: en[source].title, subtitle: en[source].subtitle},
    ar: {title: ar[source].title, subtitle: ar[source].subtitle},
    assets: [image(`${key}-hero`, src, en[source].title)],
    coverId: `${key}-hero`,
  });
  return {
    version: 1,
    records,
    pages: {
      products: page('products', 'products', images.products.png.src),
      news: page('news', 'events', images.events.png.src),
      gallery: page('gallery', 'gallery', images.albums.png.src),
      careers: page('careers', 'jobs', images.jobs.png.src),
      contact: {
        ...page('contact', 'contact', images.contact.png.src),
        en: {
          title: en.contact.title,
          subtitle: en.contact.subtitle,
          formHeading: en.contact.subtitle,
          messageTypes: [
            en.contact.general,
            en.contact.products,
            en.contact.distribution,
            en.contact.feedback,
          ].join('\n'),
        },
        ar: {
          title: ar.contact.title,
          subtitle: ar.contact.subtitle,
          formHeading: ar.contact.subtitle,
          messageTypes: [
            ar.contact.general,
            ar.contact.products,
            ar.contact.distribution,
            ar.contact.feedback,
          ].join('\n'),
        },
      },
    },
  };
}
