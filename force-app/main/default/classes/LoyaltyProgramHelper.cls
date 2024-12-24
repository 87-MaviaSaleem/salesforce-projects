public class LoyaltyProgramHelper {

    // Invocable method to calculate and update customer loyalty points
    @InvocableMethod(label='Calculate Loyalty Points' description='Calculates points based on purchase amount and updates the Loyalty Program record')
    public static List<Decimal> calculateLoyaltyPoints(List<CalculatePointsRequest> requests) {
        List<Decimal> results = new List<Decimal>();

        for (CalculatePointsRequest request : requests) {
            // Business logic: 1 point for every $10 spent
            Decimal pointsEarned = request.purchaseAmount / 10;

            // Query the Loyalty Program record for the customer
            Loyalty_Program__c loyaltyRecord = [SELECT Id, Points_Earned__c FROM Loyalty_Program__c WHERE Customer_ID__c = :request.customerId LIMIT 1];

            // Update points
            loyaltyRecord.Points_Earned__c += pointsEarned;

            // Update the record in Salesforce
            update loyaltyRecord;

            // Add the new points total to the results list
            results.add(loyaltyRecord.Points_Earned__c);
        }

        return results;
    }

    public class CalculatePointsRequest {
        @InvocableVariable(required=true)
        public Id customerId;

        @InvocableVariable(required=true)
        public Decimal purchaseAmount;
    }
}