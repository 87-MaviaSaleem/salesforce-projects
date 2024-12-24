public class LeadHelper {
    public static void createFollowUpTasks(List<Lead> newLeads, Map<Id, Lead> oldLeads) {
        List<Task> tasksToInsert = new List<Task>();

        for (Lead lead : newLeads) {
            // Check if the Lead is converted and was not previously converted
            if (lead.IsConverted && !oldLeads.get(lead.Id).IsConverted) {
                // Create a new Task for the converted Lead
                Task followUpTask = new Task();
                followUpTask.Subject = 'Follow up with new Account';
                followUpTask.OwnerId = lead.OwnerId; // Assign to the same sales rep
                followUpTask.WhatId = lead.ConvertedAccountId; // Link to the new Account
                followUpTask.Priority = lead.High_Priority__c ? 'High' : 'Normal'; // Check for high priority
                followUpTask.ActivityDate = System.today().addDays(5); // Set follow-up for 5 days later


                tasksToInsert.add(followUpTask);
            }
        }

        // Insert all the follow-up tasks in a single DML operation
        if (!tasksToInsert.isEmpty()) {
            try {
                insert tasksToInsert;
            } catch (DmlException e) {
                // Log the error and handle it gracefully
                System.debug('Error inserting tasks: ' + e.getMessage());
            }
        }
    }
}