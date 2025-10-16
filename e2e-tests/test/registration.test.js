const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('User Registration Flow', function() {
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should allow a new user to register successfully', async function() {
    const frontendUrl = 'http://localhost:5173';

    try {
      await driver.get(frontendUrl);
      
      const profileIcon = await driver.findElement(By.xpath("//img[@alt='Profile']"));
      await profileIcon.click();
      
      await driver.wait(until.urlContains('/user'), 5000);
      
      // Wait for the header
      await driver.wait(until.elementLocated(By.xpath("//h2[text()='Welcome Back']")), 5000);
      
      const toggleToRegisterButton = await driver.findElement(By.xpath("//button[contains(., 'Register Now!')]"));
      await toggleToRegisterButton.click();

      await driver.wait(until.elementLocated(By.xpath("//h2[text()='Create Account']")), 5000);
      
      const timestamp = Date.now();
      const uniqueEmail = `test_recruit_${timestamp}@jedi-order.com`;
      const uniqueMobile = `01${String(timestamp).slice(-9)}`;

      await driver.findElement(By.id('name')).sendKeys('Test Recruit');
      await driver.findElement(By.id('mobile')).sendKeys(uniqueMobile);
      await driver.findElement(By.id('signup-email')).sendKeys(uniqueEmail);
      await driver.findElement(By.id('signup-password')).sendKeys('password123');
      
      const signUpButton = await driver.findElement(By.xpath("//button[text()='Sign Up']"));
      await signUpButton.click();
      
      const successHeader = await driver.wait(
        until.elementLocated(By.xpath("//h2[text()='Welcome Back']")), 
        10000
      );
      
      expect(await successHeader.isDisplayed()).to.be.true;

    } catch (error) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      await driver.takeScreenshot().then((image) => {
        require('fs').writeFileSync(`failure-${timestamp}.png`, image, 'base64');
      });
      throw error;
    }
  });
});