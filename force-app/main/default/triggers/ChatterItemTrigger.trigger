trigger ChatterItemTrigger on FeedItem (after insert) {
    ChatterHelper.createComments(Trigger.new);
}