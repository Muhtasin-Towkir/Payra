const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const axios = require('axios');

describe('User Login & Logout Flow', function() {
  let driver;
  let testUser;
  const frontendUrl = 'http://localhost:5173';
  const backendUrl = 'http://localhost:4000';

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();

    const timestamp = Date.now();
    testUser = {
      username: `agent_${timestamp}`,
      email: `agent_${timestamp}@rebellion.com`,
      mobile: `01${String(timestamp).slice(-9)}`,
      password: 'strong_password_123'
    };

    try {
      await axios.post(`${backendUrl}/api/v1/auth/register`, testUser);
      console.log(`Test agent ${testUser.email} created successfully.`);
    } catch (error) {
      console.error('Failed to create test agent via API.', error.response ? error.response.data : error.message);
      throw new Error('Test setup failed: Could not create user.');
    }
  });

  after(async function() {
    await driver.quit();
  });

  it('should allow a registered user to log in and then log out', async function() {
    try {
      await driver.get(frontendUrl);
      await driver.findElement(By.xpath("//img[@alt='Profile']")).click();
      await driver.wait(until.urlContains('/user'), 5000);
      await driver.wait(until.elementLocated(By.xpath("//h2[text()='Welcome Back']")), 5000);
      
      await driver.findElement(By.id('email')).sendKeys(testUser.email);
      await driver.findElement(By.id('password')).sendKeys(testUser.password);
      
      await driver.findElement(By.xpath("//button[text()='Login']")).click();
      
      await driver.wait(until.urlIs(`${frontendUrl}/`), 10000);
      
      const profileIcon = await driver.findElement(By.xpath("//img[@alt='Profile']"));
      const actions = driver.actions({ bridge: true });
      await actions.move({ origin: profileIcon }).perform();
      
      const logoutButton = await driver.wait(
        until.elementLocated(By.xpath("//p[text()='Logout']")), 
        5000
      );
      expect(await logoutButton.isDisplayed()).to.be.true;
      
      await logoutButton.click();
      
      await driver.sleep(1000);
      await driver.get(`${frontendUrl}/user`);
      
      const registerButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Register Now!')]")),
        5000
      );
      expect(await registerButton.isDisplayed()).to.be.true;

    } catch (error) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      await driver.takeScreenshot().then((image) => {
        require('fs').writeFileSync(`failure-login-test-${timestamp}.png`, image, 'base64');
      });
      throw error;
    }
  });
});