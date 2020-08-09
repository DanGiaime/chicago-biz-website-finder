const azureAPIKEY = "YOUR_API_KEY_HERE";
const fetch = require('node-fetch');
const fs = require('fs');

// GOAL: Get 10,000 emails of hair salons in chicago

// 1. Get list of business names from Chicago Data API - findBizNames()
// 2. Query Bing Search API (through azure) to get websites - findBizSites(bizNames)
// 2.5 Write away websites to .csv (needed for phantombuster) - writeFile(bizSites)
// 3. Launch GIANT phantombuster to scrape emails from all websites - go to phantombuster site, make a Data Scraping Crawler
// 4. Send 10,000 emails through PersistIQ (manually?) (TBD~)

// What is the _exact_ business type you want to search for? Must be a business type provided by api
const bizType = "Hair Salon";

// endpoint for the chicago business data
const chicagoBizEndpointURL = `https://data.cityofchicago.org/resource/uupf-x98q.json?business_activity=${encodeURI(bizType)}&$limit=2000`;

// bing search api url
const bingSearchAPIURL = "https://api.cognitive.microsoft.com/bing/v7.0/search?q="

// options/query params for ing search (format is bingSearchAPIURL + BIZ_NAME + bingSearchAPIURLTail)
const bingSearchAPIURLTail = " -site:yelp.com -site:facebook.com -site:beautylaunchpad.com -site:es.wikipedia.org -site:groupon.com -site:yellowpages.com -site:mapquest.com&count=3&responseFilter=Webpages";

// Find names of all businesses in chicago
let findBizNames = async () => {
  let bizData = await fetch(chicagoBizEndpointURL, {
        method: 'get',
    })
    .then(res => res.json());

  return bizData.map(biz => `${biz.doing_business_as_name} Chicago`);
}

// Find websites of all chicago businesses
let findBizSites = async (bizNames) => {
  let bizSites = [];

  // Search each site individually  
  for (let i = 0; i < bizNames.length; i++) { 
    let bizSiteData = await fetch(bingSearchAPIURL + bizNames[i] + bingSearchAPIURLTail, {
      method: 'get',
      headers: {
        "Ocp-Apim-Subscription-Key": azureAPIKEY
      }
    })
    .then(res => res.json());
    
    // Rate limit ourselves (may be unnecessary)
    await sleep(20);
    console.log(`Found site from ${bizNames[i]}! - ${bizSiteData.webPages.value[0].url}`);

    // navigate to business url through chicago data payload
    bizSites.push(bizSiteData.webPages.value[0].url);
  }
  
  return bizSites;
};

// Write out biz websites to single-column csv (correct format for phantombuster)
let fileWrite = (bizSitesArr) => {
  let bizSitesFormatted = bizSitesArr.join("\n");
  let fileName = bizType; 

  fs.writeFile(`${fileName}.csv`, bizSitesFormatted, (err) => {
    if (err) throw err;
    console.log('The file has been saved! POG');
  });
};

// literally just a sleep method to stop from going too fast - https://i.kym-cdn.com/entries/icons/original/000/006/360/gottago.jpg
let sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Necessary to run await in main
let DOTHETHING = async () => {
  let bizNames = await findBizNames();
  console.log(bizNames);
  let bizSites = await findBizSites(bizNames);
  fileWrite(bizSites);
}

// Zhu Li, Do the thing! https://preview.redd.it/51eee0ika7d21.png?auto=webp&s=aa0c9e09b163478e4eef5f2be8d1bafa3c05ac62
DOTHETHING();