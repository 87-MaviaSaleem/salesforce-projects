public class LoyaltyProgramHandler {
    @InvocableMethod
    
    // This method calculates the total points for a customer and updates their reward status
    public static void calculatePoints(List<Id> customerId) {
        system.debug('Invoke'+customerId);
        // Query the Loyalty_Program__c records associated with the given customerId
        List<Loyalty_Program__c> programs = [
            SELECT Id, Points_Earned__c, Reward_Status__c, Customer_ID__c
            FROM Loyalty_Program__c
            WHERE Customer_ID__c = :customerId
        ];
        system.debug('programs'+programs);
        Integer totalPoints = 0;
        
        // Loop through each Loyalty_Program__c record and accumulate the total points
        for (Loyalty_Program__c program : programs) {
            // Convert Points_Earned__c (Decimal) to Integer and add it to totalPoints
            totalPoints += program.Points_Earned__c.intValue();
        system.debug('totalPoints'+totalPoints);    
        }
        
        // Loop again through the records to update the reward status based on the total points
        for (Loyalty_Program__c program : programs) {
            
            // If the total points are greater than or equal to the threshold (1000 points in this case)
            if (totalPoints >= 1000) { 
                  system.debug('totalPoints1'+totalPoints);    
                program.Reward_Status__c = 'Eligible'; // Set the reward status to "Eligible"
                sendNotification(program.Customer_ID__c); // Send a notification to the customer
            } else {
                program.Reward_Status__c = 'Redeemed'; // Set the reward status to "Redeemed"
            }
        }
        
        // Update the Loyalty_Program__c records in the database with the new reward status
        update programs;
    }
    
    // This method sends a notification email to the customer when they become eligible for a reward
    public static void sendNotification(Id customerId) {
     system.debug('sendNotification');         
        // Create a new email message
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        
        // Set the recipient's email address (for now, a placeholder is used)
        email.setToAddresses(new String[] { 'maharshi.sfdc@gmail.com' });
        
        // Set the subject of the email
        email.setSubject('Congratulations on your Reward!');
        
        // Set the body of the email
        email.setPlainTextBody('You are now eligible for a reward based on your loyalty points!');
        
        // Send the email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
    }
}