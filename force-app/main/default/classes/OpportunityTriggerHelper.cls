public class OpportunityTriggerHelper {
    public static void updateTotalSales(List<Opportunity> opportunities) {
        // Set to store Opportunity IDs
        Set<Id> opportunityIds = new Set<Id>();
        
        // Collect Opportunity IDs from the records being processed
        for (Opportunity opp : opportunities) {
            if (opp.Id != null) {
                opportunityIds.add(opp.Id);
            }
        }

        // Query related Opportunity Line Items
        List<OpportunityLineItem> lineItems = [SELECT OpportunityId, TotalPrice FROM OpportunityLineItem WHERE OpportunityId IN :opportunityIds];

        // Create a map to hold total sales amounts
        Map<Id, Decimal> totalSalesMap = new Map<Id, Decimal>();

        // Sum the TotalPrice from Opportunity Line Items
        for (OpportunityLineItem lineItem : lineItems) {
            if (!totalSalesMap.containsKey(lineItem.OpportunityId)) {
                totalSalesMap.put(lineItem.OpportunityId, 0);
            }
            totalSalesMap.put(lineItem.OpportunityId, totalSalesMap.get(lineItem.OpportunityId) + lineItem.TotalPrice);
        }

        // Update the Total_Sales__c field on each Opportunity
        for (Opportunity opp : opportunities) {
            if (totalSalesMap.containsKey(opp.Id)) {
                opp.Total_Sales__c = totalSalesMap.get(opp.Id);
            } else {
                opp.Total_Sales__c = 0; // Set to 0 if no line items
            }
        }
    }
}