import {test, expect} from '@playwright/test';

const routes = ['', '/about', '/products', '/events', '/events/palestinian-industries', '/events/rayeb-and-nutrition', '/events/jabalia-visit', '/gallery', '/jobs', '/jobs/field-marketing', '/jobs/field-marketing/apply', '/contact', '/search', '/offers', '/job-notification'];

for (const locale of ['en', 'ar']) {
  test(`${locale}: all migrated routes render and invalid detail pages return 404`, async ({request}) => {
    for (const route of routes) {
      const response = await request.get(`/${locale}${route}`);
      expect(response.status(), route).toBe(200);
      const html = await response.text();
      expect(html).toContain(`lang="${locale}"`);
      expect(html).not.toContain('MISSING_MESSAGE');
    }
    for (const route of ['/events/unknown', '/jobs/unknown', '/jobs/unknown/apply', '/unknown']) {
      expect((await request.get(`/${locale}${route}`)).status(), route).toBe(404);
    }
  });

  test(`${locale}: responsive layouts, local fonts, and mobile navigation`, async ({page}, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({width, height: 900});
      await page.goto(`/${locale}`);
      await expect(page.locator('header')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      await expect(page.getByRole('heading', {level: 1})).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.locator('img').evaluateAll(async elements => {
        await Promise.all(elements.map(async element => {
          if (!(element instanceof HTMLImageElement)) return;
          element.loading = 'eager';
          await element.decode();
        }));
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily)).toMatch(locale === 'ar' ? /^arabic/ : /^english/);
      await page.screenshot({path: testInfo.outputPath(`${locale}-${width}.png`), fullPage: true});
      const cta = page.getByRole('link', {name: locale === 'ar' ? 'اكتشف منتجاتنا' : 'Explore our products'});
      expect(await cta.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(8, 124, 67)');
      if (width === 375) {
        await page.getByRole('button', {name: locale === 'ar' ? 'فتح القائمة' : 'Open navigation', exact: true}).click();
        const menu = page.getByRole('dialog');
        await expect(menu).toBeVisible();
        expect(await menu.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(255, 255, 255)');
        await menu.getByRole('link', {name: locale === 'ar' ? 'المنتجات' : 'Products', exact: true}).click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/products$`));
        await expect(menu).not.toBeVisible();
      }
    }
    expect(errors).toEqual([]);
  });

  test(`${locale}: product filters and accessible product dialog`, async ({page}) => {
    await page.goto(`/${locale}/products`);
    const panel = page.getByRole('tabpanel');
    await expect(panel.getByRole('button')).toHaveCount(25);
    await page.getByRole('tab', {name: locale === 'ar' ? 'الأجبان' : 'Cheeses', exact: true}).click();
    await expect(panel.getByRole('button')).toHaveCount(7);
    await panel.getByRole('button').first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link')).toHaveAttribute('href', `/${locale}/contact`);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await page.getByRole('tab', {name: locale === 'ar' ? 'الحمص والسلطات' : 'Hummus & salads', exact: true}).click();
    await expect(panel.getByRole('button')).toHaveCount(9);
  });

  test(`${locale}: gallery lightbox, keyboard close, and videos empty state`, async ({page}) => {
    await page.goto(`/${locale}/gallery`);
    await expect(page.getByRole('tabpanel').getByRole('button')).toHaveCount(3);
    await page.getByRole('tabpanel').getByRole('button').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.getByRole('tab', {name: locale === 'ar' ? 'الفيديوهات' : 'Videos', exact: true}).click();
    await expect(page.getByRole('tabpanel')).toContainText(locale === 'ar' ? 'لا توجد ملفات فيديو' : 'There are no video files');
  });

  test(`${locale}: search uses URL state, switches locale, and handles no results`, async ({page}) => {
    await page.goto(`/${locale}/search`);
    await page.getByRole('searchbox').fill(locale === 'ar' ? 'معرض' : 'Exhibition');
    await page.locator('main').getByRole('button', {name: locale === 'ar' ? 'البحث' : 'Search', exact: true}).click();
    await expect(page).toHaveURL(/q=/);
    await expect(page.locator('main').getByRole('link').filter({has: page.getByRole('heading', {level: 2})})).toHaveCount(1);
    const query = new URL(page.url()).search;
    await page.locator('header').getByRole('link', {name: locale === 'ar' ? 'English' : 'العربية', exact: true}).click();
    expect(new URL(page.url()).search).toBe(query);
    await expect(page.locator('html')).toHaveAttribute('lang', locale === 'ar' ? 'en' : 'ar');
    await page.goto(`/${locale}/search?q=zzzzunknown`);
    await expect(page.locator('main')).toContainText(locale === 'ar' ? 'لا توجد نتائج' : 'No results');
  });

  test(`${locale}: contact form validates and explains submission preview`, async ({page}) => {
    await page.goto(`/${locale}/contact`);
    const form = page.locator('main form');
    await form.getByRole('button', {name: locale === 'ar' ? 'إرسال الرسالة' : 'Send message'}).click();
    await expect(form.getByRole('status')).toHaveCount(0);
    await form.locator('#name').fill('Test Visitor');
    await form.locator('#email').fill('visitor@example.com');
    await form.locator('#phone').fill('0590000000');
    await form.locator('#message').fill('Please tell me more about your products.');
    await form.getByRole('button', {name: locale === 'ar' ? 'إرسال الرسالة' : 'Send message'}).click();
    await expect(form.getByRole('status')).toContainText(locale === 'ar' ? 'دون إرسالها' : 'Nothing has been sent');
  });

  test(`${locale}: archived applications are closed and oversized files are rejected`, async ({page}) => {
    await page.goto(`/${locale}/jobs/field-marketing/apply`);
    await expect(page.locator('main form').getByRole('button', {name: locale === 'ar' ? 'انتهى التقديم' : 'Applications closed'})).toBeDisabled();
    await page.locator('#cv').setInputFiles({name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(5 * 1024 * 1024 + 1)});
    await expect(page.locator('main').getByRole('alert')).toBeVisible();
    expect(await page.locator('#cv').inputValue()).toBe('');
  });
}

test('legacy links redirect to the corresponding Arabic routes', async ({request}) => {
  for (const [source, destination] of [['index', ''], ['products', '/products'], ['aboutus', '/about'], ['applyjob', '/jobs/field-marketing/apply'], ['offer', '/offers'], ['jobnotifiction', '/job-notification']]) {
    const response = await request.get(`/${source}.html`, {maxRedirects: 0});
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(`/ar${destination}`);
  }
});
