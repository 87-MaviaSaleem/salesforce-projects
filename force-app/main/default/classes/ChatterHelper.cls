public class ChatterHelper {
    public static void createComments(List<FeedItem> feedItems) {
        List<FeedComment> commentsToInsert = new List<FeedComment>();
        final String COMMENT_BODY = 'Thank you for sharing this update!';

        for (FeedItem item : feedItems) {
            FeedComment newComment = new FeedComment();
            //newComment.ParentId = item.Id; 
            newComment.CommentBody = COMMENT_BODY;  
            commentsToInsert.add(newComment);
        }

        if (!commentsToInsert.isEmpty()) {
            try {
                insert commentsToInsert;
            } catch (DmlException e) {
                System.debug('Error inserting FeedComments: ' + e.getMessage());
            }
        }
    }
}