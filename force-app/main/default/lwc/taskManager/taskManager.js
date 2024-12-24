import { LightningElement, track, wire } from 'lwc';
import getAllTasks from '@salesforce/apex/TaskController.getAllTasks';
import updateTaskStatus from '@salesforce/apex/TaskController.updateTaskStatus';

export default class TaskManager extends LightningElement {
    @track tasks = [];
    @track searchTerm = '';
    @track filteredTasks = [];
    @track selectedTask = null;

    // Fetch all tasks when the component loads
    @wire(getAllTasks)
    wiredTasks({ data, error }) {
        if (data) {
            this.tasks = data;
            this.filteredTasks = data; // Initially, no filter is applied, so display all tasks
        } else if (error) {
            console.error(error);
        }
    }

    // Handle row click to show task details
    handleRowClick(event) {
        const taskId = event.currentTarget.dataset.taskId;
        this.selectedTask = this.tasks.find(task => task.Id === taskId);
    }

    // Handle the completion of a task (button click)
    handleCompleteTask(event) {
        const taskId = event.target.dataset.taskId;
        updateTaskStatus({ taskId })
            .then(() => {
                // Update the task status in the UI immediately after the update
                this.tasks = this.tasks.map(task =>
                    task.Id === taskId ? { ...task, Status: 'Completed' } : task
                );
                this.filteredTasks = [...this.tasks]; // Re-filter tasks to reflect the updated status
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Handle the search/filter functionality
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase(); // Get the search term from the event
        this.searchTerm = searchTerm;  // Store the search term in the component's state
        this.filteredTasks = this.tasks.filter(task =>
            task.Subject.toLowerCase().includes(searchTerm) || 
            task.Status.toLowerCase().includes(searchTerm)
        );
    }
    
}