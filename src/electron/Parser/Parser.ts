import puppeteer, { Page, Browser } from 'puppeteer';

class Scraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  // Запуск браузера и создание страницы
  public async launch(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true, // Установите true, если не хотите видеть браузер
      defaultViewport: null, // Автоматически использовать полный экран
    });
    this.page = await this.browser.newPage();
  }

  // Открытие URL на странице
  public async openPage(url: string): Promise<void> {
    if (this.page) {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    } else {
      throw new Error('Page is not initialized.');
    }
  }

  // Выполнение парсинга (например, извлечение текста)
  public async parseData(): Promise<string[]> {
    if (this.page) {
      const data = await this.page.$$eval('selector', (elements) =>
        elements.map((el) => el.textContent?.trim() || '')
      );
      return data;
    } else {
      throw new Error('Page is not initialized.');
    }
  }

  // Закрытие браузера
  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Пример использования
(async () => {
  const scraper = new Scraper();

  try {
    await scraper.launch();
    await scraper.openPage('https://example.com');
    const data = await scraper.parseData();
    console.log(data);
  } catch (error) {
    console.error(error);
  } finally {
    await scraper.close();
  }
})();
