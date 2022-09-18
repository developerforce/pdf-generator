'use strict';

const updateCompensation = async (connection, requestData) => {
    try {
        var records = [];
        
        // We just need one compensation record to create a request
        const result = await connection
            .query(
                `SELECT Id, User__r.Id FROM Compensation__c WHERE User__r.Id = \'${requestData.currentuser}\' LIMIT 1`
            )
            .on('record', function (record) {
                records.push(record);
                connection.sobject('Slack_Request__c').create(
                    {
                        has_PDF__c: 'Requested',
                        Slack_User_Id__c: requestData.userId,
                        Slack_Team_Id__c: requestData.teamId,
                        User__c: requestData.currentuser
                    },
                    function (err, ret) {
                        if (err || !ret.success) {
                            return console.error(err, ret);
                        }
                        console.log('PDF requested successfully: ' + ret.id);
                    }
                );
            })
            .run({ autoFetch: true, maxFetch: 4000 });

        return result;
    } catch (e) {
        throw 'Failed to create the request record in Salesforce ' + e.message;
    }
};

module.exports = {
    updateCompensation
};
