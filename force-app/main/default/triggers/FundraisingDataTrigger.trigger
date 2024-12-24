trigger FundraisingDataTrigger on Fundraising_Data__c (after insert) {
    List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

    for (Fundraising_Data__c record : Trigger.new) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[] { 'fundraisingteam@nonprofit.org' });
        email.setSubject('New Fundraising Insights Available');
        email.setPlainTextBody('New insights have been updated for campaign: ' + record.Campaign_ID__c);
        emails.add(email);
    }

    Messaging.sendEmail(emails);
}