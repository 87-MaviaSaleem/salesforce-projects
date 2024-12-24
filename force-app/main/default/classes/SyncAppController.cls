public class SyncAppController {

    // This method is used to fetch a list of users with pagination.
    // It is marked as @AuraEnabled so it can be called from Lightning components.
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getUsers(Integer pageNumber, Integer pageSize) {
        // Validate the input parameters to ensure they are not null or invalid.
        if (pageNumber == null || pageSize == null || pageNumber < 1 || pageSize <= 0) {
            throw new IllegalArgumentException('Invalid pageNumber or pageSize');
        }

        // Calculate the offset value for the query based on the page number and page size.
        Integer offsetValue = (pageNumber - 1) * pageSize;

        // Query to fetch the required number of users ordered by Name, with the applied OFFSET for pagination.
        List<User> users = [SELECT Id, Name FROM User ORDER BY Name LIMIT :pageSize OFFSET :offsetValue];

        // Query to get the total number of users in the system (for pagination purposes).
        Integer totalRecords = [SELECT COUNT() FROM User];

        // Log the fetched users and total record count for debugging purposes.
        System.debug('Fetched Users: ' + users);
        System.debug('Total User Count: ' + totalRecords);

        // Create a result map to store both the fetched records and the total user count.
        Map<String, Object> result = new Map<String, Object>();
        result.put('records', users);  // Store the user records in the map.
        result.put('totalRecords', totalRecords);  // Store the total record count in the map.

        // Return the map containing user data and total records count.
        return result;
    }

    // This method is used to sync data with an external system.
    // It is marked as @AuraEnabled so it can be called from Lightning components.
    @AuraEnabled
    public static void syncWithExternalSystem() {
        try {
            // Define the endpoint URL for the external system where we will send data.
            String endpoint = 'https://api.external-system.com/sync';

            // Create a new HttpRequest object to configure the API request.
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);  // Set the API endpoint for the request.
            req.setMethod('POST');  // Set the HTTP method to POST (as we are sending data).
            req.setHeader('Content-Type', 'application/json');  // Set the content type to JSON.

            // Query all users and serialize them into a JSON string to be sent in the body of the request.
            List<User> users = [SELECT Id, Name, Email FROM User];
            String jsonBody = JSON.serialize(users);  // Convert the user list to JSON format.

            req.setBody(jsonBody);  // Attach the JSON body to the request.

            // Create a new Http object to send the request.
            Http http = new Http();
            HttpResponse res = http.send(req);  // Send the request and capture the response.

            // If the response status is not 200 (OK), throw an exception.
            if (res.getStatusCode() != 200) {
                throw new CalloutException('Failed to sync with external system: ' + res.getBody());
            }
        } catch (Exception e) {
            // If there is any exception (network issues, API issues, etc.), log the error and throw a custom exception.
            System.debug('Error during sync with external system: ' + e.getMessage());
            throw new AuraHandledException('Sync failed. Please try again later.');  // Throw a user-friendly error message.
        }
    }

    // This method generates a CSV string from the provided list of User objects.
    // It is marked as @AuraEnabled so it can be called from Lightning components.
    @AuraEnabled
    public static String exportToCSV(List<User> userData) {
        // Initialize the CSV string with the header row.
        String csvString = 'Id,Name,Email\n';

        // Loop through each user and add their details to the CSV string.
        for (User user : userData) {
            // Concatenate the user data into a CSV row.
            csvString += user.Id + ',' + user.Name + ',' + user.Email + '\n';
        }

        // Return the final CSV string to the caller.
        return csvString;
    }
}