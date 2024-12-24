public with sharing class SevaBookingController {

    /**
     * Fetches the list of available sevas.
     * Ensures the user is authenticated before returning data.
     *
     * @return List<Seva__c> List of seva records with basic details
     * @throws AuraHandledException if the user is not authenticated or an error occurs
     */
    @AuraEnabled(cacheable=true)
    public static List<Seva__c> getSevas() {
        // Verify user authentication (Make sure the user is logged in and has a valid profile)
        if (!UserInfo.getUserId().startsWith('005')) {
            // Handling unauthenticated user scenario
            throw new AuraHandledException('User is not authenticated to view seva details.');
        }

        try {
            // Query to fetch available sevas, ordering by name
            return [SELECT Id, Name, Price__c, Description__c FROM Seva__c ORDER BY Name];
        } catch (Exception e) {
            // Handle any unexpected errors during the data fetch
            System.debug('Error retrieving Sevas: ' + e.getMessage());
            throw new AuraHandledException('Unable to fetch seva details. Please try again later.');
        }
    }

    /**
     * Books a seva for the current user.
     * Ensures the user is authenticated and records the booking.
     *
     * @param sevaId Id of the seva to book
     * @throws AuraHandledException if the user is not authenticated or an error occurs
     */
    @AuraEnabled
public static void bookSeva(Id sevaId) {
    // Verify user authentication
    if (!UserInfo.getUserId().startsWith('005')) {
        throw new AuraHandledException('User is not authenticated to book sevas.');
    }

    try {
        // Log the sevaId to ensure it's passed correctly
        System.debug('Booking seva with ID: ' + sevaId);

        // Ensure the Seva exists before booking
        List<Seva__c> sevas = [SELECT Id, Name FROM Seva__c WHERE Id = :sevaId LIMIT 1];
        
        // Log the result of the query to check if any records were returned
        System.debug('Found Sevas: ' + sevas);
        
        // If no sevas are found, throw an exception
        if (sevas.isEmpty()) {
            throw new AuraHandledException('The selected Seva could not be found.');
        }

        // Create and insert a new seva booking record
        SevaBooking__c newBooking = new SevaBooking__c(
            Seva__c = sevaId,
            User__c = UserInfo.getUserId(),
            Booking_Date__c = System.now(), // Add current date and time as booking date
            Booking_Status__c = 'Booked' // Set booking status
        );
        insert newBooking;

        // Log the successful creation of the booking
        System.debug('Successfully booked Seva with ID: ' + newBooking.Id);

    } catch (Exception e) {
        // Log the error to debug why it failed
        System.debug('Error booking seva: ' + e.getMessage());
        // Rethrow the error with a more specific message
        throw new AuraHandledException('Failed to book seva. Please try again later. Error: ' + e.getMessage());
    }
}

}