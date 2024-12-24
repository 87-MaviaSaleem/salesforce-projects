trigger TerritoryAssignmentTrigger on Sales_Performance__c (after insert, after update) {
    List<Territory__c> territoriesToUpsert = new List<Territory__c>();
    List<Territory__c> failedAssignments = new List<Territory__c>();

    for (Sales_Performance__c performance : Trigger.new) {
        Territory__c newTerritory = new Territory__c();
        newTerritory.Sales_Rep__c = performance.User__c;
        newTerritory.Performance_Metric__c = performance.Performance_Metric__c;

        try {
            if (performance.Performance_Metric__c >= 1000) {
                newTerritory.Territory_Name__c = 'High Priority Territory';
            } else if (performance.Performance_Metric__c >= 500) {
                newTerritory.Territory_Name__c = 'Standard Territory';
            } else {
                newTerritory.Territory_Name__c = 'Low Priority Territory';
            }

            // Check if the sales rep is already assigned to the territory
            Territory__c existingAssignment = [SELECT Id FROM Territory__c 
                                                     WHERE Sales_Rep__c = :performance.User__c
                                                     LIMIT 1];
            if (existingAssignment != null) {
                // Handle existing assignment (you could update or skip)
                existingAssignment.Territory_Name__c = newTerritory.Territory_Name__c;
                territoriesToUpsert.add(existingAssignment);
            } else {
                territoriesToUpsert.add(newTerritory);
            }

        } catch (DmlException e) {
            // Log the error for failed assignments
            failedAssignments.add(newTerritory);
            System.debug('Error assigning territory for Rep: ' + performance.User__c + ', Error: ' + e.getMessage());
        }
    }

    // Insert or update territories
    if (!territoriesToUpsert.isEmpty()) {
        try {
            upsert territoriesToUpsert;
        } catch (DmlException e) {
            System.debug('Error inserting/updating territories: ' + e.getMessage());
        }
    }

    // Handle failed assignments
    if (!failedAssignments.isEmpty()) {
        System.debug('Failed assignments: ' + failedAssignments);
    }
}