import { LightningElement, wire } from 'lwc';
import getUserPermissions from '@salesforce/apex/SecureNavigationController.getUserPermissions';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SecureNavigation extends NavigationMixin(LightningElement) {
    permissions = [];
    error;

    @wire(getUserPermissions)
    wiredUserPermissions({ error, data }) {
        if (data) {
            // Set permissions array
            this.permissions = data.permissions || [];
            this.error = undefined;
        } else if (error) {
            // Handle error
            this.error = error;
            this.permissions = [];
        }
    }

    get canAccessSecurePage() {
        // Check if 'Access_Secure_Page' is in permissions
        return this.permissions.includes('Access_Secure_Page');
    }

    get canAccessAdminPage() {
        // Check if 'Access_Admin_Page' is in permissions
        return this.permissions.includes('Access_Admin_Page');
    }

    get canAccessCustomPage() {
        // Check if 'Access_Custom_Page' is in permissions
        return this.permissions.includes('Access_Custom_Page');
    }

    get hasAnyAccess() {
        // Return true if permissions array is not empty
        return this.permissions.length > 0;
    }

    navigateToSecurePage() {
        if (this.canAccessSecurePage) {
            // Navigate to secure page
            this[NavigationMixin.Navigate]({
                type: 'standard__namedPage',
                attributes: {
                    pageName: 'securepage'
                }
            });
        } else {
            // Show access denied message
            this.showAccessDeniedToast();
        }
    }

    navigateToAdminPage() {
        if (this.canAccessAdminPage) {
            // Navigate to admin page
            this[NavigationMixin.Navigate]({
                type: 'standard__namedPage',
                attributes: {
                    pageName: 'adminpage'
                }
            });
        } else {
            // Show access denied message
            this.showAccessDeniedToast();
        }
    }

    navigateToCustomPage() {
        if (this.canAccessCustomPage) {
            // Navigate to custom page
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/custompage'
                }
            });
        } else {
            // Show access denied message
            this.showAccessDeniedToast();
        }
    }

    showAccessDeniedToast() {
        // Display toast message for access denied
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Access Denied',
                message: 'You do not have permission to access this page.',
                variant: 'error'
            })
        );
    }
}