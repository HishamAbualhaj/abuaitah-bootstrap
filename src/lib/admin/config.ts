import type {SectionDefinition, SectionKey} from './types';

export const sectionDefinitions: Record<SectionKey, SectionDefinition> = {
  products: {
    key: 'products',
    publicPath: '/products',
    localized: [
      {key: 'title', label: 'productName', required: true},
      {
        key: 'description',
        label: 'description',
        type: 'textarea',
        required: true,
      },
      {key: 'size', label: 'size'},
      {key: 'ingredients', label: 'ingredients', type: 'textarea'},
      {key: 'allergens', label: 'allergens'},
      {key: 'storage', label: 'storage'},
    ],
    fields: [
      {
        key: 'category',
        label: 'category',
        required: true,
        options: ['dairy', 'cheese', 'salads'],
      },
      {key: 'sku', label: 'sku'},
    ],
  },
  news: {
    key: 'news',
    publicPath: '/events',
    localized: [
      {key: 'title', label: 'articleTitle', required: true},
      {key: 'summary', label: 'summary', type: 'textarea', required: true},
      {key: 'body', label: 'articleBody', type: 'textarea', required: true},
    ],
    fields: [
      {key: 'date', label: 'publicationDate', type: 'date', required: true},
      {key: 'author', label: 'author'},
      {
        key: 'category',
        label: 'category',
        options: ['news', 'events', 'community'],
      },
    ],
  },
  gallery: {
    key: 'gallery',
    publicPath: '/gallery',
    localized: [
      {key: 'title', label: 'albumTitle', required: true},
      {
        key: 'description',
        label: 'description',
        type: 'textarea',
        required: true,
      },
    ],
    fields: [
      {key: 'date', label: 'albumDate', type: 'date'},
      {
        key: 'category',
        label: 'category',
        options: ['company', 'products', 'events'],
      },
    ],
  },
  careers: {
    key: 'careers',
    publicPath: '/jobs',
    localized: [
      {key: 'title', label: 'jobTitle', required: true},
      {
        key: 'description',
        label: 'jobDescription',
        type: 'textarea',
        required: true,
      },
      {
        key: 'requirements',
        label: 'requirements',
        type: 'textarea',
        required: true,
      },
      {key: 'responsibilities', label: 'responsibilities', type: 'textarea'},
      {key: 'location', label: 'location', required: true},
      {key: 'department', label: 'department'},
    ],
    fields: [
      {
        key: 'employmentType',
        label: 'employmentType',
        type: 'select',
        options: ['fullTime', 'partTime', 'contract', 'internship'],
        required: true,
      },
      {key: 'date', label: 'publicationDate', type: 'date', required: true},
      {key: 'deadline', label: 'deadline', type: 'date', required: true},
      {
        key: 'status',
        label: 'applications',
        type: 'select',
        options: ['open', 'closed'],
        required: true,
      },
      {key: 'applicationEmail', label: 'applicationEmail', type: 'email'},
    ],
  },
  contact: {
    key: 'contact',
    publicPath: '/contact',
    localized: [
      {key: 'title', label: 'contactName', required: true},
      {key: 'description', label: 'description', type: 'textarea'},
      {key: 'address', label: 'address'},
    ],
    fields: [
      {
        key: 'type',
        label: 'contactType',
        type: 'select',
        options: ['office', 'distributor'],
        required: true,
      },
      {key: 'phone', label: 'phone', type: 'tel', required: true},
      {key: 'landline', label: 'landline', type: 'tel'},
      {key: 'salesPhone', label: 'salesPhone', type: 'tel'},
      {key: 'email', label: 'email', type: 'email'},
      {key: 'mapUrl', label: 'mapUrl', type: 'url'},
    ],
  },
};

export function newRecord(section: SectionKey) {
  const definition = sectionDefinitions[section];
  return {
    id: '',
    section,
    en: Object.fromEntries(
      definition.localized.map((field) => [field.key, '']),
    ),
    ar: Object.fromEntries(
      definition.localized.map((field) => [field.key, '']),
    ),
    values: Object.fromEntries(
      [{key: 'slug'}, ...definition.fields].map((field) => [field.key, '']),
    ),
    published: false,
    featured: false,
    assets: [],
    coverId: '',
    updatedAt: '',
  };
}
