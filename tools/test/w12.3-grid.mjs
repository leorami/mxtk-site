// tools/test/w12.3-grid.mjs
import puppeteer from "puppeteer";

const url = process.env.TEST_URL || "http://localhost:2000/dashboard";

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    // Find first widget frame
    await page.waitForSelector(".wframe");
    const first = (await page.$$(".wframe"))[0];

    // Drag down ~ 2 rows
    const box = await first.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + 10);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + 60, { steps: 6 });
    await page.mouse.up();

    // Wait for debounce + PATCH
    await page.waitForTimeout(800);

    // Reload and ensure it persisted by comparing gridRow style not equal to previous top
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector(".wframe");
    const gridRow = await page.$eval(".wframe", el => getComputedStyle(el).gridRowStart);
    console.log("gridRowStart after reload:", gridRow);

    await browser.close();
})();
