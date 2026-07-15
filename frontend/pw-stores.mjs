import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:5175';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let ok = 0, aborted = 0, other = 0;
page.on('response', (r) => { if (r.url().includes('tile.openstreetmap')) { if (r.status() === 200) ok++; else other++; } });
page.on('requestfailed', (r) => { if (r.url().includes('tile.openstreetmap')) aborted++; });
await page.goto(BASE + '/stores', { waitUntil: 'load' });
await page.waitForTimeout(6000); // let tiles settle, no early close
await page.screenshot({ path: '/tmp/stores.png', fullPage: false });
console.log(`tiles 200=${ok}  aborted=${aborted}  other=${other}`);
await browser.close();
