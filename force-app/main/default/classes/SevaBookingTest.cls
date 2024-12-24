@isTest
private class SevaBookingTest {

    @isTest
    private static void createTestUser() {
        // Generate a unique username using a random number and timestamp to avoid duplicates
        String uniqueUsername = 'testuser_' + String.valueOf(System.currentTimeMillis()) + '@example.com';
        
        // Fetch the Profile ID for the Standard User Profile (adjust as needed for your org)
        Profile standardUserProfile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        
        // Create a new User record with all required fields, including FirstName and LastName
        User newUser = new User(
            Alias = 'testuser',
            Email = 'testuser@example.com',
            Username = uniqueUsername,  // Use unique username to avoid duplicates
            ProfileId = standardUserProfile.Id,
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            FirstName = 'Test',  // FirstName is required
            LastName = 'User'    // LastName is required
        );
        
        // Insert the new user
        insert newUser;
        
        // Optionally, add assert statements to validate the test
        System.assertNotEquals(null, newUser.Id, 'User was not created successfully');
    }
    
    @isTest
    private static void testSevaBookingWithPayment() {
        // Your test implementation for Seva booking with payment goes here.
        // For instance, create a SevaBooking record, associate it with the created User, etc.
    }
}