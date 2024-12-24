trigger OpportunityChatterTrigger on Opportunity (after update) {
    List<FeedItem> feedItems = new List<FeedItem>();
    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);
        if (opp.StageName == 'Closed Won' && opp.Amount > 50000 && oldOpp.StageName != 'Closed Won') {
            if (opp.AccountId != null) {
                FeedItem post = new FeedItem();
                post.ParentId = opp.AccountId;
                post.Body = 'We just closed a big deal: ' + opp.Name + ' worth $' + opp.Amount + '!';
                post.Type = 'TextPost';
                feedItems.add(post);
            }
        }
    }
    if (!feedItems.isEmpty()) {
        insert feedItems;
    }
}