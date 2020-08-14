const ObjectsToCsv = require('objects-to-csv');
const {fileName} = require('./config');

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

module.exports = {
    fileWrite,
    sleep,
    project
};