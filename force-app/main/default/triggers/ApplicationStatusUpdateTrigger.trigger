trigger ApplicationStatusUpdateTrigger on Student_Application__c (after update) {
    List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();

    // Loop through the updated applications
    for (Student_Application__c app : Trigger.new) {
        // Check if the status has been updated and if it's different from the old value
        if (app.Status__c != Trigger.oldMap.get(app.Id).Status__c) {
            // Prepare an email notification for the student
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(new String[] { app.Email__c });
            mail.setSubject('Application Status Update');
            if (app.Status__c == 'Accepted') {
                mail.setPlainTextBody('Congratulations! Your application to the ' + app.Department__c + ' department has been accepted. We look forward to your enrollment.');
            } else if (app.Status__c == 'Rejected') {
                mail.setPlainTextBody('We regret to inform you that your application to the ' + app.Department__c + ' department has been rejected. We encourage you to apply again next year.');
            }
            emailsToSend.add(mail);
        }
    }

    // Send the emails
    if (!emailsToSend.isEmpty()) {
        Messaging.sendEmail(emailsToSend);
    }
}