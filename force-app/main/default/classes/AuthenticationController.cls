public class AuthenticationController {
    @AuraEnabled(cacheable=false)
    public static AuthResult loginUser(String username, String password) {
        AuthResult result = new AuthResult();
        
        try {
            // Simulating login logic
            if (username == 'test' && password == 'authTest@123') {
                result.success = true;
                result.errorMessage = '';
            } else if (username == 'test' && password == 'login@123') {
                result.success = true;
                result.errorMessage = '';
            } else if (username == 'test' && password == 'authResult@123') {
                result.success = true;
                result.errorMessage = '';
            } else  {
                result.success = false;
                result.errorMessage = 'Invalid login credentials.';
            }
        } catch (Exception e) {
            result.success = false;
            result.errorMessage = 'An error occurred during login: ' + e.getMessage();
        }
        
        return result;
    }

    public class AuthResult {
        @AuraEnabled public Boolean success;
        @AuraEnabled public String errorMessage;
    }
}