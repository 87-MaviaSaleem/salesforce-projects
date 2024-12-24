import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';

export default class EventHandling extends LightningElement {
  @track tasks = [];
  draggedTaskId = null;

  @wire(getTasks)
  wiredTasks({ error, data }) {
    if (data) {
      this.tasks = data.map(task => ({
        id: task.Id,
        title: task.Name,
        status: task.Status__c
      }));
    } else if (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  handleDragStart(event) {
    this.draggedTaskId = event.target.dataset.id;
    event.dataTransfer.setData('text/plain', this.draggedTaskId);
    console.log(`Drag started: ${this.draggedTaskId}`);
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const droppedTaskId = event.dataTransfer.getData('text/plain');
    const targetTaskId = event.target.closest('.task')?.dataset.id;

    if (droppedTaskId && targetTaskId && droppedTaskId !== targetTaskId) {
      this.reorderTasks(droppedTaskId, targetTaskId);
    }
  }

  reorderTasks(draggedTaskId, targetTaskId) {
    const draggedIndex = this.tasks.findIndex(task => task.id === draggedTaskId);
    const targetIndex = this.tasks.findIndex(task => task.id === targetTaskId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedTask] = this.tasks.splice(draggedIndex, 1);
      this.tasks.splice(targetIndex, 0, draggedTask);
      this.tasks = [...this.tasks]; // Force reactivity
      
      console.log(`Tasks reordered: ${draggedTaskId} moved before ${targetTaskId}`);
      
      // Optional: Call server-side method to persist new order
      // updateTaskOrder([...this.tasks.map(task => task.id)]);
    }
  }
}