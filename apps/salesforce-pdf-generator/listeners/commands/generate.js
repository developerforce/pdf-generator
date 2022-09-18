'use strict';

const { Md } = require('slack-block-builder'); // Emoji support
const config = require('../../config/config');
var jsforce = require('jsforce');

const generateCallback = async ({ command, ack, respond }) => {
    try {
        await ack();
        await respond(`${Md.emoji('cloud')}` + ' Querying Salesforce...');

        var conn = new jsforce.Connection({
            oauth2: {
                loginUrl: config.salesforce.loginUrl,
                clientId: config.salesforce.clientId,
                clientSecret: config.salesforce.clientSecret,
                redirectUri: `${config.salesforce.herokuUrl}/oauthcallback`
            }
        });

        await conn.login(
            process.env.SF_USERNAME,
            process.env.SF_PASSWORD,
            function (err, userInfo) {
                if (err) {
                    return console.error(err);
                }
            }
        );

        var records = [];
        var messageDestination = '';
        var firstRecord = false // We just use the first record so the flow doesn't trigger more than once

        if(command.channel_name === 'directmessage') {
            messageDestination = command.user_id;
        } else {
            messageDestination = command.channel_id;
        }

        await conn
            .query(
                "SELECT Id, Name, Contact__r.Name, OTE__c FROM Compensation__c WHERE Contact__r.Name LIKE '%" +
                    command.text +
                    "%'"
            )
            .on('record', function (record) {
                records.push(record);

                // Update the first record we find
                if (!firstRecord) {
                    conn.sobject('Compensation__c').update(
                        {
                            Id: record.Id,
                            has_PDF__c: 'Requested',
                            Message_Destination__c: messageDestination
                        },
                        function (err, ret) {
                            if (err || !ret.success) {
                                return console.error(err, ret);
                            }
                            console.log('Updated Successfully : ' + ret.id);
                        }
                    );
    
                    firstRecord = true;
                }
            })
            .on('error', function (err) {
                console.error(err);
            })
            .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

        if (records.length > 0) {
            // We just return the first Contact we find for now
            await respond(
                `${Md.emoji('tada')}` +
                    ' Record found: ' +
                    records[0].Contact__r.Name +
                    '\nPDF Requested'
            );
        } else {
            await respond(
                `${Md.emoji('x')}` + ' No Contact found with that name.'
            );
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { generateCallback };
