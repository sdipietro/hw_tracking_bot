const credentials = require("./credentials.js");
const puppeteer = require('puppeteer');
const progressTrackerAttendanceUrl = credentials.aAurl;

async function initBrowser() {
    const browser = await puppeteer.launch({headless: true});
    console.log('Visiting Progress Tracker...');
    const page = await browser.newPage();
    // await page.authenticate({username: credentials.aAemail, password: credentials.aApassword});
    await page.goto(progressTrackerAttendanceUrl);
    console.log('Logging into Progress Tracker...');
    await page.type('[id=instructor_email]', credentials.aAemail);
    await page.type('[id=instructor_password]', credentials.aApassword);
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
    const currentDay = await page.evaluate(() => { 
        let dayDropdown = document.getElementById('day_id');
        return dayDropdown.options[dayDropdown.selectedIndex].text;
    });
    daysAttendance[currentDay] = {};
    
    console.log('Checking Attendance...');
    await page.evaluate(() => { 
        let morningButton = document.getElementsByClassName('top-bar')[0].getElementsByTagName('a')[0];
        morningButton.click();
    });
    await page.waitForNavigation(2000);

    let morningAttendance = await checkAttendance(page);
    daysAttendance[currentDay]['morning'] = morningAttendance;
    await page.evaluate(() => { 
        let lunchButton = document.getElementsByClassName('top-bar')[0].getElementsByTagName('a')[1];
        lunchButton.click();
    });
    await page.waitForNavigation(2000);

    let lunchAttendance = await checkAttendance(page);
    daysAttendance[currentDay]['lunch'] = lunchAttendance;
    await page.evaluate(() => { 
        let afternoonButton = document.getElementsByClassName('top-bar')[0].getElementsByTagName('a')[2];
        afternoonButton.click();
    });
    await page.waitForNavigation(2000);

    let afternoonAttendance = await checkAttendance(page);
    daysAttendance[currentDay]['afternoon'] = afternoonAttendance;

    console.log('Checked attendance: ');
    console.log(daysAttendance);
    return daysAttendance;
}

async function inputBPSS(data){
    const browser = await puppeteer.launch({headless: true});
    console.log('Visiting Google...');
    const page = await browser.newPage();
    await page.goto(credentials.gURL);
    console.log('Logging into Google...');
    await page.type('[id=identifierId]', credentials.gEmail);
    await page.keyboard.press('Enter',{delay:2000});
    // const passwordInput = await page.$$('input[name=Passwd]');
    await page.type('input[name=Passwd]', credentials.gPassword);
    await page.keyboard.press('Enter',{delay:2000});
    console.log('Logged in to Google.')
    return page;
}

async function runAttendance(){
    const page = await initBrowser();
    const attendanceData = await checkMorningLunchAfternoon(page);
    // await inputBPSS(attendanceData);
}

runAttendance();