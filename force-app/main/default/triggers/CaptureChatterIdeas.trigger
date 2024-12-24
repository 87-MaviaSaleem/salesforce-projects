trigger CaptureChatterIdeas on FeedItem (after insert) {
    List<FeedItem> feedItems = new List<FeedItem>();

    for (FeedItem feedItem : Trigger.new) {
        if (feedItem.ParentId.getSObjectType() == User.SObjectType) {
            feedItems.add(feedItem);
        }
    }

    if (!feedItems.isEmpty()) {
        ChatterIdeaHandler.captureIdeas(feedItems);
    }
}