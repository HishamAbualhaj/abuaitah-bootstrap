import {expect, test, type Page} from '@playwright/test';

async function openAdmin(page: Page, path: string) {
  await page.addInitScript(() =>
    sessionStorage.setItem('abuaitah-admin-demo', 'active'),
  );
  await page.goto(path);
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
}

async function fillEnglish(page: Page, section: string, title: string) {
  await page.locator('#field-en-title').fill(title);
  for (const field of section === 'news'
    ? ['summary', 'body']
    : ['description']) {
    await page.locator(`#field-en-${field}`).fill(`${title} description`);
  }
  if (section === 'products')
    await page.locator('#field-values-category').fill('dairy');
  if (section === 'news' || section === 'careers')
    await page.locator('#field-values-date').fill('2026-11-26');
  if (section === 'careers') {
    await page
      .locator('#field-en-requirements')
      .fill('Experience in food production\nStrong communication skills');
    await page.locator('#field-en-location').fill('North Gaza');
    await page.locator('#field-values-employmentType').click();
    await page.getByRole('option', {name: 'Full time', exact: true}).click();
    await page.locator('#field-values-status').click();
    await page.getByRole('option', {name: 'Open', exact: true}).click();
    await page.locator('#field-values-deadline').fill('2026-12-31');
  }
  if (section === 'contact') {
    await page.locator('#field-values-type').click();
    await page.getByRole('option', {name: 'Distributor', exact: true}).click();
    await page.locator('#field-values-phone').fill('0591234567');
  }
}

