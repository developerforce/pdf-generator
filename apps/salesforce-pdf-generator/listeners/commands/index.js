'use strict';

const { generateCallback } = require('./generate');

module.exports.register = (app) => {
    app.command('/generate', generateCallback);
};