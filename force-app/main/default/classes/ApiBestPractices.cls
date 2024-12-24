public with sharing class ApiBestPractices {
    // Fetch data from an external API with a retry mechanism
    @AuraEnabled(cacheable=true)
    public static String fetchDataWithRetries(String endpoint, Integer maxRetries) {
        HttpResponse response = null; // Variable to store the HTTP response
        Integer retries = 0;         // Counter for the number of retries attempted
        Boolean success = false;     // Flag to indicate if the call was successful

        // Retry logic: Continue retrying until successful or max retries reached
        while (!success && retries < maxRetries) {
            try {
                // Check if API call limits have been exceeded
                if (!isApiLimitAvailable()) {
                    logError('API limit exceeded. Delaying callout.');
                    pauseForLimitReset(); // Pause if the API limit is exceeded
                }

                // Set up and send the HTTP request
                Http http = new Http();
                HttpRequest request = new HttpRequest();
                request.setEndpoint(endpoint);  // Set the endpoint URL for the API
                request.setMethod('GET');       // Set the HTTP method as GET

                response = http.send(request); // Send the request and get the response

                // If the response status is in the 2xx range, consider it successful
                if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                    success = true; // Mark as successful
                } else {
                    retries++; // Increment retry count if status is not 2xx
                    logError('Non-200 response. Status: ' + response.getStatusCode());
                }
            } catch (Exception e) {
                retries++; // Increment retry count if an exception occurs
                logError('Exception occurred: ' + e.getMessage());
            }
        }

        // If retries are exhausted, log and throw an exception
        if (!success) {
            logError('Max retries reached. Unable to fetch data.');
            throw new CalloutException('Failed to fetch data from endpoint after ' + maxRetries + ' attempts.');
        }

        return response.getBody(); // Return the successful response body
    }

    // Check if there are remaining API callouts available
    @AuraEnabled
    public static Boolean isApiLimitAvailable() {
        // Calculate remaining callouts based on the current limits
        Integer remainingCalls = Limits.getCallouts() - Limits.getLimitCallouts();
        return remainingCalls > 5; // Return true if there are more than 5 callouts available
    }

    // Log an error message into the custom API log object
    @AuraEnabled
    public static void logError(String message) {
        Api_Log__c logEntry = new Api_Log__c();
        logEntry.Message__c = message;        // Store the error message
        logEntry.Timestamp__c = System.now(); // Store the current timestamp
        insert logEntry;                      // Insert the log record into the database
    }

    // Pause for a specific amount of time (e.g., until API limits reset)
    private static void pauseForLimitReset() {
        // Example: Pause for 10 seconds (This logic could be enhanced to handle actual delays)
        Integer waitTime = 10000; // Wait time in milliseconds
        System.debug('Pausing for API limit reset. Wait time: ' + waitTime + 'ms');
        // In practice, this could use scheduled jobs or time-based triggers to handle rate limits
    }
}