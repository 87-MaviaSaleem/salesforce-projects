@isTest
public class NotificationServiceTest {
    @isTest
    static void testCreateNotification() {
        User volunteer = [SELECT Id FROM User LIMIT 1];
        Test.startTest();
        NotificationServiceSecond.createNotification(volunteer.Id, 'New event upcoming!');
        Test.stopTest();

        List<Notification__c> notifications = [SELECT Id, Message__c FROM Notification__c];
        System.assertEquals(1, notifications.size());
        System.assertEquals('New event upcoming!', notifications[0].Message__c);
    }

    @isTest
    static void testSendNotifications() {
        User volunteer = [SELECT Id FROM User LIMIT 1];
        NotificationServiceSecond.createNotification(volunteer.Id, 'Test notification');
        
        Test.startTest();
        NotificationServiceSecond.sendNotifications();
        Test.stopTest();

        List<Notification__c> notifications = [SELECT Id, Sent__c FROM Notification__c];
        System.assertEquals(true, notifications[0].Sent__c);
    }
}