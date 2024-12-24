import { LightningElement, track } from 'lwc';
import getTasksByStatus from '@salesforce/apex/TaskController.getTasksByStatus';

export default class TaskList extends LightningElement {
    @track tasks = [];
    @track error;

    connectedCallback() {
        this.fetchTasks('Pending'); // Default status
    }

    // Fetch tasks by status
    fetchTasks(status) {
        getTasksByStatus({ status })
            .then((result) => {
                this.tasks = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.tasks = [];
            });
    }

    // Event Handlers for Status Filtering
    filterCompleted() {
        this.fetchTasks('Completed');
    }

    filterPending() {
        this.fetchTasks('Pending');
    }

    filterInProgress() {
        this.fetchTasks('In Progress');
    }
}