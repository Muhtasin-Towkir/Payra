const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Search Functionality Flow', function() {
  let driver;
  const frontendUrl = 'http://localhost:5173';

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should find an existing product and display it on the results page', async function() {
    const searchTerm = 'Kids Festive Dress';

    try {
      await driver.get(frontendUrl);

      //testID
      const searchToggleButton = await driver.findElement(By.css('[data-testid="search-toggle-button"]'));
      await searchToggleButton.click();
      
      const searchInput = await driver.wait(
        until.elementLocated(By.xpath("//input[@placeholder='Search products...']")),
        5000
      );
      
      await searchInput.sendKeys(searchTerm, Key.RETURN);

      await driver.wait(until.urlContains(`/search/${encodeURI(searchTerm)}`), 5000);

      const productTitleElement = await driver.wait(
        until.elementLocated(By.xpath(`//h3[text()='${searchTerm}']`)),
        10000
      );
      
      expect(await productTitleElement.isDisplayed()).to.be.true;

    } catch (error) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      await driver.takeScreenshot().then((image) => {
        require('fs').writeFileSync(`failure-search-found-${timestamp}.png`, image, 'base64');
      });
      throw error;
    }
  });

  it('should show a "no results" message for a non-existent product', async function() {
    const searchTerm = 'Phantom Menace Womp Rat';

    try {
      await driver.get(frontendUrl);
      
      // testID
      const searchToggleButton = await driver.findElement(By.css('[data-testid="search-toggle-button"]'));
      await searchToggleButton.click();

      const searchInput = await driver.wait(
        until.elementLocated(By.xpath("//input[@placeholder='Search products...']")),
        5000
      );

      await searchInput.sendKeys(searchTerm, Key.RETURN);
      
      await driver.wait(until.urlContains(`/search/${encodeURI(searchTerm)}`), 5000);
      
      const noResultsElement = await driver.wait(
        until.elementLocated(By.xpath("//p[contains(text(), 'No transmissions found')]")),
        10000
      );
      
      expect(await noResultsElement.isDisplayed()).to.be.true;

    } catch (error) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      await driver.takeScreenshot().then((image) => {
        require('fs').writeFileSync(`failure-search-not-found-${timestamp}.png`, image, 'base64');
      });
      throw error;
    }
  });
});