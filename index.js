const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const http = require('http')
let proxies = [];
let ports = [];

const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
];

const options = {
    args,
    headless: "new",
    ignoreHTTPSErrors: true,
};

async function run() {

    puppeteer.use(StealthPlugin())

    const browser = await puppeteer.launch(options);


    const page = await browser.newPage();
    
    await page.goto('https://free-proxy-list.net/'); //insert url
 

    const x = await page.evaluate(() => Array.from(document.querySelectorAll('#list tbody tr'), (e) => ({
        IP: e.querySelector('td').innerText,
        port: e.querySelector('td').nextElementSibling.innerText,
        isHttps: e.querySelector('.hx').innerText
        //go into, id list, into tbody tag, and tr tag, tag of td and class hx
    }))); //insert element

    for (let i = 1; i < x.length; i++){  
        if(x[i].isHttps=="yes"){
            proxies.push(x[i].IP);
            ports.push(x[i].port);
        }
    }

    fs.writeFile('proxies.json', JSON.stringify(proxies), (err) => {
        if(err) throw err;
        console.log('proxies.json saved');
    });

    fs.writeFile('ports.json', JSON.stringify(ports), (err) => {
        if(err) throw err;
        console.log('ports.json saved');
    });

    console.log("done");
    

    /*await puppeteer.launch({
        args: ['--proxy-server=http://'+proxies[1]+':'+ports[1]]
    });
    await page.goto('https://bot.sannysoft.com')
    await page.waitForTimeout(5000)
    await page.screenshot({ path: 'testresult2.png', fullPage: true })
    console.log(`All done, check the screenshot.`)*/

    await browser.close();


}


async function checkDetection() {
    //'--proxy-server=http://'+proxies[1]+':'+ports[1] for args
      
    puppeteer.use(StealthPlugin())

    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();

    await page.goto('https://bot.sannysoft.com', { waitUntil: 'networkidle2'});
    await page.waitForSelector('#fp2 td'); // replace element
    await page.screenshot({ path: 'testresult2.png', fullPage: true })
    console.log(`All done, check the screenshot.`)

    await browser.close();
}

async function main() {

    puppeteer.use(StealthPlugin())

    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();
}


run();

//checkDetection();

//main();