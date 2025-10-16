const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const axios = require('axios');
const path = require('path');

describe('Request a Product Flow', function() {
  let driver;
  let testUser;
  const frontendUrl = 'http://localhost:5173';
  const backendUrl = 'http://localhost:4000';

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();

    const timestamp = Date.now();
    testUser = {
      username: `requester_${timestamp}`,
      email: `requester_${timestamp}@rebellion.com`,
      mobile: `01${String(timestamp).slice(-9)}`,
      password: 'password123'
    };

    try {
      await axios.post(`${backendUrl}/api/v1/auth/register`, testUser);
      console.log(`Request test user ${testUser.email} created.`);
    } catch (error) {
      throw new Error('Test setup failed: Could not create user for request test.');
    }
  });

  after(async function() {
    await driver.quit();
  });

  it('should allow a logged-in user to submit a product request with an image', async function() {
    try {
      //1.Login
      await driver.get(`${frontendUrl}/user`);
      await driver.wait(until.elementLocated(By.xpath("//h2[text()='Welcome Back']")), 5000);
      await driver.findElement(By.id('email')).sendKeys(testUser.email);
      await driver.findElement(By.id('password')).sendKeys(testUser.password);
      await driver.findElement(By.xpath("//button[text()='Login']")).click();
      await driver.wait(until.urlIs(`${frontendUrl}/`), 10000);

      //2. To Request 
      await driver.get(`${frontendUrl}/request`);
      await driver.wait(until.elementLocated(By.xpath("//h1[text()='Request A Product']")), 5000);

      //3. Fill form
      await driver.findElement(By.id('itemName')).sendKeys('Rare Kyber Crystal');
      await driver.findElement(By.id('externalLink')).sendKeys('https://mewmewshopbd.com/product/cat-ball-toys');
      await driver.findElement(By.id('quantity')).sendKeys('1');

      const filePath = path.resolve(__dirname, '../placeholder.png');
      await driver.findElement(By.id('itemPhoto')).sendKeys(filePath);
      
      //4. Sub
      const submitButton = await driver.findElement(By.xpath("//button[text()='Submit Request']"));
      await submitButton.click();

      // 5. Check
      const successMessage = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(), 'Product request received.')]")), // <-- THIS TEXT HAS BEEN CORRECTED
        10000
      );

      expect(await successMessage.isDisplayed()).to.be.true;
      
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      await driver.takeScreenshot().then((image) => {
        require('fs').writeFileSync(`failure-request-test-${timestamp}.png`, image, 'base64');
      });
      throw error;
    }
  });
});

