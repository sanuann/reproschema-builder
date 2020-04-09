const schemaMap = {
    "Identifier?": "@id",
    "Variable / Field Name": "skos:altLabel",
    "Item Display Name": "skos:prefLabel",
    "Field Note": "schema:description",
    "Section Header": "preamble", // todo: check this
    "Field Label": "question",//description?
    "Field Type": "inputType",
    "Allow": "allow",
    "Required Field?": "requiredValue",
    "minVal": "schema:minValue",
    "maxVal": "schema:maxValue",
    "Choices, Calculations, OR Slider Labels": "choices",
    "Branching Logic (Show field only if...)": "visibility",
    "multipleChoice": "multipleChoice",
    "responseType": "@type"

};

const fs = require('fs');
const converter = require('json-2-csv');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './local_data/protocol_name.csv',
    header: [
        {id: 'var_name', title: 'Variable / Field Name'},
        {id: 'activity', title: 'Form Name'},
    ]
});
let csvData = [];
var files = fs.readdirSync('./protocols/protocol_name');
// console.log(23, files);
files.forEach(function (file) {
    let p;
    if (file.endsWith('_schema')) {
        parsedJSON = JSON.parse(fs.readFileSync('./protocols/protocol_name' + "/" + file, 'utf8'));

    }
});
const activityList = parsedJSON.ui.order;
csvData = [];
activityList.forEach(function (activity) {
    // console.log(43, activity);
    parsedJSONActivity = JSON.parse(fs.readFileSync(`./activities/${activity}/${activity}_schema`, 'utf8'));
    (parsedJSONActivity.ui.order).forEach(function (item) {
        csvData.push({
          var_name: item,
          activity: activity
        });
    });
});
// console.log(57, csvData);
csvWriter
.writeRecords(csvData)
.then(()=> console.log('The CSV file was written successfully'));


// converter.json2csvAsync(parsedJSONActivity.ui.order)
//     .then((csv) => {
//         console.log(57, csv);
//     })
//     .catch((err) => {
//         console.log(60, err);
//     });

// function getAllFiles(dirPath, arrayOfFiles) {
//   files = fs.readdirSync(dirPath);
//
//   arrayOfFiles = arrayOfFiles || [];
//
//   files.forEach(function(file) {
//     if (fs.statSync(dirPath + "/" + file).isDirectory()) {
//       arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
//     } else {
//       arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
//     }
//   })
//
//   return arrayOfFiles
// }
