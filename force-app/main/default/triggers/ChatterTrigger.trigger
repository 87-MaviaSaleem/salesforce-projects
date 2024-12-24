trigger ChatterTrigger on FeedItem (after insert) {
    // Set of keywords to identify in Chatter posts
    Set<String> Keywords = new Set<String>{'urgent', 'help', 'issue'};

    // Process each new Chatter post
    for (FeedItem post : Trigger.new) {
        // Only proceed if post content exists
        if (post.Body != null) {
            for (String keyword : Keywords) {
                // Check if post content includes any specified keyword
                if (post.Body.toLowerCase().contains(keyword.toLowerCase())) {
                    // Create and configure a Task record
                    Task newTask = new Task(
                        Subject = 'Alert: Keyword Found in Chatter Post',
                        Description = 'The following keyword was found: ' + keyword + '\n\nPost Content:\n' + post.Body,
                        Priority = 'High',
                        Status = 'New'
                    );

                    System.debug('This trigger is Executed');
                    insert newTask;
                    break; // Exit loop once a keyword is found
                }
            }
        }
    }
}