public with sharing class GatepassController {

    // Method to save a new gatepass
    @AuraEnabled
    public static String createGatepass(String eventName, String guestName, String gatepassDate, String gatepassTime) {
        try {
            // Create a new Gatepass__c record
            Gatepass__c gatepass = new Gatepass__c();
            
            // Set the fields for the new gatepass record
            gatepass.Event_Name__c = eventName; // Event name for the gatepass
            gatepass.Guest_Name__c = guestName; // Guest name for the gatepass
            gatepass.Gatepass_Date__c = Date.valueOf(gatepassDate); // Convert string date to Date object
            
            // Convert string time to Time object
            String[] timeParts = gatepassTime.split(':');
            Integer hours = Integer.valueOf(timeParts[0]);
            Integer minutes = Integer.valueOf(timeParts[1]);
            
            // Combine the date and time to create a Datetime object
            Date gatepassDateObj = Date.valueOf(gatepassDate);
            Datetime gatepassDateTime = Datetime.newInstance(gatepassDateObj, Time.newInstance(hours, minutes, 0, 0));
            
            gatepass.Gatepass_Time__c = gatepassDateTime; // Set the combined Datetime
            
            // Insert the new gatepass record into Salesforce
            insert gatepass;
            
            // Return a success message
            return 'Gatepass created successfully';
        } catch (Exception e) {
            // Handle any exceptions and return a specific error message
            throw new AuraHandledException('Error creating gatepass: ' + e.getMessage());
        }
    }

    // Method to fetch existing gatepasses with optional search filters for event name and guest name
    @AuraEnabled(cacheable=true)
    public static List<Gatepass__c> getGatepasses(String eventName, String guestName) {
        try {
            // Start building the query to retrieve gatepasses
            String query = 'SELECT Id, Event_Name__c, Guest_Name__c, Gatepass_Date__c, Gatepass_Time__c FROM Gatepass__c WHERE ';
            List<String> conditions = new List<String>();

            // If eventName is provided, add it to the query as a condition
            if (String.isNotEmpty(eventName)) {
                conditions.add('Event_Name__c LIKE :eventName');
            }
            
            // If guestName is provided, add it to the query as a condition
            if (String.isNotEmpty(guestName)) {
                conditions.add('Guest_Name__c LIKE :guestName');
            }

            // If no conditions are added, ensure the query still returns records
            if (conditions.isEmpty()) {
                query += 'Id != null'; // Default condition to return all records
            } else {
                query += String.join(conditions, ' AND '); // Join the conditions with AND
            }

            // Execute the dynamic query and return the list of gatepasses
            return Database.query(query);
        } catch (Exception e) {
            // Handle any exceptions and return a specific error message
            throw new AuraHandledException('Error fetching gatepasses: ' + e.getMessage());
        }
    }

    // Method to fetch a specific gatepass by its Id
    @AuraEnabled
    public static Gatepass__c getGatepassById(String gatepassId) {
        try {
            // Query for a single Gatepass__c record using the provided gatepassId
            return [SELECT Id, Event_Name__c, Guest_Name__c, Gatepass_Date__c, Gatepass_Time__c FROM Gatepass__c WHERE Id = :gatepassId LIMIT 1];
        } catch (Exception e) {
            // Handle any exceptions and return a specific error message
            throw new AuraHandledException('Error fetching gatepass details: ' + e.getMessage());
        }
    }

    // Method to update an existing gatepass by its Id
    @AuraEnabled
    public static String updateGatepass(String gatepassId, String eventName, String guestName, String gatepassDate, String gatepassTime) {
        try {
            // Query for the Gatepass__c record to be updated
            Gatepass__c gatepass = [SELECT Id, Event_Name__c, Guest_Name__c, Gatepass_Date__c, Gatepass_Time__c FROM Gatepass__c WHERE Id = :gatepassId LIMIT 1];
            
            // Update the gatepass record with the new values
            gatepass.Event_Name__c = eventName; // Update event name
            gatepass.Guest_Name__c = guestName; // Update guest name
            gatepass.Gatepass_Date__c = Date.valueOf(gatepassDate); // Update gatepass date
            
            // Convert string time to Time object
            String[] timeParts = gatepassTime.split(':');
            Integer hours = Integer.valueOf(timeParts[0]);
            Integer minutes = Integer.valueOf(timeParts[1]);
            
            // Combine the date and time to create a Datetime object
            Date gatepassDateObj = Date.valueOf(gatepassDate);
            Datetime gatepassDateTime = Datetime.newInstance(gatepassDateObj, Time.newInstance(hours, minutes, 0, 0));
            
            gatepass.Gatepass_Time__c = gatepassDateTime; // Set the combined Datetime
            
            // Perform the update operation in Salesforce
            update gatepass;
            
            // Return a success message
            return 'Gatepass updated successfully';
        } catch (Exception e) {
            // Handle any exceptions and return a specific error message
            throw new AuraHandledException('Error updating gatepass: ' + e.getMessage());
        }
    }
}