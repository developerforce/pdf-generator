@isTest
private class InvokeProcessPDFGeneratorTest {
    @isTest
    static void returnsResponseOnSuccessfulInvocation() {
        // GIVEN
        FunctionsInvokeMockInner mock = new FunctionsInvokeMockInner();
        Test.setMock(functions.FunctionInvokeMock.class, mock);
        List<InvokeProcessPDFGenerator.InputWrapper> input = new List<InvokeProcessPDFGenerator.InputWrapper>();
        InvokeProcessPDFGenerator.InputWrapper inp = new InvokeProcessPDFGenerator.InputWrapper();
        inp.recordId = '000000000000000';
        input.add(inp);
    
        // WHEN
        Test.startTest();
        List<InvokeProcessPDFGenerator.DocumentResponse> response = InvokeProcessPDFGenerator.pdfGenerator(input);
        Test.stopTest();

        // THEN
        System.assertEquals(mock.response, response);
    }

    @isTest
    static void throwsExceptionOnErrorInvocation() {
        // GIVEN
        FunctionsInvokeMockInner mock = new FunctionsInvokeMockInner();
        mock.throwError = true;
        Test.setMock(functions.FunctionInvokeMock.class, mock);

        // WHEN
        try {
            List<InvokeProcessPDFGenerator.InputWrapper> input = new List<InvokeProcessPDFGenerator.InputWrapper>();
            InvokeProcessPDFGenerator.InputWrapper inp = new InvokeProcessPDFGenerator.InputWrapper();
            inp.recordId = '000000000000000';
            input.add(inp);
            
            Test.startTest();
            InvokeProcessPDFGenerator.pdfGenerator(input);
            Test.stopTest();
            System.assert(false, 'UNKNOWN');
        } catch (Exception e) {
            // THEN
            System.assert(e instanceof CalloutException, 'Expected CalloutException');
            System.assertEquals(mock.error, e.getMessage());
        }
    }

    public class FunctionsInvokeMockInner implements functions.FunctionInvokeMock {
        public List<InvokeProcessPDFGenerator.DocumentResponse> response = new List<InvokeProcessPDFGenerator.DocumentResponse>();
        public String error = 'UNKNOWN';
        public Boolean throwError = false;
        private String invocationId = '000000000000000';

        public functions.FunctionInvocation respond(
            String functionName,
            String payload
        ) {
            if (throwError) {
                return functions.MockFunctionInvocationFactory.createErrorResponse(
                    invocationId,
                    functions.FunctionErrorType.FUNCTION_EXCEPTION,
                    error
                );
            }

            InvokeProcessPDFGenerator.DocumentResponse r = new InvokeProcessPDFGenerator.DocumentResponse();
            r.contentVersionId = 'contentVersionId'; 
            r.contentDocumentId = 'contentDocumentId';
            r.contentDocumentLinkId = 'contentDocumentLinkId';
            r.salesforceBaseUrl = URL.getSalesforceBaseUrl().toExternalForm();
            response.add(r);

            String output = System.JSON.serialize(response);

            return functions.MockFunctionInvocationFactory.createSuccessResponse(
                invocationId,
                output
            );
        }
    }
}