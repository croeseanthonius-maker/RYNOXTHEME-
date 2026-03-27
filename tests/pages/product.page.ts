import { Page } from 'puppeteer';

export class ProductPage {
    constructor(private page: Page) {}

    async addToCart() {
        await this.page.waitForSelector('button[type="submit"]');
        await this.page.click('button[type="submit"]');
        // Wait for the cart to update
        await this.page.waitForTimeout(1000);
    }
}
