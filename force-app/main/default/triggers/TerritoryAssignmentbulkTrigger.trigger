trigger TerritoryAssignmentbulkTrigger on Sales_Performance__c (after insert, after update) {
    List<Territory__c> territoriesToUpdate = new List<Territory__c>();
    Set<Id> salesRepIds = new Set<Id>();

    // Collect sales rep IDs from performance records
    for (Sales_Performance__c performance : Trigger.new) {
        salesRepIds.add(performance.User__c);
    }

    // Query for existing territory assignments for the sales reps in bulk
    Map<Id, Territory__c> existingAssignments = new Map<Id, Territory__c>([
        SELECT Id, Sales_Rep__c, Territory_Name__c FROM Territory__c WHERE Sales_Rep__c IN :salesRepIds
    ]);

    // Create or update territory assignments based on performance metrics
    for (Sales_Performance__c performance : Trigger.new) {
        // Create a new Territory__c record
        Territory__c newTerritory = new Territory__c();
        newTerritory.Sales_Rep__c = performance.User__c;
        newTerritory.Performance_Metric__c = performance.Performance_Metric__c;

        // Determine the territory name based on the performance metric
        if (performance.Performance_Metric__c >= 1000) {
            newTerritory.Territory_Name__c = 'High Priority Territory';
        } else if (performance.Performance_Metric__c >= 500) {
            newTerritory.Territory_Name__c = 'Standard Territory';
        } else {
            newTerritory.Territory_Name__c = 'Low Priority Territory';
        }

        // Check if an existing assignment exists for the sales rep
        Territory__c existingTerritory = existingAssignments.get(performance.User__c);

        if (existingTerritory != null) {
            // If there's an existing territory assignment, update it if needed
            if (existingTerritory.Territory_Name__c != newTerritory.Territory_Name__c) {
                existingTerritory.Territory_Name__c = newTerritory.Territory_Name__c;
                territoriesToUpdate.add(existingTerritory); // Add it to update list
            }
        } else {
            // If no existing territory assignment, create a new one
            territoriesToUpdate.add(newTerritory); // Add new territory to insert list
        }
    }

    // Insert or update territories
    if (!territoriesToUpdate.isEmpty()) {
        try {
            upsert territoriesToUpdate; // Use upsert to insert or update records in bulk
        } catch (DmlException e) {
            System.debug('Error inserting/updating territories: ' + e.getMessage());
        }
    }
}