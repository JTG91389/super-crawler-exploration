'use strict';

const { Worker }  = require('worker_threads');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');
const nlpProcessor = require('../modules/nlp');
const path = require('path');
const puppeteer = require('puppeteer');

async function fetchData(url){
    console.log("Crawling data...")

    // make http call to url
    let response = await axios(url).catch((err) => console.log(err));
    
    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;

}

class arbitrager {
    constructor(dir) {
        this.workerDir = dir;
    }

    async start() {
        try {
            const fetchPromiseArr = [];
            const sources = await db.source.findAll({
                include: [{
                    model: db.sourcePage,
                    include: [db.event]
                }]
            });
            sources.forEach(source => {
                if (source.sourcePages) {
                    source.sourcePages.forEach(sourcePage => {
                        const url = `${source.routeDomain}${sourcePage.uriPath}`;
                        fetchPromiseArr.push(axios(url, {
                            headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' }
                        }).catch((err) => console.log(err)))
                    })
                }
            });
            const crawledContent = await Promise.all(fetchPromiseArr);
            crawledContent.forEach(async response => {
                if (response?.status === 200 && response?.data) {
                    const $ = cheerio.load(response.data);
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.setContent($.root().html(), { waitUntil: 'domcontentloaded' });
                    await page.setViewport({ width: 1680, height: 1050 });
                    await page.pdf({
                        path: `crawler-temp-docs/test-one.pdf`,
                        format: "A4",
                        printBackground: false
                    });
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = arbitrager;