const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try { 
        this.puppeteer.close(); 
    } catch (e) 
    {} 
    done();
});

describe("Header", () => {
    it("The Header Should take 100% of the viewport height", async () => {
        const header = await page.$('header');
        const headerHeight = await header.boundingBox();
        const viewportHeight = await page.evaluate(() => {
            return window.innerHeight;
        });
        expect(headerHeight.height).toBe(viewportHeight);
    });
    it("`containers.jpg` should be added to `img` tag in the header", async () => {
        const headerImg = await page.$eval('header img', img => img.src);
        expect(headerImg).toMatch(/containers.jpg/);
    });
    it("`containers.jpg` should take up 100% `width` and `height` of the header", async () => {
        const headerImage = await page.$('header img');
        const headerImageHeight = await headerImage.boundingBox();
        const header = await page.$('header');
        const headerHeight = await header.boundingBox();
        expect(headerImageHeight.height).toBe(headerHeight.height);
        expect(headerImageHeight.width).toBe(headerHeight.width);
    });
});

describe("Main Layout", () => {
    it("`<main>` tag should have the class `.container`", async () => {
        const main = await page.$('main');
        const mainClass = await main.getProperty('className');
        const mainClassName = await mainClass.jsonValue();
        expect(mainClassName).toContain('container');
    });
    it("`.container` class should be set to a `width` of 80% and be `centered` on the page", async () => {
        const container = await page.$('.container');
        const containerBoundingBox = await container.boundingBox();
        const viewportWidth = await page.evaluate(() => {
            return window.innerWidth;
        });
        const bodyWidth = await page.evaluate(() => {
            return document.body.offsetWidth;
        });
        expect(Math.ceil(containerBoundingBox.width)).toBe(Math.ceil(bodyWidth / 100 * 80)); //80% of the body width
        expect(Math.ceil(containerBoundingBox.x)).toBe(Math.ceil((viewportWidth - containerBoundingBox.width) / 2));
        expect(Math.ceil(viewportWidth - containerBoundingBox.x - containerBoundingBox.width)).toBe(Math.ceil((viewportWidth - containerBoundingBox.width) / 2));
    });
});