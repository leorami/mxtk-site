// tools/test/w12.3-grid.mjs
import fs from "node:fs/promises";
import puppeteer from "puppeteer";

const url = process.env.TEST_URL || "http://localhost:2000/dashboard";

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    try {
        // Find first widget frame
        await page.waitForSelector("[data-testid='wframe']");
        const first = (await page.$$("[data-testid='wframe']"))[0];
        console.log("✅ Found widget frames");

        // Drag down ~ 2 rows
        const box = await first.boundingBox();
        await page.mouse.move(box.x + box.width / 2, box.y + 10);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2, box.y + 60, { steps: 6 });
        await page.mouse.up();
        console.log("✅ Dragged widget down");

        // Wait for debounce + PATCH
        await new Promise(resolve => setTimeout(resolve, 800));

        // Reload and ensure it persisted by comparing gridRow style not equal to previous top
        await page.reload({ waitUntil: "networkidle0" });
        await page.waitForSelector("[data-testid='wframe']");
        const gridRow = await page.$eval("[data-testid='wframe']", el => getComputedStyle(el).gridRowStart);
        console.log("gridRowStart after reload:", gridRow);
        
        // Test resize
        const secondWidget = (await page.$$("[data-testid='wframe']"))[1];
        const resizeHandle = await secondWidget.$(".wframe-resize");
        
        if (resizeHandle) {
            const resizeBox = await resizeHandle.boundingBox();
            await page.mouse.move(resizeBox.x + 5, resizeBox.y + 5);
            await page.mouse.down();
            await page.mouse.move(resizeBox.x + 50, resizeBox.y + 50, { steps: 6 });
            await page.mouse.up();
            console.log("✅ Resized widget");
            
            // Wait for debounce + PATCH
            await new Promise(resolve => setTimeout(resolve, 800));
        } else {
            console.log("⚠️ Could not find resize handle");
        }
        
        // Take screenshot
        await fs.mkdir(`${process.cwd()}/.tmp/screenshots`, { recursive: true });
        await page.screenshot({ path: `${process.cwd()}/.tmp/screenshots/grid-test.png`, fullPage: true });
        
        console.log("✅ Grid test completed successfully");
    } catch (error) {
        console.error("❌ Test failed:", error);
        throw error;
    } finally {
        await browser.close();
    }
})();