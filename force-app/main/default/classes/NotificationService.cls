public class NotificationService {

    public static void notifyCustomer(Id customerId, String orderNumber) {
        // Implement notification logic here
        System.debug('Notifying customer: ' + customerId + ' about Order: ' + orderNumber);

        // Fetch the primary contact associated with the account to get the email
        List<Contact> contacts = [SELECT Email FROM Contact WHERE AccountId = :customerId LIMIT 1];

        if (contacts.isEmpty()) {
            throw new NotificationServiceException('No associated contact found for account: ' + customerId);
        }

        // Create the email notification
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { contacts[0].Email });
        mail.setSubject('Order Confirmation: ' + orderNumber);
        mail.setPlainTextBody('Thank you for your order! Your order number is ' + orderNumber);
        
        // Send the email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }

    // Custom Exception for Notification errors
    public class NotificationServiceException extends Exception {}
}