var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from 'puppeteer';
class Scraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    // Запуск браузера и создание страницы
    launch() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer.launch({
                headless: true, // Установите true, если не хотите видеть браузер
                defaultViewport: null, // Автоматически использовать полный экран
            });
            this.page = yield this.browser.newPage();
        });
    }
    // Открытие URL на странице
    openPage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                yield this.page.goto(url, { waitUntil: 'domcontentloaded' });
            }
            else {
                throw new Error('Page is not initialized.');
            }
        });
    }
    // Выполнение парсинга (например, извлечение текста)
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                const data = yield this.page.$$eval('selector', (elements) => elements.map((el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; }));
                return data;
            }
            else {
                throw new Error('Page is not initialized.');
            }
        });
    }
    // Закрытие браузера
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
}
// Пример использования
(() => __awaiter(void 0, void 0, void 0, function* () {
    const scraper = new Scraper();
    try {
        yield scraper.launch();
        yield scraper.openPage('https://example.com');
        const data = yield scraper.parseData();
        console.log(data);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        yield scraper.close();
    }
}))();
