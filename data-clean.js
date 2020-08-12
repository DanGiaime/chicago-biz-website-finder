const fs = require('fs')
var parse = require('csv-parse')

let inputPath = './Source-Of-Truth.csv';

let wrapper = async () => {
    fs.readFile(inputPath, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, rows) {
            if(err) console.error(err);
            console.log(`Start data size: ${rows.length}`);
            let match;
            for(let i = 0; i < rows.length; i++) {
                match = rows[i].toString().search(/chicagonow|yimg|twitter|vimeo|instagram|youtube|facebook|fonts|google|amazon|ebay|yahoo|yelp|\.(js|jpg|jpeg|jpe|jif|jfif|jfi|css|gif|png|jp2|j2k|jpf|jpx|jpm|mj2|svg|svgz|pdf|bmp|dib|amp)/g)
                if(match != -1) {
                    rows.splice(i, 1);
                    i--;
                }
            }
            console.log(`End data size: ${rows.length}`);
            writeFile(rows);
        })
    })
};

let writeFile = outputData => {
    let outputDataStr = outputData.join('\n');
    fs.writeFile("clean-clear-under-control.csv", outputDataStr, (err) => { 
        if (err) 
            console.log(err); 
        else { 
            console.log("File written successfully\n"); 
        } 
    }); 
};

wrapper();