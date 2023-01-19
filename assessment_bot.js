const credentials = require("./credentials.js");
const puppeteer = require('puppeteer');
const { exec } = require("child_process");

const progressTrackerScoresUrl = credentials.scoresUrl;

async function loginPT(page) {
    console.log('Visiting Progress Tracker...');
    await page.goto(progressTrackerScoresUrl);
    console.log('Logging into Progress Tracker...');
    await page.type('[id=instructor_email]', credentials.aAemail);
    await page.type('[id=instructor_password]', credentials.aApassword);
    await page.keyboard.press('Enter',{delay:5000});
    return page;
}

async function getScores(page) {
    const studentList = await page.evaluate(() => { 
        let scoresObj = {};
        let studentRows = Array.from(document.getElementsByTagName('tbody')[0].getElementsByTagName('tr'));
        studentRows.forEach((ele) => {
            let name = ele.getElementsByTagName('td')[1].getElementsByTagName('a')[0].innerText;
            let submissionLink = ele.getElementsByTagName('td')[3].getElementsByTagName('a')[0];
            
            if (submissionLink) {
                scoresObj[name] = submissionLink.href;
            }
        });
        
        return scoresObj;
    });
    
    return studentList;
}

function gradeAssessments(assessmentLinksObj) {
    let scores = {};
    let links = Object.values(assessmentLinksObj);

    for (let name in assessmentLinksObj) {
        let link = assessmentLinksObj[name].split('?');
        link.pop();
        let newLink = link.join('');
        let newName = name.split(' ').join('');
        let command = `/Users/steve/Desktop/hw_tracking_bot/downloadAssessmentScript.sh "${newLink}" "${newName}"`
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

    links.forEach(link => {
        
    });
}

async function updateScores(){
    console.log('Opening Virtual Browser...');
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const loggedInPT = await loginPT(page);
    console.log('Getting Scores...');
    const scoresData = await getScores(loggedInPT);
    gradeAssessments(scoresData);
    // console.log(scoresData);
    // console.log('Closing Virtual Browser...');
    // await page.close();
    // await browser.close();
    // console.log('Done!');
}

updateScores();

