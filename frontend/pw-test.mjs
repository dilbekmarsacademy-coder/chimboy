import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:5175';
const routes = [
  '/', '/products', '/promotions', '/stores', '/cart', '/wishlist',
  '/checkout', '/about', '/contact', '/login', '/register',
  '/profile', '/products/1', '/some-nonexistent-page',
];

const results = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });

for (const route of routes) {
  const page = await ctx.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedReq = [];

  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('requestfailed', (r) => {
    const u = r.url();
    if (!u.startsWith('data:')) failedReq.push(`${u} (${r.failure()?.errorText})`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith(BASE)) failedReq.push(`${r.url()} -> HTTP ${r.status()}`);
  });

  let title = '';
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1200);
    title = await page.title();
  } catch (e) {
    pageErrors.push('NAV: ' + e.message);
  }

  results.push({ route, title, consoleErrors, pageErrors, failedReq });
  await page.close();
}

// Interaction test: add to cart from products page
const page = await ctx.newPage();
const interErrors = [];
page.on('console', (m) => { if (m.type() === 'error') interErrors.push('[products] ' + m.text()); });
page.on('pageerror', (e) => interErrors.push('[products] ' + e.message));
try {
  await page.goto(BASE + '/products', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const cards = await page.locator('a[href^="/products/"]').count();
  results.push({ route: 'INTERACTION', title: `product links found: ${cards}`, consoleErrors: interErrors, pageErrors: [], failedReq: [] });
} catch (e) {
  results.push({ route: 'INTERACTION', title: 'FAILED', consoleErrors: interErrors, pageErrors: [e.message], failedReq: [] });
}
await page.close();

await browser.close();

// Report
let hasError = false;
for (const r of results) {
  const errs = [...r.consoleErrors, ...r.pageErrors, ...r.failedReq];
  if (errs.length) hasError = true;
  const status = errs.length ? '❌' : '✅';
  console.log(`${status} ${r.route}  ${r.title ? '— ' + r.title : ''}`);
  for (const e of errs) console.log(`      • ${e}`);
}
console.log('\nSUMMARY: ' + (hasError ? 'ERRORS FOUND' : 'all clean'));
