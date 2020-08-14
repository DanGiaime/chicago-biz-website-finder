
const {findBizSites, findBizData} = require('./apis');
const { fileWrite, project } = require('./helpers');
const {desiredFields} = require('./config');

// GOAL: Get 10,000 emails of hair salons in chicago

// Alternate path to success
// 1. Get list of business names (+ other data) from Chicago Data API - findBizData()
// 2. Query Bing Search API (through azure) to get websites - findBizSites(bizNames)
// 3. Scrape websites and linked pages with email_scraper - run(bizDataBlobs)
// 4. Send emails through some tool (TBD~)

// Necessary to run await in main
let DOTHETHING = async () => {
  let bizData = await findBizData();
  let bizDataPlusSites = await findBizSites(bizData);
  fileWrite(bizDataPlusSites.map(bizDataBlob => project(bizDataBlob, desiredFields)));
}

// Zhu Li, Do the thing! https://preview.redd.it/51eee0ika7d21.png?auto=webp&s=aa0c9e09b163478e4eef5f2be8d1bafa3c05ac62
DOTHETHING();