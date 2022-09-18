# Pdfgenerator Function

Receives a payload containing a Contact Id and uses pdfkit, blob-stream to generate a PDf with the Compensation__c records related to the contact. It then commits the PDF attachment into the ContentDocumentLink object and returns the Record Id's for each updated Compensation__c record.

## Local Development

1. Install dependencies with

```
npm install
```

2. Run tests with

```
npm test
```

3. Start your function locally

```
sf run function start --verbose
```

4. Invoke your function locally, recordId value must be an existing Contact Id

```
sf run function --function-url=http://localhost:8080 --payload='{"recordId":"003P000001aIzAUIA0"}'
```
