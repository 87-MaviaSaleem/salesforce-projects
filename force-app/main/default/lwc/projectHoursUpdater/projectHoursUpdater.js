import { LightningElement, api, track } from 'lwc';
import getProject from '@salesforce/apex/ProjectController.getProject';
import updateProject from '@salesforce/apex/ProjectController.updateProject';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProjectHoursUpdater extends LightningElement {
    @api recordId;
    @track project;
    @track hoursWorked;
    @track error;

    connectedCallback() {
        this.loadProject();
    }

    loadProject() {
        getProject({ projectId: this.recordId })
            .then(result => {
                this.project = result;
                this.hoursWorked = this.project.Hours_Worked__c;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.project = undefined;
            });
    }

    handleHoursChange(event) {
        this.hoursWorked = event.target.value;
    }

    handleSave() {
        updateProject({ projectId: this.recordId, hoursWorked: this.hoursWorked })
            .then(() => {
                return getProject({ projectId: this.recordId });
            })
            .then(result => {
                this.project = result;
                this.hoursWorked = this.project.Hours_Worked__c;
                this.error = undefined;
                this.showToast('Success', 'Project updated successfully', 'success');
            })
            .catch(error => {
                this.error = error;
                this.showToast('Error', 'Error updating project', 'error');
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}