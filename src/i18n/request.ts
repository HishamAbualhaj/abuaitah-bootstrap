import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const [common, landing, pages, admin, cms] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/landing.json`),
    import(`../messages/${locale}/pages.json`),
    import(`../messages/${locale}/admin.json`),
    import(`../messages/${locale}/admin-cms.json`),
  ]);
  return {
    locale,
    messages: {
      common: common.default,
      landing: landing.default,
      pages: pages.default,
      admin: {...admin.default, cms: cms.default},
    },
  };
});
