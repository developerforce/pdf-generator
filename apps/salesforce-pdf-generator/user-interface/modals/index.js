'use strict';

const { generatePDFForm } = require('./generate-pdf-form');
const { generatePDFSuccess } = require('./generate-pdf-success');
const { generatePDFFailed } = require('./generate-pdf-failed');
const { generatePDFNoRecords } = require('./generate-pdf-no-records');
const { authorizeSalesforcePrompt } = require('./authorize-sf-prompt');

module.exports = { 
    authorizeSalesforcePrompt,
    generatePDFForm,
    generatePDFFailed,
    generatePDFSuccess,
    generatePDFNoRecords
};
