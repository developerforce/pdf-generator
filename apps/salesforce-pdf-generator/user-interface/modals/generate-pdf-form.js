'use strict';
const { Modal, Blocks } = require('slack-block-builder');

const generatePDFForm = () => {
    return Modal({ title: 'Get Compensation', submit: 'Submit' })
        .blocks(
            Blocks.Section({
                text: `Please confirm your compensation document request`
            })
        )
        .callbackId('initiate_pdf_request')
        .buildToJSON();
};

module.exports = { generatePDFForm };
