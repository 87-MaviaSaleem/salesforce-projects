public class NotificationServiceSecond {
    // Method to create and send notifications
    public static void createNotification(Id volunteerId, String message) {
        // Create a new Notification record
        Notification__c notification = new Notification__c(
            Volunteer_ID__c = volunteerId,
            Message__c = message,
            Sent__c = false
        );

        // Insert the notification
        insert notification;
    }

    // Method to send notifications
    public static void sendNotifications() {
        // Query for unsent notifications
        List<Notification__c> notifications = [SELECT Id, Volunteer_ID__c, Message__c FROM Notification__c WHERE Sent__c = false];
        
        for (Notification__c notification : notifications) {
            // Logic to send notification (e.g., email, in-app notifications)
            // For demonstration, we will simply mark it as sent
            notification.Sent__c = true;
        }

        // Update notifications to mark them as sent
        update notifications;
    }
}