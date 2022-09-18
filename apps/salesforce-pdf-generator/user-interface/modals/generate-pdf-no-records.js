'use strict';
const { Modal, Blocks } = require('slack-block-builder');

const generatePDFNoRecords = () => {
    return Modal({ title: 'Get Compensation', close: 'Close' })
        .blocks(
            Blocks.Section({
                text: `The requested User doesn't have any compensation data in Salesforce.`
            })
        )
        .buildToJSON();
};

module.exports = { generatePDFNoRecords };
