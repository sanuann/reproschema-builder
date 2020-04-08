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
var files = fs.readdirSync('./protocols/protocol_name');
console.log(23, files);
files.forEach(function (file) {
    if (file.endsWith('_schema')) {
        fs.readFile('./protocols/protocol_name' + "/" + file, 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            parsedJSON = JSON.parse(jsonString);
            const activityList = parsedJSON.ui.order;
            // console.log('File data:', parsedJSON.ui.order);
            activityList.forEach(function (activity) {
                fs.readFile(`./activities/${activity}/${activity}_schema`, 'utf8', (err, jsonStr) => {
                    if (err) {
                        console.log("Activity schema File read failed:", err);
                        return
                    }
                    parsedJSONActivity = JSON.parse(jsonStr);
                    console.log(40, activity, '--------', parsedJSONActivity.ui.order);
                });

            })
        });

    }

});

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })

  return arrayOfFiles
}
