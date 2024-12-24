import { LightningElement, wire, track } from 'lwc';
import getEnvironment from '@salesforce/apex/EnvironmentController.getEnvironment';

export default class LazyLoadedComponent extends LightningElement {
    @track message;

    @wire(getEnvironment)
    wiredEnvironment({ error, data }) {
        if (data) {
            this.setMessageBasedOnEnvironment(data);
        } else if (error) {
            console.error('Error fetching environment', error);
        }
    }

    setMessageBasedOnEnvironment(env) {
        if (env === 'production') {
            this.message = 'Production Loaded';
        } else if (env === 'staging') {
            this.message = 'Staging Loaded';
        } else {
            this.message = 'Development Loaded';
        }
    }
}