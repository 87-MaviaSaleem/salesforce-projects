public class LoyaltyProgramHelper1 {

    // Invocable method to check reward eligibility based on points
    @InvocableMethod(label='Check Reward Eligibility' description='Checks if customer has enough points for a reward')
    public static List<String> checkRewardEligibility(List<Id> customerIds) {
        List<String> results = new List<String>();

        // Reward threshold for eligibility (e.g., 500 points)
        Decimal rewardThreshold = 500;

        for (Id customerId : customerIds) {
            // Query the Loyalty Program record for the customer
            Loyalty_Program__c loyaltyRecord = [SELECT Id, Points_Earned__c, Reward_Status__c FROM Loyalty_Program__c WHERE Customer_ID__c = :customerId LIMIT 1];

            // Check if the customer has enough points for a reward
            if (loyaltyRecord.Points_Earned__c >= rewardThreshold && loyaltyRecord.Reward_Status__c != 'Eligible') {
                loyaltyRecord.Reward_Status__c = 'Eligible';  // Update reward status
                update loyaltyRecord;

                results.add('Eligible');
            } else {
                results.add(loyaltyRecord.Reward_Status__c);  // Return current status if not eligible
            }
        }

        return results;
    }
}