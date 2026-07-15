import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:5175';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('tile.openstreetmap')) errs.push('CONSOLE: ' + m.text()); });
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

const log = (s) => console.log(s);
const body = () => page.locator('body');

// 1. Add to cart from a product card, check cart badge
await page.goto(BASE + '/products', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const addBtns = page.locator('button:has(svg)').filter({ hasText: '' });
// Try clicking the first "add to cart" style button within a product card
const firstCard = page.locator('a[href^="/products/"]').first();
await firstCard.scrollIntoViewIfNeeded();
// hover to reveal action buttons if any
await firstCard.hover();
await page.waitForTimeout(300);
// find buttons near product grid
const cartButtons = page.getByRole('button').filter({ hasText: /savat|корзин|cart/i });
let added = false;
try {
  if (await cartButtons.count() > 0) { await cartButtons.first().click(); added = true; }
} catch {}
log(`1. add-to-cart button found & clicked: ${added}`);

// 2. Language switch — capture a heading, toggle lang, see if it changes
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const langButtons = page.getByRole('button').filter({ hasText: /^(UZ|RU|O'z|Рус)/i });
const beforeText = (await body().innerText()).slice(0, 400);
let langSwitched = false;
try {
  const ru = page.getByRole('button', { name: /RU|Рус/i }).first();
  if (await ru.count() > 0) { await ru.click(); await page.waitForTimeout(800); langSwitched = true; }
} catch {}
const afterText = (await body().innerText()).slice(0, 400);
log(`2. language toggle clicked: ${langSwitched}; text changed: ${beforeText !== afterText}`);

// 3. Login with mock creds
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
let loginResult = 'not attempted';
try {
  await page.locator('input[type="email"]').fill('test@chimboy.uz');
  await page.locator('input[type="password"]').fill('chimboy123');
  await page.getByRole('button', { name: /kir|вой|login|sign/i }).first().click();
  await page.waitForTimeout(1500);
  loginResult = 'url=' + page.url();
} catch (e) { loginResult = 'ERR ' + e.message; }
log(`3. login flow: ${loginResult}`);

await page.waitForTimeout(500);
log('--- JS errors during flows ---');
if (errs.length === 0) log('   none');
else errs.forEach((e) => log('   • ' + e));

await browser.close();
