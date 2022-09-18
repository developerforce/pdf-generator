'use strict';
const { Modal, Blocks } = require('slack-block-builder');

const generatePDFFailed = () => {
    return Modal({ title: 'Get Compensation', close: 'Close' })
        .blocks(
            Blocks.Section({
                text: `Whoops! The document request failed.`
            })
        )
        .buildToJSON();
};

module.exports = { generatePDFFailed };
