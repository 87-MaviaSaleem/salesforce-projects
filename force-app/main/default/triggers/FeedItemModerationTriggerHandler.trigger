trigger FeedItemModerationTriggerHandler on FeedItem (before insert, before update) {
    // Create a set to hold FeedItem IDs
    Set<Id> feedItemIds = new Set<Id>();
    
    // Collect the FeedItem IDs from the Trigger.new records
    for (FeedItem feed : Trigger.new) {
        feedItemIds.add(feed.Id);
    }
    
    // Query related Feed_Item__c records using FeedItem__c as a lookup
    List<Feed_Item__c> feedItemsToUpdate = [SELECT Id, Feed_Item__c, Moderation_Status__c, Flagged_Time__c, Resolved_Time__c, Flag_Type__c, Flagged__c
                                             FROM Feed_Item__c
                                             WHERE Feed_Item__c IN :feedItemIds];
    
    // Loop through the custom Feed_Item__c records and apply the logic
    for (Feed_Item__c feedItem : feedItemsToUpdate) {
        // Get the corresponding FeedItem record from Trigger.newMap
        FeedItem matchingFeedItem = Trigger.newMap.get(feedItem.Feed_Item__c);

        if (matchingFeedItem != null) {
            // If the FeedItem is flagged and has a "Pending" moderation status, update Feed_Item__c
            // Note: We're now checking the custom field `Flagged__c` on `Feed_Item__c`
            if (feedItem.Flagged__c == true && feedItem.Moderation_Status__c == 'Pending' && feedItem.Flagged_Time__c == null) {
                feedItem.Moderation_Status__c = 'Flagged';  // Set moderation status to "Flagged"
                feedItem.Flagged_Time__c = System.now();    // Capture the flagged time
                feedItem.Flag_Type__c = 'Spam';             // Optionally, set flag type (can be dynamic)
            }
            
            // If the FeedItem is no longer flagged and was previously flagged, update Feed_Item__c to "Resolved"
            if (feedItem.Flagged__c == false && feedItem.Moderation_Status__c == 'Flagged') {
                feedItem.Moderation_Status__c = 'Resolved';  // Set status to "Resolved"
                feedItem.Resolved_Time__c = System.now();     // Capture the resolution time
            }
        }
    }
    
    // After updating the Feed_Item__c records, perform the update DML operation
    if (!feedItemsToUpdate.isEmpty()) {
        update feedItemsToUpdate;
    }
}