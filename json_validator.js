
var http = require('http');
var Ajv = require('ajv');
var normalise = require('ajv-error-messages');
var express = require('express');

var app =express();
var ajv = new Ajv({schemaId:'id'});
//Added draft-04 to MetaSchema as ajv 6 does not support it initially.
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

var jsonFile = require('./datamodel.json');
var jsonSchema = require('./datamodelSchema.json');


/*
Simple JSON and Schema files for testing
var jsonFile = require('./basicmodel.json');
var jsonSchema = require('./basicmodelSchema.json');
*/

/**
 * Function to validate a JSON Schema
 * with a JSON File.
 * "return {string} 
 */
function validateData() 
{
    var validate = ajv.compile(jsonSchema);
    var valid = validate(jsonFile);

    if (!valid) 
    {
        var ajvErrors = validate.errors;
        //Normalise ajv errors to a simpler format.
        var normalisedErrors = normalise(ajvErrors);
    }
    //return true or validation errors.
    return valid || normalisedErrors;
}
//Print out result to console
console.log(JSON.stringify(validateData()));

/**
 * REST call which calls the validateData
 * function and prints out the result
 */
app.get('/datamodel/check', function(req,res) {
    let errors = JSON.stringify(validateData());
    
    if(errors != "true" )
    {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write('Invalid JSON File <br>');
        res.write('The below errors have been found: <br>' + errors);
        res.end();
    }
    else
    {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write('JSON file has past validation.');
        res.end();
    }
    
});
//Server initialization on port 3030
var server = app.listen(3030);

