'use strict';

const {
    generatePDFCallback
} = require('./create-pdf-request-sf-record');

module.exports.register = (app) => {
    app.view('initiate_pdf_request', generatePDFCallback);
};
