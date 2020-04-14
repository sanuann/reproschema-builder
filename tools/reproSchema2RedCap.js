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
        {id: 'section', title: 'Section Header'},
        {id: 'field_type', title: 'Field Type'},
        {id: 'field_label', title: 'Field Label'},
        {id: 'choices', title: 'Choices, Calculations, OR Slider Labels'},
        {id: 'field_notes', title: 'Field Note'},
        {id: 'val_type_OR_slider', title: 'Text Validation Type OR Show Slider Number'},
        {id: 'val_min', title: 'Text Validation Min'},
        {id: 'val_max', title: 'Text Validation Max'},
        {id: 'identifier', title: 'Form Name'},
        {id: 'visibility', title: 'Branching Logic (Show field only if...)'},
        {id: 'required', title: 'Required Field?'},

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
        itemJSON = JSON.parse(fs.readFileSync(`./activities/${activity}/items/${item}`, 'utf8'));
        let rowData = {};
        if (parsedJSONActivity.scoringLogic && parsedJSONActivity.scoringLogic[itemJSON['@id']]) { // refactor acc to new schema
            rowData.choices = parsedJSONActivity.scoringLogic[itemJSON['@id']];
        }
        rowData = find_Ftype_and_colH(itemJSON, rowData);

        // get column I, J entries
        // get_colI_colJ_entries(itemJSON, rowData);
        if (itemJSON.responseOptions["schema:minValue"]) {
            rowData.val_min = itemJSON.responseOptions["schema:minValue"];
        }
        if (itemJSON.responseOptions["schema:maxValue"]) {
            rowData.val_max = itemJSON.responseOptions["schema:maxValue"];
        }

        if (itemJSON.responseOptions.choices) {
            let itemChoices = '';
            (itemJSON.responseOptions.choices).forEach(function (ch) {
                // console.log(62, itemJSON['@id'], ch['schema:value'], ch['schema:name']);
                if (itemChoices) {
                    itemChoices = itemChoices.concat(' | ', ch['schema:value'], ', ', ch['schema:name']);
                    // console.log(66, itemChoices);
                }
                else itemChoices = itemChoices.concat(ch['schema:value'], ', ', ch['schema:name']);
            });
            // console.log(69, itemChoices);
            rowData.choices = itemChoices;
        }

        if (itemJSON.responseOptions.requiredValue) {
            rowData.required = itemJSON.responseOptions.requiredValue;
        }

         if (itemJSON['skos:altLabel']) {
            rowData.field_notes = itemJSON['skos:altLabel'];
        }

        rowData.var_name = itemJSON['@id'];
        rowData.activity = activity;
        rowData.field_label = itemJSON.question.en; // for now returns only the english
        csvData.push(rowData);
        // csvData.push({
        //     var_name: itemJSON['@id'],
        //     activity: activity,
        //     field_type: f_type,
        //     field_label: itemJSON.question.en, // for now returns only the english
        //     required: itemJSON.responseOptions.requiredValue,
        //     choices: itemChoices,
        //     field_notes: itemJSON['skos:altLabel'], // need to check with satra, should also use language tag
        //     val_type_OR_slider: col_h,
        //     val_min: minVal,
        //     val_max: fgg
        // });
    });
});

function find_Ftype_and_colH(itemJSON, rowData) {
    let f_type = itemJSON.ui.inputType;
    let col_h = '';
    if (itemJSON.ui.inputType === 'integer') {
            f_type = 'text';
            col_h = 'number';

    } else if (itemJSON.ui.inputType === 'select') {
        f_type = 'dropdown'; // what about if any thing in col H?
    } else if (itemJSON.ui.inputType === 'date') {
        f_type = 'text';
        col_h = 'ddate_mdy';

    }
    rowData.field_type = f_type;
    if (col_h) {
        // console.log(119, itemJSON['@id'], col_h);
        rowData.val_type_OR_slider = col_h;
    }
    return rowData;
}


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

