public with sharing class ChatbotController {

    // Apex method to handle multiple user queries
    @AuraEnabled(cacheable=false)
    public static List<String> fetchResponses(List<String> userQueries) {
        List<String> responses = new List<String>();

        // Process each user query and generate a response (simulated here)
        for (String query : userQueries) {
            // Simulate bot response (replace with actual backend logic) 
            responses.add(query);
        }

        return responses;
    }
}