'use strict';

const { generatePDFCallback } = require('./generatepdf');

module.exports.register = (app) => {
    app.shortcut('generate_pdf', generatePDFCallback);
};
