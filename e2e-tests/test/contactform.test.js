const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Contact Form Submission Flow', function() {
  let driver;
  const frontendUrl = 'http://localhost:5173';

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should allow a user to submit the contact form successfully', async function() {
    try {
      // 1. Navigate to the contact page
      await driver.get(`${frontendUrl}/contact`);
      
      // 2. Wait for header
      await driver.wait(until.elementLocated(By.xpath("//h1[text()='Send us Message']")), 5000);
      
      // 3. Create data
      const timestamp = Date.now();
      const testEmail = `diplomat_${timestamp}@rebellion.net`;
      
      // 4. Find the input fields by their ID and fill them out
      await driver.findElement(By.id('name')).sendKeys('Leia Organa');
      await driver.findElement(By.id('email')).sendKeys(testEmail);
      await driver.findElement(By.id('phone')).sendKeys('555-123-4567');
      await driver.findElement(By.id('message')).sendKeys('Help me, Obi-Wan Kenobi. You’re my only hope.');
      
      // 5. Find and click the "Submit" button
      const submitButton = await driver.findElement(By.xpath("//button[text()='Submit']"));
      await submitButton.click();
      
      // 6. VERIFY SUCCESS: Wait for the success message to appear on the page
      const successMessage = await driver.wait(
        until.elementLocated(By.xpath("//p[contains(text(), 'Transmission received')]")), 
        10000 // Wait till 10 seconds
      );
      
      // 7. Assert that the success message is visible
      expect(await successMessage.isDisplayed()).to.be.true;

    } catch (error) {
      // If any step fails, take a screenshot
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      await driver.takeScreenshot().then((image) => {
        require('fs').writeFileSync(`failure-contact-test-${timestamp}.png`, image, 'base64');
      });
      throw error;
    }
  });
});
