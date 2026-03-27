import { Page } from 'puppeteer';

export class HomePage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto('http://127.0.0.1:9292', { waitUntil: 'networkidle0' });
    }

    async getCartNumber(): Promise<number> {
        await this.page.waitForSelector('.mainNav__cart-count');
        const cartCountElement = await this.page.$('.mainNav__cart-count');
        if (cartCountElement) {
            const text = await this.page.evaluate(element => element.textContent, cartCountElement);
            return parseInt(text || '0', 10);
        }
        return 0;
    }

    async goToFirstProduct() {
        await this.page.waitForSelector('.collection-card');
        await this.page.click('.collection-card');
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }
}
