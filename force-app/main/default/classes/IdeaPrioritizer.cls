public class IdeaPrioritizer {
    public static void updatePriority(List<Product_Idea__c> ideas) {
        for (Product_Idea__c idea : ideas) {
            // Example logic to prioritize ideas based on customer feedback length
            if (idea.Customer_Feedback__c.length() > 500) {
                idea.Priority__c = 'High';
            } else if (idea.Customer_Feedback__c.length() > 200) {
                idea.Priority__c = 'Medium';
            } else {
                idea.Priority__c = 'Low';
            }
        }

        update ideas;
    }
}