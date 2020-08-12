const azureAPIKEY = "bc22c95817944799850b9604e8455280";
const fetch = require('node-fetch');
const ObjectsToCsv = require('objects-to-csv');
 
// GOAL: Get 10,000 emails of hair salons in chicago

// 1. Get list of business names from Chicago Data API - findBizData()
// 2. Query Bing Search API (through azure) to get websites - findBizSites(bizNames)
// 2.5 Write away websites to .csv (needed for phantombuster) - writeFile(bizSites)
// 3. Launch GIANT phantombuster to scrape emails from all websites - go to phantombuster site, make a Data Scraping Crawler
// 4. Send 10,000 emails through PersistIQ (manually?) (TBD~)

// Alternate path to success
// 1. Get list of business names from Chicago Data API - findBizData()
// 2. Query Bing Search API (through azure) to get websites - findBizSites(bizNames)
// 2.25 Extract all URLs on websites to simulate depth=1 search
// 2.5 Write away ALL websites/links to .csv (needed for phantombuster) - writeFile(bizSites)
// 3. Launch GIANT phantombuster to scrape emails from all websites - go to phantombuster site, make a Data Scraping Crawler
// 4. Send 10,000 emails through PersistIQ (manually?) (TBD~)

const desiredFields = {
  legal_name: "",
  doing_business_as_name: "",
  zip_code: "",
  website: ""
};

// What is the _exact_ business type you want to search for? Must be a business type provided by api
const bizType = "Hair Services";

// endpoint for the chicago business data
const chicagoBizEndpointURL = `https://data.cityofchicago.org/resource/uupf-x98q.json?business_activity=${encodeURI(bizType)}&$limit=2000`;

// bing search api url
const bingSearchAPIURL = "https://api.cognitive.microsoft.com/bing/v7.0/search?q="

// options/query params for ing search (format is bingSearchAPIURL + BIZ_NAME + bingSearchAPIURLTail)
const bingSearchAPIURLTail = " -site:yelp.com -site:facebook.com -site:beautylaunchpad.com -site:es.wikipedia.org -site:groupon.com -site:yellowpages.com -site:mapquest.com&count=3&responseFilter=Webpages";

// Find names of all businesses in chicago
let findBizData = async () => {
  let bizData = await fetch(chicagoBizEndpointURL, {
        method: 'get',
    })
    .then(res => res.json())
    .catch(e => console.error(e));

  return bizData;
}

// Find websites of all chicago businesses
let findBizSites = async (bizData) => {
  let bizSites = [];

  // Search each site individually  
  for (let i = 0; i < bizData.length; i++) { 
    let bizSiteData = await fetch(bingSearchAPIURL + bizData[i].doing_business_as_name + bingSearchAPIURLTail, {
      method: 'get',
      headers: {
        "Ocp-Apim-Subscription-Key": azureAPIKEY
      }
    })
    .then(res => res.json())
    .catch(e => console.error(e));
    
    // Rate limit ourselves (may be unnecessary)
    // await sleep(20);
    console.log(`Found site from ${bizData[i].doing_business_as_name}! - ${bizSiteData.webPages.value[0].url}`);

    // add biz url to existing data payload for business
    bizData[i].website = bizSiteData.webPages.value[0].url;
  }
  
  return bizData;
};

// Write out biz websites to single-column csv (correct format for phantombuster)
let fileWrite = async (bizSitesArr) => {
    const csv = new ObjectsToCsv(bizSitesArr);
  
    // Save to file:
    await csv.toDisk(`./${fileName}.csv`);
};

// literally just a sleep method to stop from going too fast - https://i.kym-cdn.com/entries/icons/original/000/006/360/gottago.jpg
let sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// gets rid of all fields from obj except those in projection
function project(obj, projection) {
  let projectedObj = {}
  for(let key in projection) {
      projectedObj[key] = obj[key];
  }
  return projectedObj;
}

// Necessary to run await in main
let DOTHETHING = async () => {
  let bizData = await findBizData();
  console.log(bizData);
  let bizDataPlusSites = await findBizSites(bizData);
  fileWrite(bizDataPlusSites.map(bizDataBlob => project(bizDataBlob, desiredFields)));
}

// Zhu Li, Do the thing! https://preview.redd.it/51eee0ika7d21.png?auto=webp&s=aa0c9e09b163478e4eef5f2be8d1bafa3c05ac62
DOTHETHING();