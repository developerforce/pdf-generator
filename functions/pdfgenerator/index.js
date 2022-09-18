/**
 * Describe Pdfgenerator here.
 *
 * The exported method is the entry point for your code when the function is invoked.
 *
 * Following parameters are pre-configured and provided to your function on execution:
 * @param event: represents the data associated with the occurrence of an event, and
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */

import fs from "fs";
import { PDFDocument } from "pdf-lib";

// Data values for PDF content
const documentData = {
  title: "compensation",
  companyName: "My Company Inc",
};

export default async function (event, context, logger) {
  logger.info(
    `Invoking Pdfgenerator with payload ${JSON.stringify(event.data || {})}`
  );

  // Payload recordId param
  const { recordId } = event.data;

  // Validate the payload params
  if (!recordId) {
    throw new Error(`Please provide a record Id to attach the PDF`);
  }

  const pdfDoc = await PDFDocument.load(
    fs.readFileSync("./assets/compensation_template.pdf")
  );

  const form = pdfDoc.getForm();

  // Get the User record data
  const { records: users } = await context.org.dataApi.query(
    `SELECT Id, FirstName, Name, CompanyName, Street, Email, Phone, MobilePhone FROM User WHERE Id ='${recordId}'`
  );
  const user = users[0].fields;

  // Get the Compensation__c records having the userId
  const { records: compensations } = await context.org.dataApi.query(
    `SELECT Id, Name, FORMAT(Base_Salary__c), FORMAT(Bonus__c), FORMAT(OTE__c) FROM Compensation__c WHERE User__c ='${recordId}'`
  );
  const compensation = compensations[0].fields;

  // Get the Slack_Request__c record
  const { records: requests } = await context.org.dataApi.query(
    `SELECT Id, has_PDF__c FROM Slack_Request__c WHERE User__c ='${recordId}'`
  );
  const request = requests[0].fields;

  // Get form text fields
  // These fields have to have the same name as in the compensation template
  const nameField = form.getTextField("name");
  const addressField = form.getTextField("address");
  const phoneField = form.getTextField("phone");
  const mobileField = form.getTextField("mobile");
  const emailField = form.getTextField("email");
  const dateField = form.getTextField("date");
  const firstnameField = form.getTextField("firstname");
  const compensationField = form.getTextField("compensation");
  const basesalaryField = form.getTextField("basesalary");
  const bonusField = form.getTextField("bonus");
  const oteField = form.getTextField("ote");

  let today = new Date().toLocaleDateString("en-GB");

  // Set form text fields
  nameField.setText(user.Name || "");
  addressField.setText(user.Street || "");
  phoneField.setText(user.Phone || "");
  mobileField.setText(user.MobilePhone || "");
  emailField.setText(user.Email || "");
  dateField.setText(today);
  firstnameField.setText(user.FirstName || "");
  compensationField.setText(compensation.Name || "");
  basesalaryField.setText(compensation.Base_Salary__c || "");
  bonusField.setText(compensation.Bonus__c || "");
  oteField.setText(compensation.OTE__c || "");

  // Set fields as readonly
  nameField.enableReadOnly();
  addressField.enableReadOnly();
  phoneField.enableReadOnly();
  mobileField.enableReadOnly();
  emailField.enableReadOnly();
  dateField.enableReadOnly();
  firstnameField.enableReadOnly();
  compensationField.enableReadOnly();
  basesalaryField.enableReadOnly();
  bonusField.enableReadOnly();
  oteField.enableReadOnly();

  // Save PDF as Base64 so we can upload it to Salesforce
  const pdfBytes = await pdfDoc.saveAsBase64();

  try {
    // Set a new ContentVersion for Creation
    const contentVersion = {
      type: "ContentVersion",
      fields: {
        VersionData: pdfBytes,
        Title: `${documentData.title}-${Date.now()}`,
        origin: "H",
        PathOnClient: `${documentData.title}.pdf`,
      },
    };

    // Insert ContentVersion record and return the Id
    const { id: contentVersionId } = await context.org.dataApi.create(
      contentVersion
    );

    // Query ContentVersion record results with the field ContentDocumentId
    const { records: contentVersions } = await context.org.dataApi.query(
      `SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id ='${contentVersionId}'`
    );

    const contentDocumentId = contentVersions[0].fields.contentdocumentid;

    // Set a new ContentDocumentLink for Creation
    const contentDocumentLink = {
      type: "ContentDocumentLink",
      fields: {
        ContentDocumentId: contentDocumentId,
        LinkedEntityId: recordId,
        ShareType: "V",
        Visibility: "AllUsers",
      },
    };

    // Insert ContentDocumentLink record to attach the PDF document into the user record
    const { id: contentDocumentLinkId } = await context.org.dataApi.create(
      contentDocumentLink
    );

    const results = await Promise.all(
      requests.map(async (request) => {
        return await context.org.dataApi.update({
          type: request.type,
          fields: {
            Id: request.fields.id,
            has_PDF__c: "Yes",
          },
        });
      })
    );

    // Return the updated Compensation records
    return [
      {
        contentVersionId: contentVersionId,
        contentDocumentId: contentDocumentId,
        contentDocumentLinkId: contentDocumentLinkId,
      },
    ];
  } catch (err) {
    // Catch any DML errors and pass the throw an error with the message
    const errorMessage = `Failed to insert record. Root Cause : ${err.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
