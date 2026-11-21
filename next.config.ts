import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const legacyPages: Record<string, string> = {
  index: '', aboutus: '/about', products: '/products', events: '/events',
  eventdetails: '/events/palestinian-industries', gallery: '/gallery', jobs: '/jobs',
  jobdetails: '/jobs/field-marketing', applyjob: '/jobs/field-marketing/apply',
  contactus: '/contact', search: '/search', offer: '/offers', jobnotifiction: '/job-notification'
};

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return Object.entries(legacyPages).map(([page, destination]) => ({
      source: `/${page}.html`, destination: `/ar${destination}`, permanent: true
    }));
  }
};
export default createNextIntlPlugin('./src/i18n/request.ts')(config);
