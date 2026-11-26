export const sectionKeys = [
  'products',
  'news',
  'gallery',
  'careers',
  'contact',
] as const;
export type SectionKey = (typeof sectionKeys)[number];
export type ContentLanguage = 'en' | 'ar';
export type LocalizedValues = Record<string, string>;

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  src?: string;
  file?: Blob;
  alt: string;
  caption: string;
}

export interface ContentRecord {
  id: string;
  section: SectionKey;
  en: LocalizedValues;
  ar: LocalizedValues;
  values: Record<string, string>;
  published: boolean;
  featured: boolean;
  assets: MediaAsset[];
  coverId: string;
  updatedAt: string;
}

export interface PageSettings {
  en: LocalizedValues;
  ar: LocalizedValues;
  assets: MediaAsset[];
  coverId: string;
}

export interface Workspace {
  version: 1;
  records: ContentRecord[];
  pages: Record<SectionKey, PageSettings>;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type?: 'textarea' | 'date' | 'email' | 'url' | 'tel' | 'select' | 'number';
  required?: boolean;
  options?: string[];
}

export interface SectionDefinition {
  key: SectionKey;
  publicPath: string;
  localized: FieldDefinition[];
  fields: FieldDefinition[];
}

export function isSectionKey(value: string): value is SectionKey {
  return sectionKeys.includes(value as SectionKey);
}

// Resolve each field independently, preserving a blank Arabic override so that it
// continues to follow English when the English text changes later.
export function localizedValue(
  record: Pick<ContentRecord, 'en' | 'ar'>,
  key: string,
  language: ContentLanguage,
): string {
  return (
    (language === 'ar' ? record.ar[key]?.trim() : '') || record.en[key] || ''
  );
}
