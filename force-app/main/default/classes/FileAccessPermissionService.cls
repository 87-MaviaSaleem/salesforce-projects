public class FileAccessPermissionService {
    // Method to check if a user has access to a specific file based on their role
    public static Boolean hasAccessToFile(Id userId, Id fileId) {
        // Retrieve user role (assuming a custom field 'Role__c' on User)
        User user = [SELECT UserRole.Name FROM User WHERE Id = :userId LIMIT 1];
        String userRole = user.UserRole.Name;
        // Retrieve file access permissions for the given file
        List<File_Access_Permission__c> filePermissions = [SELECT User_Role1__c, Access_Granted__c FROM File_Access_Permission__c WHERE File__c = :fileId];
        
        // Loop through file permissions and check if the user's role has access
        for (File_Access_Permission__c permission : filePermissions) {
            if (permission.User_Role1__c == userRole && permission.Access_Granted__c) {
                return true;
            }
        }
        // If no matching permission found or role does not have access
        return false;
    }
    // Method to update access permissions for a file based on user role
    public static void updateFileAccessPermission(Id fileId, String userRole, Boolean accessGranted) {
        // Query for existing access permission record
      // Query for existing permission (LIMIT 1 ensures only one record will be returned)
				List<File_Access_Permission__c> existingPermissions = [SELECT Id, Access_Granted__c FROM File_Access_Permission__c 
                                                      WHERE File__c = :fileId AND User_Role1__c = :userRole LIMIT 1];
                
                // Check if there's an existing permission
                if (existingPermissions.isEmpty()) {
                    // If no permission record is found, create a new one
                    File_Access_Permission__c newPermission = new File_Access_Permission__c(
                        File__c = fileId,
                        User_Role1__c = userRole,
                        Access_Granted__c = accessGranted
                    );
                    insert newPermission;
                } else {
                    // If permission record exists, update it
                    File_Access_Permission__c existingPermission = existingPermissions[0];
                    existingPermission.Access_Granted__c = accessGranted;
                    update existingPermission;
                }

        
    }
}