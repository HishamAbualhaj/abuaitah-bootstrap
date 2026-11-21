import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const [common, landing, pages] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/landing.json`),
    import(`../messages/${locale}/pages.json`)
  ]);
  return {locale, messages: {common: common.default, landing: landing.default, pages: pages.default}};
});
