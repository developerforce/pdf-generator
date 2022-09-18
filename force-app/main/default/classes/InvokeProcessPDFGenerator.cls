public with sharing class InvokeProcessPDFGenerator {
    @InvocableMethod(label='PDF Generator')
    public static List<DocumentResponse> pdfGenerator(List<InputWrapper> input) {
        String payload = '{"recordId": "'+ input.get(0).recordId + '"}';
        // Get a Reference of the pdfgenerator Function
        functions.Function fn = functions.Function.get('pdfgenerator.pdfgenerator');
        // Invoke the pdfgenerator Function
        functions.FunctionInvocation invocation = fn.invoke(payload);

        // Check if there is any error during the invocation
        if (invocation.getStatus() == functions.FunctionInvocationStatus.ERROR) {
            throw new CalloutException(
            (invocation.getError() != null
                ? invocation.getError().getMessage()
                : 'UNKNOWN')
            );
        }

        String response = invocation.getResponse();
        // Serialize the Response into a List of DocumentResponse object
        List<DocumentResponse> output = (List<DocumentResponse>) JSON.deserialize(response, List<DocumentResponse>.class);
        output.get(0).salesforceBaseUrl = URL.getSalesforceBaseUrl().toExternalForm();
        return output;
    }
    
    public class InputWrapper {
        @invocablevariable
        public String recordId;
    }
    
    public class DocumentResponse {
        @InvocableVariable
        public String contentVersionId;
        @InvocableVariable
        public String contentDocumentId;
        @InvocableVariable
        public String contentDocumentLinkId;
        @InvocableVariable
        public String salesforceBaseUrl;
    }
}