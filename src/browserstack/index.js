/* eslint-disable */
const { Builder, By, Key, Keys, until } = require('selenium-webdriver');
const fs = require('fs');
const argv = require('yargs').argv;
/* eslint-enable */

const BS_USERNAME = argv.username || argv.u;
const BS_AUTHKEY = argv.auth || argv.a || argv.p;

// Input capabilities
const capabilities = {
  browserName: 'Chrome',
  browser_version: '62.0',
  os: 'Windows',
  os_version: '10',
  resolution: '1920x1200',
  'browserstack.user': BS_USERNAME,
  'browserstack.key': BS_AUTHKEY,
  'browserstack.debug': 'true',
  'browserstack.networkLogs': 'true',
};

async function main() {
  const driver = await new Builder()
  .usingServer('http://hub-cloud.browserstack.com/wd/hub')
  // .forBrowser('chrome')
  .withCapabilities(capabilities)
  .build();

  async function takeScreenshot(name) {
    driver.takeScreenshot().then(
        (image) => {
          fs.writeFile(`./${name}.jpg`, image, 'base64', (err) => {
            console.log(err);
          });
        },
    );
  }

  /* LOGIN */
  // load login page
  await driver.get('http://localhost:3000');
  await driver.wait(() => driver.executeScript('return document.readyState').then(readyState => readyState === 'complete'));
  // maximize window
  await driver.manage().window().maximize();
  // login as user
  let element = await driver.findElement(By.partialLinkText('Leah Shadtrach'));
  element.click();

  /* HOME */
  // load home page
  await driver.wait(until.titleIs('Home - TalentMAP'));
  await driver.sleep(6000);
  // open glossary
  element = await driver.findElement(By.id('glossary-open-icon'));
  element.click();
  await driver.sleep(1000);
  // take screenshot
  await takeScreenshot('home');
  // enter search term
  element = await driver.findElement(By.name('search'));
  await element.sendKeys('german');
  // submit search term
  await element.sendKeys(Key.ENTER);

  /* SEARCH RESULTS */
  // load search results page
  await driver.sleep(5000);
  await driver.wait(until.titleIs('Search Results - TalentMAP'));
  await takeScreenshot('search_results');
  // add a comparison choice
  element = await driver.findElement(By.className('compare-check-box-container'));
  element.click();
  await driver.sleep(4000);
  await takeScreenshot('search_results_with_comparison');
  // click position details
  element = await driver.findElement(By.partialLinkText('View position'));
  element.click();

  /* POSITION DETAILS */
  // load position details
  await driver.sleep(3000);
  await takeScreenshot('position_details');
  // add favorite
  element = await driver.findElement(By.className('favorite-container'));
  element.click();
  await driver.sleep(2000);
  await takeScreenshot('position_details_with_favorited');
  // open user menu dropdown
  element = await driver.findElement(By.className('dropdown__trigger'));
  element.click();
  await takeScreenshot('position_details_with_user_dropdown');
  // go to dashboard
  await driver.sleep(100);
  element = await driver.findElement(By.partialLinkText('Dashboard'));
  element.click();

  /* DASHBOARD */
  // load dashboard
  await driver.sleep(5000);
  await takeScreenshot('dashboard');
  await driver.sleep(1000);

  // end
  await driver.quit();
}
main();