for (const section of ['products', 'news', 'gallery', 'careers', 'contact']) {
  test(`${section}: validate, create, review fallback, edit, persist, and confirm deletion`, async ({
    page,
  }) => {
    await openAdmin(page, `/en/admin/${section}/new`);
    await page.getByRole('button', {name: 'Create entry', exact: true}).click();
    await expect(page.getByRole('alert').first()).toContainText(
      'Please review',
    );
    await expect(page.locator('#field-en-title')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    const title = `Test ${section} entry`;
    await fillEnglish(page, section, title);
    await expect(page.locator('#field-values-slug')).toHaveValue(
      `test-${section}-entry`,
    );
    await page.getByRole('tab', {name: 'العربية'}).click();
    await expect(page.locator('#field-ar-title')).toHaveValue('');
    await expect(page.locator('#field-ar-title')).toHaveAttribute(
      'placeholder',
      title,
    );
    if (section === 'careers') {
      await page.locator('#field-values-deadline').fill('2026-11-01');
      await page
        .getByRole('button', {name: 'Create entry', exact: true})
        .click();
      await expect(page.locator('#field-values-deadline-error')).toContainText(
        'on or after',
      );
      await page.locator('#field-values-deadline').fill('2026-12-31');
    }
    await page.getByRole('button', {name: 'Create entry', exact: true}).click();
    await expect(page).toHaveURL(new RegExp(`/en/admin/${section}/[^/]+$`));
    await expect(page.getByRole('heading', {level: 1})).toHaveText(title);
    const detailsUrl = page.url();
    await page.getByRole('tab', {name: 'العربية', exact: true}).click();
    await expect(page.getByRole('tabpanel')).toContainText(title);
    await expect(page.getByRole('tabpanel')).toContainText('Using English');
    await page.reload();
    await expect(page.getByRole('heading', {level: 1})).toHaveText(title);
    await page.getByRole('link', {name: 'Edit', exact: true}).click();
    await page.locator('#field-en-title').fill(`${title} updated`);
    await page.getByRole('button', {name: 'Save changes', exact: true}).click();
    await expect(page).toHaveURL(detailsUrl);
    await page.getByRole('tab', {name: 'العربية', exact: true}).click();
    await expect(page.getByRole('tabpanel')).toContainText(`${title} updated`);
    await page.getByRole('button', {name: 'Delete', exact: true}).click();
    await page
      .getByRole('dialog')
      .getByRole('button', {name: 'Cancel', exact: true})
      .click();
    await expect(page.getByRole('heading', {level: 1})).toHaveText(
      `${title} updated`,
    );
    await page.getByRole('button', {name: 'Delete', exact: true}).click();
    await page
      .getByRole('dialog')
      .getByRole('button', {name: 'Delete entry', exact: true})
      .click();
    await expect(page).toHaveURL(new RegExp(`/en/admin/${section}$`));
    await page.getByRole('searchbox').fill(title);
    await expect(page.locator('table tbody tr')).toHaveCount(0);
    await page.goto(detailsUrl);
    await expect(
      page.getByRole('heading', {name: 'Entry not found'}),
    ).toBeVisible();
  });
}

test('product table pagination, filters, switches, and details routes', async ({
  page,
}) => {
  await openAdmin(page, '/en/admin/products');
  await expect(page.locator('table tbody tr')).toHaveCount(10);
  await page.getByRole('button', {name: 'Next page', exact: true}).click();
  await expect(page.getByText('Page 2 of 3', {exact: true})).toBeVisible();
  await page.getByRole('combobox', {name: 'Category', exact: true}).click();
  await page.getByRole('option', {name: 'Cheeses', exact: true}).click();
  await expect(page.locator('table tbody tr')).toHaveCount(7);
  await expect(page.getByText('Page 1 of 1', {exact: true})).toBeVisible();
  await page.getByRole('combobox', {name: 'Category', exact: true}).click();
  await page.getByRole('option', {name: 'All categories', exact: true}).click();
  await page.getByRole('searchbox').fill('Joud Rayeb');
  const row = page.locator('table tbody tr');
  await expect(row).toHaveCount(1);
  await row
    .getByRole('switch', {name: 'Published: Joud Rayeb', exact: true})
    .click();
  await expect(row).toContainText('Draft');
  await row
    .getByRole('switch', {name: 'Featured: Joud Rayeb', exact: true})
    .click();
  await page.reload();
  await page.getByRole('searchbox').fill('Joud Rayeb');
  await expect(
    row.getByRole('switch', {name: 'Published: Joud Rayeb'}),
  ).not.toBeChecked();
  await expect(
    row.getByRole('switch', {name: 'Featured: Joud Rayeb'}),
  ).not.toBeChecked();
  await row
    .getByRole('link', {name: 'View details: Joud Rayeb', exact: true})
    .click();
  await expect(page).toHaveURL(/\/products\/catalogue-1$/);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Joud Rayeb');
});

test('multiple images and video upload, cover, reorder, previews, and blob persistence', async ({
  page,
}) => {
  await openAdmin(page, '/en/admin/products/new');
  await fillEnglish(page, 'products', 'Media product');
  await page.getByRole('switch', {name: 'Published', exact: true}).click();
  await page.getByRole('button', {name: 'Create entry', exact: true}).click();
  await expect(page.getByRole('alert').first()).toContainText(
    'Choose a cover image',
  );
  const imagesSection = page.getByRole('button', {
    name: 'Images 0',
    exact: true,
  });
  await imagesSection.click();
  await page
    .getByLabel('Upload images', {exact: true})
    .setInputFiles([
      'src/assets/images/product1.png',
      'src/assets/images/product2.png',
    ]);
  await expect(
    page.getByRole('button', {name: 'Images 2', exact: true}),
  ).toBeVisible();
  await page.getByRole('button', {name: 'Set as cover', exact: true}).click();
  await page
    .getByRole('button', {name: 'Move earlier: product2.png', exact: true})
    .click();
  await page
    .getByRole('button', {name: 'Expand preview: product2.png', exact: true})
    .first()
    .click();
  await expect(page.getByRole('dialog').locator('img')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', {name: 'Videos 0', exact: true}).click();
  await page
    .getByLabel('Upload videos', {exact: true})
    .setInputFiles('tests/fixtures/product-video.webm');
  await page
    .getByRole('button', {
      name: 'Expand preview: product-video.webm',
      exact: true,
    })
    .click();
  await expect(page.getByRole('dialog').locator('video')).toHaveAttribute(
    'controls',
    '',
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', {name: 'Create entry', exact: true}).click();
  await expect(page.getByRole('heading', {level: 1})).toHaveText(
    'Media product',
  );
  await page.reload();
  await expect(
    page.getByRole('button', {name: 'Images 2', exact: true}),
  ).toBeVisible();
  await expect(
    page.getByRole('button', {name: 'Videos 1', exact: true}),
  ).toBeVisible();
  const videoElement = page.locator('video');
  await expect(videoElement).toHaveAttribute('src', /^blob:/);
  await expect
    .poll(() => videoElement.evaluate((el: HTMLVideoElement) => el.readyState))
    .toBeGreaterThan(0);
  await page.getByRole('link', {name: 'Edit', exact: true}).click();
  await expect(page.getByRole('heading', {name: 'Edit entry', exact: true})).toBeVisible();
  const imageToggle = page.getByRole('button', {name: 'Images 2', exact: true});
  if (await imageToggle.getAttribute('aria-expanded') !== 'true') await imageToggle.click();
  await page
    .getByRole('button', {name: 'Remove asset: product2.png', exact: true})
    .click();
  await expect(
    page.getByRole('button', {name: 'Images 1', exact: true}),
  ).toBeVisible();
  await page.getByRole('button', {name: 'Save changes', exact: true}).click();
  await page.reload();
  await expect(
    page.getByRole('button', {name: 'Images 1', exact: true}),
  ).toBeVisible();
});

test('English page settings persist with per-field Arabic fallback', async ({
  page,
}) => {
  await openAdmin(page, '/en/admin/contact/settings');
  await page.locator('#field-en-title').fill('Talk to our team');
  await page.getByRole('tab', {name: 'العربية'}).click();
  await page.locator('#field-ar-title').fill('');
  await page.getByRole('button', {name: 'Save changes', exact: true}).click();
  await expect(page).toHaveURL(/\/en\/admin\/contact$/);
  await page.goto('/en/admin/contact/settings');
  await expect(page.locator('#field-en-title')).toHaveValue('Talk to our team');
  await page.getByRole('tab', {name: 'العربية'}).click();
  await expect(page.locator('#field-ar-title')).toHaveAttribute(
    'placeholder',
    'Talk to our team',
  );
  await expect(page.locator('#field-ar-title')).toHaveValue('');
  await expect(page.locator('#field-ar-messageTypes')).not.toHaveValue('');
});

test('storage failure retains the editor and does not navigate or report success', async ({
  page,
}) => {
  await openAdmin(page, '/en/admin/gallery/new');
  await fillEnglish(page, 'gallery', 'Unsaved album');
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = function () {
      throw new DOMException('Storage full', 'QuotaExceededError');
    };
  });
  await page.getByRole('button', {name: 'Create entry', exact: true}).click();
  await expect(page).toHaveURL(/\/gallery\/new$/);
  await expect(page.locator('#field-en-title')).toHaveValue('Unsaved album');
  await expect(page.locator('form').getByRole('alert')).toContainText(
    'could not be saved',
  );
});

test('Arabic routes, mobile navigation, previews, and responsive layouts', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openAdmin(page, '/ar/admin/products');
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({width, height: 900});
    await expect(page.getByRole('heading', {level: 1})).toHaveText('المنتجات');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`admin-products-ar-${width}.png`),
      fullPage: true,
    });
  }
  await page.setViewportSize({width: 375, height: 850});
  await page.getByRole('button', {name: 'فتح القائمة', exact: true}).click();
  await page
    .getByRole('dialog')
    .getByRole('link', {name: /الوظائف/})
    .click();
  await expect(page).toHaveURL(/\/ar\/admin\/careers$/);
  await page
    .getByRole('link', {name: /عرض التفاصيل:/})
    .first()
    .click();
  await expect(page.getByRole('heading', {level: 1})).toHaveText(
    'موظف تسويق ميداني وعلاقات عامة',
  );
  await page.getByRole('link', {name: 'تعديل', exact: true}).click();
  await expect(page.getByRole('tab', {name: /English/})).toHaveAttribute(
    'data-state',
    'active',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('admin-editor-ar-mobile.png'),
    fullPage: true,
  });
  await page
    .locator('header')
    .getByRole('link', {name: 'English', exact: true})
    .click();
  await expect(page).toHaveURL(/\/en\/admin\/careers\/field-marketing\/edit$/);
  expect(errors).toEqual([]);
});


