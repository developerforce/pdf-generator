public with sharing class PostToSlack {
    public class slackRequest { 
        @InvocableVariable(label='Slack Message' required=true) 
        public String slackMessage; 
        @InvocableVariable(label='Channel/User to post to' required=true) 
        public String channel; 
    }

    @InvocableMethod(label='Post to Slack')
    public static void publishToSlack(List<slackRequest> requests) {
        Slackbot_Token__mdt token = [
            SELECT Token__c, DeveloperName
            FROM Slackbot_Token__mdt
            WHERE DeveloperName = 'Request_Compensation_Bot'
            LIMIT 1
        ];

        for(slackRequest r:requests){
            String bearer = 'Bearer ' + token.Token__c;        
            String message = EncodingUtil.urlEncode(r.slackMessage, 'UTF-8');

            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://slack.com/api/chat.postMessage?channel=' + r.channel + '&text=' + message + '&pretty=1');
            req.setMethod('POST');
            req.setHeader('Authorization', bearer);
            Http http = new Http();
            HttpResponse res = http.send(req);
        } 
    }
}
