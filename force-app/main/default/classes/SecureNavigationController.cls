public with sharing class SecureNavigationController {
    @AuraEnabled(cacheable=true)
    public static UserPermissions getUserPermissions() {
        // Retrieve the current user's profile
        User currentUser = [
            SELECT Id, Profile.Name
            FROM User
            WHERE Id = :UserInfo.getUserId()
        ];

        UserPermissions userPerms = new UserPermissions();
        userPerms.profileName = currentUser.Profile.Name;

        // Map profiles to permissions
        Map<String, List<String>> profilePermissions = new Map<String, List<String>>{
            'Standard User' => new List<String>{'Access_Secure_Page'},
            'System Administrator' => new List<String>{'Access_Secure_Page', 'Access_Admin_Page'}
        };

        // Retrieve the user's assigned permission sets
        List<PermissionSetAssignment> psaList = [
            SELECT PermissionSet.PermissionsApiEnabled, PermissionSet.Label
            FROM PermissionSetAssignment
            WHERE AssigneeId = :UserInfo.getUserId()
        ];

        // Initialize permissions list
        Set<String> permissions = new Set<String>();

        // Add permissions based on profile
        if (profilePermissions.containsKey(userPerms.profileName)) {
            permissions.addAll(profilePermissions.get(userPerms.profileName));
        }

        // Map permission sets to permissions
        Map<String, List<String>> permissionSetPermissions = new Map<String, List<String>>{
            'Custom Permission Set 1' => new List<String>{'Access_Custom_Page'},
            'Custom Permission Set 2' => new List<String>{'Access_Admin_Page'}
        };

        // Add permissions based on assigned permission sets
        for (PermissionSetAssignment psa : psaList) {
            String psLabel = psa.PermissionSet.Label;
            if (permissionSetPermissions.containsKey(psLabel)) {
                permissions.addAll(permissionSetPermissions.get(psLabel));
            }
        }

        // Assign the combined permissions to the userPerms object
        userPerms.permissions = new List<String>(permissions);

        return userPerms;
    }

    public class UserPermissions {
        @AuraEnabled public String profileName;
        @AuraEnabled public List<String> permissions;
    }
}