test('calendar selection and shared field styling', async ({page}) => {
  await openAdmin(page, '/en/admin/news/new');
  await page.getByRole('button', {name: 'Create entry', exact: true}).click();
  const title = page.locator('#field-en-title');
  await expect(title).toHaveAttribute('aria-invalid', 'true');
  await expect(title).toHaveCSS('border-color', 'rgb(190, 18, 60)');
  const border = await title.evaluate(el => getComputedStyle(el).borderColor);
  await title.focus();
  expect(await title.evaluate(el => getComputedStyle(el).borderColor)).toBe(border);
  await expect(page.locator('label[for="field-en-title"]')).toHaveCSS('color', 'rgb(190, 18, 60)');
  expect(await title.evaluate(el => {const canvas = document.createElement('canvas'); const context = canvas.getContext('2d')!; context.fillStyle = getComputedStyle(el).backgroundColor; context.fillRect(0, 0, 1, 1); return Array.from(context.getImageData(0, 0, 1, 1).data);})).toEqual([245, 245, 245, 255]);
  const date = page.locator('#field-values-date');
  await date.fill('2026-11-01');
  await expect(date).toHaveAttribute('type', 'text');
  await page.getByRole('button', {name: 'Open calendar', exact: true}).click();
  await page.getByRole('button', {name: /November 18/}).click();
  await expect(date).toHaveValue('2026-11-18');
  expect(await page.locator('main *').evaluateAll(elements => elements.every(el => parseFloat(getComputedStyle(el).borderTopLeftRadius) <= 6))).toBe(true);
});
