import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const PORT = 4174;
const BASE_URL = `http://localhost:${PORT}`;

async function runRegressionTests() {
  console.log('====================================================');
  console.log('🧪 Budapest Expert Hub - Automated Regression Suite');
  console.log('====================================================');

  console.log('\n[1/4] Starting Vite Preview Server on port', PORT);
  const server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], {
    cwd: rootDir,
    stdio: 'pipe',
  });

  server.stdout.on('data', (data) => {
    const text = data.toString().trim();
    if (text) console.log('  [preview]', text);
  });
  server.stderr.on('data', (data) => {
    const text = data.toString().trim();
    if (text) console.error('  [preview-err]', text);
  });

  // Allow preview server to start
  await new Promise((r) => setTimeout(r, 2000));

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (!condition) {
      failed++;
      console.error(`  ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    } else {
      passed++;
      console.log(`  ✅ PASS: ${message}`);
    }
  }

  try {
    console.log('\n[2/4] Navigating to application...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // -------------------------------------------------------------
    // SUITE 1: Theme Switching
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 1: Theme Switching ---');

    const themeToggleBtn = page.locator('.header-actions .icon-button');
    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    console.log(`  Initial theme: "${initialTheme}"`);

    // Toggle to opposite theme
    const targetTheme = initialTheme === 'dark' ? 'light' : 'dark';
    await themeToggleBtn.click();
    await page.waitForTimeout(200);

    const themeAfterToggle = await page.evaluate(() => document.documentElement.dataset.theme);
    assert(themeAfterToggle === targetTheme, `Dataset theme toggled to "${targetTheme}"`);

    const metaThemeColor = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="theme-color"]');
      return meta ? meta.getAttribute('content') : null;
    });
    const expectedColor = targetTheme === 'dark' ? '#0b1118' : '#f4f5f7';
    assert(metaThemeColor === expectedColor, `meta[name="theme-color"] updated to ${expectedColor}`);

    // Verify localStorage persistence across reload
    await page.reload({ waitUntil: 'networkidle' });
    const themeAfterReload = await page.evaluate(() => document.documentElement.dataset.theme);
    assert(themeAfterReload === targetTheme, `Theme preserved as "${targetTheme}" after page reload`);

    // Reset back to light for subsequent tests
    if (themeAfterReload === 'dark') {
      await page.locator('.header-actions .icon-button').click();
      await page.waitForTimeout(200);
    }
    const resetTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    assert(resetTheme === 'light', 'Theme reset back to "light"');

    // -------------------------------------------------------------
    // SUITE 2: Search & District Filtering
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 2: Search & District Filtering ---');

    const serviceSelect = page.locator('.search-console select').first();
    const districtSelect = page.locator('.search-console select').nth(1);
    const searchBtn = page.locator('.search-console .search-button');

    // Scenario A: Select Translator in VII. Erzsébetváros
    await serviceSelect.selectOption('Translator');
    await districtSelect.selectOption('VII. Erzsébetváros');
    await searchBtn.click();
    await page.waitForTimeout(400);

    const resultHeading = await page.locator('.experts-intro h2').innerText();
    assert(resultHeading.includes('Translator matches'), `Results heading shows "${resultHeading}"`);

    const contextDistrict = await page.locator('.experts-intro .result-context span').innerText();
    assert(contextDistrict === 'VII. Erzsébetváros', `Results context displays "${contextDistrict}"`);

    const expertName = await page.locator('.expert-feature h3').innerText();
    assert(expertName === 'Dániel Nagy', `Matched expert is Dániel Nagy (found "${expertName}")`);

    const expertRole = await page.locator('.expert-feature p').first().innerText();
    assert(expertRole === 'Translator', `Matched expert role is Translator (found "${expertRole}")`);

    // Scenario B: Select combination with no direct local match (Empty State Fallback)
    await serviceSelect.selectOption('Real Estate Lawyer');
    await districtSelect.selectOption('XIV. Zugló');
    await searchBtn.click();
    await page.waitForTimeout(400);

    const emptyResultVisible = await page.locator('.empty-result').isVisible();
    assert(emptyResultVisible, 'Empty result state is displayed when no expert matches district');

    const emptyHeading = await page.locator('.empty-result h3').innerText();
    assert(
      emptyHeading.includes('No sample match in this district yet.'),
      `Empty state message is correct: "${emptyHeading}"`
    );

    // -------------------------------------------------------------
    // SUITE 3: Modal Workflows
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 3: Modal Dialog Workflows ---');

    const openRequestBtn = page.locator('.site-header .button-dark.desktop-only');
    await openRequestBtn.click();
    await page.waitForTimeout(300);

    const isModalOpen = await page.locator('.request-dialog').isVisible();
    assert(isModalOpen, 'Request dialog opened on button click');

    // Check autofocus on first input/select
    const activeTagName = await page.evaluate(() => document.activeElement?.tagName);
    assert(activeTagName === 'SELECT', `Autofocus landed on SELECT (activeElement is <${activeTagName}>)`);

    // Check background inertness
    const backgroundInert = await page.evaluate(() => {
      const main = document.querySelector('main');
      return main ? main.inert : false;
    });
    assert(backgroundInert, 'Background elements are inert while modal is open');

    // Test Escape key dismissal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    const isModalClosedEscape = !(await page.locator('.request-dialog').isVisible());
    assert(isModalClosedEscape, 'Modal dismissed when pressing Escape');

    const backgroundNotInert = await page.evaluate(() => {
      const main = document.querySelector('main');
      return main ? !main.inert : false;
    });
    assert(backgroundNotInert, 'Background inert state removed after modal dismiss');

    // Re-open modal to test form submission flow
    await openRequestBtn.click();
    await page.waitForTimeout(300);

    // Fill situation textarea
    const situationTextarea = page.locator('.request-dialog textarea');
    await situationTextarea.fill('Moving to District XI next month and need help reviewing a residential tenancy contract.');

    // Fill email
    const emailInput = page.locator('.request-dialog input[type="email"]');
    await emailInput.fill('client@example.com');

    // Submit form
    await page.locator('.request-dialog button.submit-button').click();
    await page.waitForTimeout(300);

    const successStateVisible = await page.locator('.request-dialog .success-state').isVisible();
    assert(successStateVisible, 'Form submission transitions to success state');

    const successTitle = await page.locator('.request-dialog #request-title').innerText();
    assert(successTitle === 'Your request is ready.', `Success state header: "${successTitle}"`);

    // Close preview from success state
    await page.locator('.request-dialog .success-state button').click();
    await page.waitForTimeout(300);

    const isModalClosedAfterSuccess = !(await page.locator('.request-dialog').isVisible());
    assert(isModalClosedAfterSuccess, 'Modal closed after clicking "Close preview"');

    console.log('\n====================================================');
    console.log(`🎉 ALL TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');
  } finally {
    await browser.close();
    server.kill();
  }
}

runRegressionTests().catch((err) => {
  console.error('\n❌ Regression test suite encountered an unhandled error:', err);
  process.exit(1);
});
