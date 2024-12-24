// projectCreator.js
import { LightningElement, track } from 'lwc';
import createProject from '@salesforce/apex/ProjectController.createProject';

export default class ProjectCreator extends LightningElement {
    @track projectName = '';
    @track status = '';
    @track errorMessage = '';
    @track successMessage = '';

    get statusOptions() {
        return [
            { label: 'Not Started', value: 'Not Started' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
        ];
    }

    handleInputChange(event) {
        const field = event.target.label;
        if (field === 'Project Name') this.projectName = event.target.value;
        else if (field === 'Status') this.status = event.target.value;
    }

    createProject() {
        // Reset messages
        this.errorMessage = '';
        this.successMessage = '';

        // Client-side validation
        if (!this.projectName) {
            this.errorMessage = 'Project Name is required.';
            return;
        }

        // Call Apex if validation passes
        createProject({ projectName: this.projectName, status: this.status })
            .then(result => {
                if (result.startsWith('Error')) {
                    this.errorMessage = result;
                } else {
                    this.successMessage = result;
                    this.projectName = '';
                    this.status = '';
                }
            })
            .catch(error => {
                this.errorMessage = 'Unexpected Error: ' + error.body.message;
            });
    }
}