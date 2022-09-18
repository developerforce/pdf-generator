'use strict';

const {
    openGeneratePDFModal
} = require('../utils/generate-pdf')

const generatePDFCallback = async ({ shortcut, ack, client, context }) => {
    try {
        await ack();
        await openGeneratePDFModal(
            shortcut.trigger_id,
            client,
            context
        );
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { generatePDFCallback };
