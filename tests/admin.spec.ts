import {test, expect} from '@playwright/test';

for (const locale of ['en', 'ar']) {
  test(`${locale}: demo admin login, overview, language switch, and logout`, async ({
    page,
  }) => {
    await page.setViewportSize({width: 375, height: 850});
    await page.goto(`/${locale}/admin`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/admin/login$`));
    await expect(page.locator('footer')).toHaveCount(0);
    await expect(page.locator('header')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText('admin.');
    await expect(page.getByRole('heading', {level: 1})).toHaveText(
      locale === 'ar' ? 'أهلاً بعودتك' : 'Welcome back',
    );
    await page.locator('#admin-email').fill('wrong@example.com');
    await page.locator('#admin-password').fill('wrong');
    await page
      .getByRole('button', {
        name: locale === 'ar' ? 'تسجيل الدخول' : 'Sign in',
        exact: true,
      })
      .click();
    await expect(page.locator('form').getByRole('alert')).toBeVisible();
    await page
      .getByRole('button', {
        name:
          locale === 'ar' ? 'تعبئة بيانات التجربة' : 'Fill demo credentials',
      })
      .click();
    await expect(page.locator('#admin-email')).toHaveValue('admin@abuaitah.ps');
    await page
      .getByRole('button', {
        name: locale === 'ar' ? 'إظهار كلمة المرور' : 'Show password',
      })
      .click();
    await expect(page.locator('#admin-password')).toHaveAttribute(
      'type',
      'text',
    );
    await page
      .getByRole('button', {
        name: locale === 'ar' ? 'تسجيل الدخول' : 'Sign in',
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/admin$`));
    await expect(page.getByRole('heading', {level: 1})).toBeVisible();
    await expect(page.locator('main')).toContainText('25');
    await expect(page.locator('footer')).toHaveCount(0);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('body')).not.toContainText('admin.');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.reload();
    await expect(page.getByRole('heading', {level: 1})).toBeVisible();
    await page
      .locator('header')
      .getByRole('link', {name: locale === 'ar' ? 'English' : 'العربية'})
      .click();
    const other = locale === 'ar' ? 'en' : 'ar';
    await expect(page).toHaveURL(new RegExp(`/${other}/admin$`));
    await page
      .getByRole('button', {
        name: other === 'ar' ? 'فتح القائمة' : 'Open navigation',
        exact: true,
      })
      .click();
    await page
      .getByRole('button', {name: other === 'ar' ? 'تسجيل الخروج' : 'Sign out'})
      .click();
    await expect(page).toHaveURL(new RegExp(`/${other}/admin/login$`));
    await page.goto(`/${other}/admin`);
    await expect(page).toHaveURL(new RegExp(`/${other}/admin/login$`));
  });
}
