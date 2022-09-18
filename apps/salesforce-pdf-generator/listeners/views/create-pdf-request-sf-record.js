'use strict';

const {
    generatePDFSuccess,
    generatePDFFailed,
    generatePDFNoRecords
} = require('../../user-interface/modals');
const { updateCompensation } = require('../../salesforce/dml/request-pdf');

const generatePDFCallback = async ({ ack, client, context, body }) => {
    await ack();
    if (context.hasAuthorized) {
        // Get the Slack User and Team Id so we know who to send the PDF to
        const userId = body['user']['id'];
        const teamId = body['user']['team_id'];

        // Get the Salesforce User so we know what data to get
        const identity = await context.sfconnection.identity();
        const currentuser = identity.user_id;

        const requestData = {
            currentuser,
            userId,
            teamId
        };

        try {
            // Insert PDF request
            const result = await updateCompensation(
                context.sfconnection,
                requestData
            );

            if (result.totalSize > 0) {
                // Trigger a Success Modal
                await client.views.open({
                    trigger_id: body.trigger_id,
                    view: generatePDFSuccess()
                });
            } else if (result.totalSize === 0) {
                // Trigger a No Records Modal
                await client.views.open({
                    trigger_id: body.trigger_id,
                    view: generatePDFNoRecords()
                });
            } else {
                // Trigger a failure message Modal
                await client.views.open({
                    trigger_id: body.trigger_id,
                    view: generatePDFFailed()
                });
            }
        } catch (e) {
            throw e;
        }
    } else {
        // Get BotInfo
        const botInfo = await client.bots.info({ bot: context.botId });
        // Open a Modal with message to navigate to App Home for authorization
        await client.views.open({
            trigger_id: shortcut.trigger_id,
            view: authorizeSalesforcePrompt(context.teamId, botInfo.bot.app_id)
        });
    }
};

module.exports = { generatePDFCallback };
