const credentials = require("./credentials.js");
const puppeteer = require('puppeteer');
const progressTrackerAttendanceUrl = credentials.url;

async function initBrowser() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    // await page.authenticate({username: credentials.email, password: credentials.password});
    await page.goto(progressTrackerAttendanceUrl);
    await page.type('[id=instructor_email]', credentials.email);
    await page.type('[id=instructor_password]', credentials.password);
    await page.keyboard.press('Enter',{delay:2000});
    return page;
}

async function checkAttendance(page) {

    const studentList = await page.evaluate(() => { 
        let attendanceObj = {};
        let studentButtons = Array.from(document.getElementsByClassName('check-ins')[0].getElementsByTagName('form'));
        studentButtons.forEach((ele) => {
            let formButton = ele.getElementsByTagName('fieldset')[0];
            let studentName = formButton.getElementsByTagName('label')[0].innerText.split(' - ')[0];
            if (formButton.className === 'present') {
                attendanceObj[studentName] = true;
            } else {
                attendanceObj[studentName] = false;
            }
        });
        return attendanceObj;
    });
    return studentList;

    // const studentArr = studentList.$$('input', students => {students.forEach(student => {
    //     student.click();
    // });});
    // await page.$$eval(studentArr, );
}

async function checkMorningLunchAfternoon(page) {
    let daysAttendance = {};
    await page.evaluate(() => { 
        let morningButton = document.getElementsByClassName('top-bar')[0].getElementsByTagName('a')[0];
        morningButton.click();
    });
    await page.waitForNavigation(2000);
    let morningAttendance = await checkAttendance(page);
    daysAttendance['morning'] = morningAttendance;
    await page.evaluate(() => { 
        let lunchButton = document.getElementsByClassName('top-bar')[0].getElementsByTagName('a')[1];
        lunchButton.click();
    });
    await page.waitForNavigation(2000);
    let lunchAttendance = await checkAttendance(page);
    daysAttendance['lunch'] = lunchAttendance;
    await page.evaluate(() => { 
        let afternoonButton = document.getElementsByClassName('top-bar')[0].getElementsByTagName('a')[2];
        afternoonButton.click();
    });
    await page.waitForNavigation(2000);
    let afternoonAttendance = await checkAttendance(page);
    daysAttendance['afternoon'] = afternoonAttendance;
    console.log(daysAttendance);
}

async function runAttendance(){
    const page = await initBrowser();
    await checkMorningLunchAfternoon(page);
}

runAttendance();