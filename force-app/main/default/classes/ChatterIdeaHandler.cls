public class ChatterIdeaHandler {
    public static void captureIdeas(List<FeedItem> feedItems) {
        List<Product_Idea__c> ideasToInsert = new List<Product_Idea__c>();

        for (FeedItem feedItem : feedItems) {
            if (feedItem.Type == 'TextPost' && feedItem.Title != null) {
                Product_Idea__c idea = new Product_Idea__c();
                idea.Idea_Title__c = feedItem.Title;
                idea.Customer_Feedback__c = feedItem.Body;
                idea.Priority__c = 'Medium'; // Default value
                idea.Status__c = 'Under Review'; // Default value
                ideasToInsert.add(idea);
            }
        }

        if (!ideasToInsert.isEmpty()) {
            insert ideasToInsert;
        }
    }
    
    /*
     * // Query FeedItem records that are of type 'TextPost' (Chatter post)
        List<FeedItem> feedItems = [SELECT Id, Title, Body, Type FROM FeedItem WHERE Type = 'TextPost' AND Title != NULL LIMIT 5];
        
        // Set custom priority and status
        String customPriority = 'High';
        String customStatus = 'Reviewed';
        
        // Call the captureIdeas method from ChatterIdeaHandler class with custom parameters
        ChatterIdeaHandler.captureIdeas(feedItems, customPriority, customStatus);

     */
}