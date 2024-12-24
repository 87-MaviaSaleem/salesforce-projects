public class LoyaltyProgramHelper2 {

    // Invocable method to send reward notification email
    @InvocableMethod(label='Send Reward Notification' description='Sends an email to customer when they are eligible for a reward')
    public static void sendRewardNotification(List<Id> customerIds) {
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

        for (Id customerId : customerIds) {
            // Query the customer's email address
            Contact customerContact = [SELECT Email FROM Contact WHERE Id = :customerId LIMIT 1];

            // Prepare the email message
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] {customerContact.Email});
            email.setSubject('Congratulations! You’ve Earned a Reward');
            email.setPlainTextBody('Dear Customer,\n\nCongratulations! You’ve earned enough loyalty points and are now eligible for a reward. Thank you for your continued support!\n\nBest regards,\nYour Retail Team');

            // Add the email to the list
            emails.add(email);
        }

        // Send the emails
        Messaging.sendEmail(emails);
    }
}