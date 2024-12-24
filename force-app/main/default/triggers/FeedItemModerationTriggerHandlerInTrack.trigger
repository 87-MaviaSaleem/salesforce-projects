trigger FeedItemModerationTriggerHandlerInTrack on FeedItem (before insert, before update) {
    // Create a set to hold FeedItem IDs
    Set<Id> feedItemIds = new Set<Id>();
    
    // Collect the FeedItem IDs from the Trigger.new records
    for (FeedItem feed : Trigger.new) {
        feedItemIds.add(feed.Id);
    }
    
    // Fetch related Feed_Item__c records using the helper class
    List<Feed_Item__c> feedItemsToUpdate = FeedItemModerationHelper.getFeedItemsToUpdate(feedItemIds);
    
    // Call the helper method to handle moderation status and time tracking
    FeedItemModerationHelper.handleModerationStatus(feedItemsToUpdate, Trigger.newMap);
    
    // After updating the Feed_Item__c records, perform the update DML operation
    if (!feedItemsToUpdate.isEmpty()) {
        update feedItemsToUpdate;
    }
}