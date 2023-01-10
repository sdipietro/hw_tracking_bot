const puppeteer = require('puppeteer');

const sisAAUrl = "https://sis.appacademy.tools/courses/2fcf97ac-d89a-43f9-adc3-8b292638c872/students";

async function initBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(sisAAUrl);
    return page;
}

async function checkHwSubmission(page) {
    
}