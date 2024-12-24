@isTest
public class FeedItemModerationTriggerTest {

    @isTest
    static void testModerationTrigger() {

        // Step 1: Create Test FeedItem and Feed_Item__c records

        // Create a FeedItem record to trigger the moderation logic
        FeedItem feedItem1 = new FeedItem(
            Title = 'Test Feed Item 1', 
            Body = 'This is a test feed item'
        );

        // Set the ParentId to link the FeedItem to a relevant parent object (e.g., User feed)
        User testUser = [SELECT Id FROM User WHERE IsActive = TRUE LIMIT 1];
        feedItem1.ParentId = testUser.Id;  // Assign a ParentId (e.g., User feed)

        try {
            insert feedItem1;
        } catch (DmlException e) {
            System.debug('Error inserting FeedItem: ' + e.getMessage());
            System.assert(false, 'Failed to insert FeedItem: ' + e.getMessage());
        }

        // Step 2: Create a corresponding Feed_Item__c record
        Feed_Item__c feedItem2 = new Feed_Item__c(
            Feed_Item__c = feedItem1.Id,  // Link to the FeedItem record (ensure Feed_Item__c is the correct field name)
            Moderation_Status__c = 'Pending',  // Set Moderation Status
            Flagged__c = false  // Flagged status should be false initially
        );

        // Debug the values of feedItem2 to ensure they are correct before insert
        System.debug('Feed_Item__c Values: ' + feedItem2);

        try {
            insert feedItem2;  // Insert Feed_Item__c record
        } catch (DmlException e) {
            System.debug('Error inserting Feed_Item__c: ' + e.getMessage());
            System.assert(false, 'Failed to insert Feed_Item__c: ' + e.getMessage());
        }

        // Step 3: Simulate flagging the FeedItem (before insert or update)
        feedItem2.Flagged__c = true;  // Change Flagged on the Feed_Item__c (not FeedItem)
        try {
            update feedItem2;  // This will trigger the FeedItemModerationTrigger
        } catch (DmlException e) {
            System.debug('Error updating Feed_Item__c: ' + e.getMessage());
            System.assert(false, 'Failed to update Feed_Item__c: ' + e.getMessage());
        }

        // Step 4: Query the Feed_Item__c record to check the status update
        Feed_Item__c updatedFeedItem = [SELECT Id, Moderation_Status__c, Flagged_Time__c, Resolution_Time__c, Flag_Type__c 
                                        FROM Feed_Item__c 
                                        WHERE Feed_Item__c = :feedItem2.Id LIMIT 1];

        // Verify that the Feed_Item__c record has been updated correctly
        System.assertEquals('Flagged', updatedFeedItem.Moderation_Status__c, 'The moderation status should be Flagged');
        System.assertNotEquals(null, updatedFeedItem.Flagged_Time__c, 'The Flagged Time should be set when flagged');
        System.assertEquals('Spam', updatedFeedItem.Flag_Type__c, 'The flag type should be set to Spam');

        // Step 5: Unflag the FeedItem and resolve
        feedItem2.Flagged__c = false;  // Unflag the Feed_Item__c (not FeedItem)
        try {
            update feedItem2;  // This will trigger the FeedItemModerationTrigger again
        } catch (DmlException e) {
            System.debug('Error updating Feed_Item__c: ' + e.getMessage());
            System.assert(false, 'Failed to update Feed_Item__c: ' + e.getMessage());
        }

        // Query the Feed_Item__c record to check for resolution
        updatedFeedItem = [SELECT Id, Moderation_Status__c, Flagged_Time__c, Resolution_Time__c, Resolution_Duration_Seconds__c 
                           FROM Feed_Item__c 
                           WHERE Feed_Item__c = :feedItem2.Id LIMIT 1];

        // Verify that the Feed_Item__c record is updated to Resolved
        System.assertEquals('Resolved', updatedFeedItem.Moderation_Status__c, 'The moderation status should be Resolved');
        System.assertNotEquals(null, updatedFeedItem.Resolution_Time__c, 'The Resolution Time should be set when resolved');

        // Step 6: Verify the resolution duration (in seconds)
        Integer resolutionDuration = updatedFeedItem.Resolution_Duration_Seconds__c != null ? updatedFeedItem.Resolution_Duration_Seconds__c.intValue() : 0;  
        
        // Ensure resolution time is greater than 0
        System.assert(resolutionDuration > 0, 'The resolution duration should be greater than 0 seconds');
    }
}