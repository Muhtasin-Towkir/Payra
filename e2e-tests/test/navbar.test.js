// Import necessary modules from selenium-webdriver
const { Builder, By, Key, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

// --- Configuration ---
const BASE_URL = "http://localhost:5173";
const HOME_URL = `${BASE_URL}/`;
const SHOP_URL = `${BASE_URL}/shop`;
const ABOUT_URL = `${BASE_URL}/about`;
const CONTACT_URL = `${BASE_URL}/contact`;
// Add other page URLs as needed

// --- Mocha Test Suite ---
describe('Main Navbar Navigation Test', function() {
    let driver;
    // Standard timeout for navigation tests
    this.timeout(20000);

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    // Helper function to check URL and optionally an element unique to the page
    async function verifyNavigation(linkText, expectedUrl, expectedElementSelector = null) {
        console.log(`Testing navigation for: ${linkText}`);
        try {
            // Find the link in the Navbar (ensure it's visible)
            // Using XPath to find the <p> tag containing the text within the NavLink
            const navLink = await driver.wait(until.elementLocated(By.xpath(`//ul[contains(@class, 'sm:flex')]//a[.//p[text()='${linkText.toUpperCase()}']]`)), 10000);
            await driver.wait(until.elementIsVisible(navLink), 5000);

            await navLink.click();

            // Wait for the URL to change
            await driver.wait(until.urlIs(expectedUrl), 10000, `URL did not change to ${expectedUrl} after clicking ${linkText}`);
            console.log(`Successfully navigated to ${expectedUrl}`);

            // Optional: Wait for a specific element on the target page
            if (expectedElementSelector) {
                await driver.wait(until.elementLocated(expectedElementSelector), 10000, `Expected element (${expectedElementSelector.toString()}) not found on ${linkText} page.`); // Added toString() for clarity
                 console.log(`Verified unique element on ${linkText} page.`);
            }

        } catch (e) {
            throw new Error(`Navigation test failed for ${linkText}: ${e.message || e}`);
        }
         // Navigate back home for the next test to start clean
         await driver.get(HOME_URL);
         await driver.sleep(500); // Brief pause after navigating back
    }

    // --- Test Cases ---

    it('should navigate to the Shop page', async () => {
        await driver.get(HOME_URL); // Start at home
        // Example: Verify by looking for the filter sidebar title
        await verifyNavigation('Shop', SHOP_URL, By.xpath("//h3[contains(text(), 'Filters')]"));
    });

    it('should navigate to the About page', async () => {
        await driver.get(HOME_URL);
         // Using a generic check for an h1 with large text class
        await verifyNavigation('About', ABOUT_URL, By.xpath("//h1[contains(@class, 'text-3xl')]"));
    });

    it('should navigate to the Contact page', async () => {
        await driver.get(HOME_URL);
        // --- MODIFIED SELECTOR ---
        // Changed to look for the main form element as a fallback.
        // PLEASE UPDATE with a more specific selector (like the actual h2 text or an ID)
        // if you inspect your Contact page HTML.
        await verifyNavigation('Contact', CONTACT_URL, By.css("form")); // Example: Looks for a <form> element
        // --- END MODIFICATION ---
    });

    // Add more tests for other main links (e.g., Request) if needed

    it('should navigate back to the Home page', async () => {
        // Start on a different page
        await driver.get(SHOP_URL);
        await driver.sleep(500);
        // Click the Home link
        await verifyNavigation('Home', HOME_URL, By.xpath("//h2[contains(text(), 'Best Sellers')]")); // Example selector for Home
    });

});

