'use strict';

const {
    authorizeSalesforcePrompt,
    generatePDFForm
} = require('../../user-interface/modals');

const openGeneratePDFModal = async (triggerId, client, context) => {
    if (context.hasAuthorized) {
        await client.views.open({
            trigger_id: triggerId,
            view: generatePDFForm()
        });
    } else {
        // Get BotInfo
        const botInfo = await client.bots.info({ bot: context.botId });
        // Open a Modal with message to navigate to App Home for authorization
        await client.views.open({
            trigger_id: triggerId,
            view: authorizeSalesforcePrompt(context.teamId, botInfo.bot.app_id)
        });
    }
};

module.exports = { openGeneratePDFModal };
