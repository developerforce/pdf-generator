'use strict';
const { Modal, Blocks, Md } = require('slack-block-builder');

const generatePDFSuccess = () => {
    return Modal({ title: 'Get Compensation', close: 'Close' })
        .blocks(
            Blocks.Section({
                text: `Compensation document successfully requested ${Md.emoji(
                    'tada'
                )}!!!`
            })
        )
        .buildToJSON();
};

module.exports = { generatePDFSuccess };
