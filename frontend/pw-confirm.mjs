import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:5175';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('tile.openstreetmap')) errs.push(m.text()); });
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

// ADD TO CART via product detail page (buttons always visible there)
await page.goto(BASE + '/products/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const addBtn = page.getByRole('button', { name: /savatga|корзин|add to cart/i }).first();
const had = await addBtn.count();
let cartCount = 'n/a';
if (had) {
  await addBtn.click();
  await page.waitForTimeout(600);
  // read cart badge in header
  cartCount = await page.evaluate(() => JSON.parse(localStorage.getItem('chimboy_cart') || '{}')?.state?.items?.length ?? 'no-store');
}
console.log(`ADD TO CART: button=${had>0}, items in cart store=${cartCount}`);

// LOGIN with correct selectors
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('form input[type="text"]').first().fill('test@chimboy.uz');
await page.locator('form input').nth(1).fill('chimboy123');
await page.getByRole('button', { name: /kir|вой|login/i }).first().click();
await page.waitForTimeout(1500);
const authed = await page.evaluate(() => !!JSON.parse(localStorage.getItem('chimboy_auth') || '{}')?.state?.user);
console.log(`LOGIN: authenticated=${authed}, url=${page.url()}`);

console.log('JS errors:', errs.length ? errs : 'none');
await browser.close();
