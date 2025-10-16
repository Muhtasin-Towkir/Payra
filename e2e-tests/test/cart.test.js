const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const axios = require('axios');

describe('Add Item to Cart Flow', function() {
  let driver;
  let testUser;
  const frontendUrl = 'http://localhost:5173';
  const backendUrl = 'http://localhost:4000';

  //user via API
  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();

    const timestamp = Date.now();
    testUser = {
      username: `cart_tester_${timestamp}`,
      email: `cart_tester_${timestamp}@rebellion.com`,
      mobile: `01${String(timestamp).slice(-9)}`,
      password: 'password123'
    };

    try {
      await axios.post(`${backendUrl}/api/v1/auth/register`, testUser);
      console.log(`Cart test user ${testUser.email} created.`);
    } catch (error) {
      throw new Error('Test setup failed: Could not create user for cart test.');
    }
  });

  after(async function() {
    await driver.quit();
  });

  it('should allow a logged-in user to add a product to their cart', async function() {
    const targetProduct = 'Kids Festive Dress';

    try {
      //1.Login
      await driver.get(`${frontendUrl}/user`);
      await driver.wait(until.elementLocated(By.xpath("//h2[text()='Welcome Back']")), 5000);
      await driver.findElement(By.id('email')).sendKeys(testUser.email);
      await driver.findElement(By.id('password')).sendKeys(testUser.password);
      await driver.findElement(By.xpath("//button[text()='Login']")).click();
      await driver.wait(until.urlIs(`${frontendUrl}/`), 10000);

      //2.Navigate & add to cart
      await driver.get(`${frontendUrl}/shop`);

      // Wait to load
      const productTitleElement = await driver.wait(
        until.elementLocated(By.xpath(`//h3[text()='${targetProduct}']`)), 10000
      );
      
      // Find the beacon from Cart(F.E)
      // This XPath goes to same product
      const addToCartButton = await productTitleElement.findElement(By.xpath("./ancestor::div[contains(@class, 'p-4')]//button[contains(text(), 'Add To Cart')]"));
      await addToCartButton.click();

      //3. Verify Cart

      //A) Verify the cart icon count
      const cartIconBadge = await driver.wait(
        until.elementLocated(By.xpath("//button[@data-testid='cart-icon-button']//span[text()='1']")), 
        5000
      );
      expect(await cartIconBadge.isDisplayed()).to.be.true;

      // B) Open the cart and verify the correct item is inside
      const cartIconButton = await driver.findElement(By.css('[data-testid="cart-icon-button"]'));
      await cartIconButton.click();

      const cartItemTitle = await driver.wait(
        until.elementLocated(By.xpath(`//div[contains(@class, 'fixed')]//h3[text()='${targetProduct}']`)),
        5000
      );
      expect(await cartItemTitle.isDisplayed()).to.be.true;
      
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      await driver.takeScreenshot().then((image) => {
        require('fs').writeFileSync(`failure-cart-test-${timestamp}.png`, image, 'base64');
      });
      throw error;
    }
  });
});