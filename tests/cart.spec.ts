import puppeteer from 'puppeteer';
import "reflect-metadata";
import {expect} from 'chai';
import { HomePage } from './pages/home.page';
import { ProductPage }
    from "./pages/product.page";

describe('Updating cart', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let homePage: HomePage;
    let productPage: ProductPage;

    before(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
    });

    after(async () => {
        await browser.close();
    });

    it("should not have any item in the cart", async () => {
        await homePage.open();
        const number = await homePage.getCartNumber();
        expect(number).to.be.equal(0);
    });

    it("should update the cart when an element is added to it", async () => {
        await homePage.open();
        await homePage.goToFirstProduct();
        await productPage.addToCart();
        const number = await homePage.getCartNumber();
        expect(number).to.be.equal(1);
    })
});