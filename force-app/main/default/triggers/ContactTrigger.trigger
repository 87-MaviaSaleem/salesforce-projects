trigger ContactTrigger on Contact (after insert) {
    // List to hold notifications to be created
    List<Contact_Notification__c> notificationsToInsert = new List<Contact_Notification__c>();

    // Set of job titles that should trigger a notification
    Set<String> targetJobTitles = new Set<String>{'Manager', 'Director'};

    // Loop through the newly inserted contacts
    for (Contact newContact : Trigger.New) {
        // Check if the job title matches our criteria
        if (targetJobTitles.contains(newContact.Title)) {
            // Create a new notification entry
            Contact_Notification__c notification = new Contact_Notification__c(
                Job_Title__c = newContact.Title,
                Contact_Name__c = newContact.Id,
                Created_By__c = UserInfo.getUserId() // Reference to the current user
            );
            // Add the notification to the list
            notificationsToInsert.add(notification);
        }
    }

    // Insert all notifications at once if the list is not empty
    if (!notificationsToInsert.isEmpty()) {
        try {
            insert notificationsToInsert;
        } catch (DmlException e) {
            // Log any DML exceptions
            System.debug('Failed to insert notifications: ' + e.getMessage());
        }
    }
}