@isTest
private class UserCreationTest {

    @isTest
    private static void createTestUser() {
        // Generate a unique username using a random number to avoid duplicates
        String uniqueUsername = 'testuser_' + String.valueOf(Math.random()).substring(2, 10) + '@example.com';
        
        // Fetch the Profile ID for the Standard User Profile (adjust as needed for your org)
        Profile standardUserProfile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        
        // Create a new User record with unique username and standard profile
        User newUser = new User(
            Alias = 'testuser',
            Email = 'testuser@example.com',
            Username = uniqueUsername,  // Use unique username to avoid duplicates
            ProfileId = standardUserProfile.Id,
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US'
        );
        
        // Insert the new user
        insert newUser;
        
        // Optionally, add assert statements to validate the test
        System.assertNotEquals(null, newUser.Id, 'User was not created successfully');
    }
}