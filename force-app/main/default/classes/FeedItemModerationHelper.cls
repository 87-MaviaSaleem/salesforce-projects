public class FeedItemModerationHelper {

    // Method to handle the moderation status logic
    public static void handleModerationStatus(List<Feed_Item__c> feedItemsToUpdate, Map<Id, FeedItem> triggerNewMap) {
        for (Feed_Item__c feedItem : feedItemsToUpdate) {
            FeedItem matchingFeedItem = triggerNewMap.get(feedItem.Feed_Item__c);

            if (matchingFeedItem != null) {
                // If the FeedItem is flagged and has a "Pending" moderation status, update Feed_Item__c
                if (feedItem.Flagged__c == true && feedItem.Moderation_Status__c == 'Pending' && feedItem.Flagged_Time__c == null) {
                    feedItem.Moderation_Status__c = 'Flagged';  // Set moderation status to "Flagged"
                    feedItem.Flagged_Time__c = System.now();    // Capture the flagged time
                    feedItem.Flag_Type__c = 'Spam';             // Optionally, set flag type (can be dynamic)
                }
                
                // If the FeedItem is no longer flagged and was previously flagged, update Feed_Item__c to "Resolved"
                if (feedItem.Flagged__c == false && feedItem.Moderation_Status__c == 'Flagged') {
                    feedItem.Moderation_Status__c = 'Resolved';  // Set status to "Resolved"
                    feedItem.Resolution_Time__c = System.now();  // Capture the resolution time as DateTime
                    
                    // Calculate the time taken for resolution (in seconds)
                    if (feedItem.Flagged_Time__c != null) {
                        Long resolutionTimeInMillis = feedItem.Resolution_Time__c.getTime() - feedItem.Flagged_Time__c.getTime();
                        Long resolutionTimeInSeconds = resolutionTimeInMillis / 1000; // Store resolution time in seconds
                        feedItem.Resolution_Duration_Seconds__c = resolutionTimeInSeconds;  // Store time difference in seconds (Number field)
                    }
                }
            }
        }
    }
    
    // Method to fetch Feed_Item__c records based on FeedItem IDs
    public static List<Feed_Item__c> getFeedItemsToUpdate(Set<Id> feedItemIds) {
        return [SELECT Id, Feed_Item__c, Moderation_Status__c, Flagged_Time__c, Flag_Type__c, Flagged__c, Resolution_Time__c, Resolution_Duration_Seconds__c
                FROM Feed_Item__c
                WHERE Feed_Item__c IN :feedItemIds];
    }
}