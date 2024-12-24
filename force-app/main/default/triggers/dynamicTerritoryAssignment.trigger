trigger dynamicTerritoryAssignment on UserTerritory2Association (after insert, after update) {

    // Initialize lists for updates and errors
    List<UserTerritory2Association> updates = new List<UserTerritory2Association>();
    List<String> errorMessages = new List<String>();

    // Extract UserIds from Trigger.new
    Set<Id> userIds = new Set<Id>();
    for (UserTerritory2Association uta : Trigger.new) {
        userIds.add(uta.UserId); // Add UserId to the Set
    }

    // Query the UserTerritory2Association records with necessary fields
    List<UserTerritory2Association> utaList;
    try {
        utaList = [SELECT Id, UserId, Territory2.Name, User.Sales_Performance__c
                   FROM UserTerritory2Association
                   WHERE UserId IN :userIds]; // Use userIds Set in the query
    } catch (QueryException e) {
        errorMessages.add('Error occurred during SOQL query: ' + e.getMessage());
        // Optionally, send error email asynchronously
        TerritoryAssignmentHelper.sendErrorEmailAsync('SOQL Query Error', e.getMessage());
        return;
    }

    // Loop through the records and apply business logic
    for (UserTerritory2Association uta : utaList) {

        // Check for null SalesPerformance__c value
        if (uta.User.Sales_Performance__c == null) {
            errorMessages.add('Sales performance data missing for user: ' + uta.UserId);
            continue; // Skip this record if data is missing
        }

        // Assign territories based on Sales_Performance__c value
        try {
            if (uta.User.Sales_Performance__c == 1000000) {
                              system.debug('test'+uta.User.Sales_Performance__c);

                Territory2 premiumTerritory = [SELECT Id FROM Territory2 WHERE Name = 'Premium' LIMIT 1];
                //uta.Territory2Id = premiumTerritory.Id;
            } else {
                                system.debug('test1'+uta.User.Sales_Performance__c);

                Territory2 standardTerritory = [SELECT Id FROM Territory2 WHERE Name = 'Standard' LIMIT 1];
                uta.Territory2Id = standardTerritory.Id;
            }
            updates.add(uta);
        } catch (QueryException e) {
            errorMessages.add('Error while querying territories for user: ' + uta.UserId + ', Error: ' + e.getMessage());
            continue; // Skip this record if there is an error
        }
    }

    // Perform the DML operation (update)
    if (!updates.isEmpty()) {
        try {
            update updates;
        } catch (DmlException e) {
            errorMessages.add('DML Error during territory assignment update: ' + e.getMessage());
            TerritoryAssignmentHelper.sendErrorEmailAsync('DML Error', e.getMessage());
            return;
        }
    }

    // Send email notification for the assignments (if any errors)
    if (!errorMessages.isEmpty()) {
        TerritoryAssignmentHelper.sendErrorEmailAsync('Territory Assignment Errors', String.join(errorMessages, '\n'));
    } else {
        // Pass UserIds to the future method for sending success email asynchronously
        TerritoryAssignmentHelper.sendSuccessEmailAsync(userIds);
    }
}