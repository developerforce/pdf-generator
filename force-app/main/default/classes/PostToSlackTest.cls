@isTest
private with sharing class PostToSlackTest {
    @isTest
    static void testPublishToSlack() {
        Test.setMock(HttpCalloutMock.class, new mockCallout());
        
        List<PostToSlack.slackRequest> requests = new List<PostToSlack.slackRequest>();
        PostToSlack.slackRequest r = new PostToSlack.slackRequest();
        r.slackMessage='THIS IS A TEST MESSAGE';
        r.channel='#general';
        requests.add(r);

        Test.startTest();
        PostToSlack.publishToSlack(requests);
        Test.stopTest();
    }
    
    public class mockCallout implements HttpCalloutMock
    {
        public HttpResponse respond(HttpRequest request)
        {
            HttpResponse res = new HttpResponse();
            res.setBody( '{"text":"value"}');
            res.setStatusCode(200);
            return res;
        }   
    }
}