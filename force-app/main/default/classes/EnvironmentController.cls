public class EnvironmentController {
    @AuraEnabled(cacheable=true)
    public static String getEnvironment() {
        // Get the org domain URL
        String orgUrl = URL.getOrgDomainUrl().toExternalForm();
        
        // Logic to determine the current environment
        String environment;
        if (orgUrl.contains('my.salesforce.com')) {
            environment = 'production';
        } else if (orgUrl.contains('cs')) {
            environment = 'staging';
        } else {
            environment = 'development';
        }
        return environment;
    }
}