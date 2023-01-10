const puppeteer = require('puppeteer');

const progressTrackerAttendanceUrl = "https://progress.appacademy.io/cycles/309/attendances";

async function initBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(progressTrackerAttendanceUrl);
    return page;
}

async function checkInAttendance(page) {
    const studentList = page.$('.check-ins');
    const studentArr = studentList.$$('input');
    await page.$$eval(studentArr, );

    
    // const html = await page.evaluate(() => {
    //     return document.getElementById("g-recaptcha-response").innerHTML;
    // });
    // console.log(html);
}

async function runAttendance(){
    const page = await initBrowser();
    await checkInAttendance(page);
}