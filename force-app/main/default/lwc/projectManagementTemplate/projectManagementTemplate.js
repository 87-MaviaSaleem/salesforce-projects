import { LightningElement, track } from 'lwc';

export default class ProjectManagementDashboard extends LightningElement {
  @track projects = [
    {
      id: 1,
      name: 'Bridge Construction',
      description: 'Building a new bridge over the river',
      startDate: '2024-01-15',
      status: 'Ongoing',
      tasks: [
        { id: 1, name: 'Design Bridge', completed: false },
        { id: 2, name: 'Procure Materials', completed: false }
      ]
    },
    {
      id: 2,
      name: 'Office Renovation',
      description: 'Renovating the downtown office space',
      startDate: '2023-11-01',
      status: 'Completed',
      tasks: [{ id: 3, name: 'Paint Walls', completed: true }]
    }
  ];
  
  @track filter = 'All';
  @track sortBy = 'Name';

  get filteredProjects() {
    let filtered = [...this.projects];
    
    if (this.filter !== 'All') {
      filtered = filtered.filter(project => project.status === this.filter);
    }
    
    if (this.sortBy === 'Name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'Date') {
      filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }
    
    return filtered;
  }

  handleFilterChange(event) {
    this.filter = event.target.value;
  }

  handleSortChange(event) {
    this.sortBy = event.target.value;
  }

  handleTaskCompletion(event) {
    const projectId = parseInt(event.target.dataset.projectId);
    const taskId = parseInt(event.target.dataset.taskId);

    this.projects = this.projects.map(project => {
      if (project.id === projectId) {
        project.tasks = project.tasks.map(task => 
          task.id === taskId ? { ...task, completed: event.target.checked } : task
        );

        // Auto-complete project if all tasks are completed
        if (project.tasks.every(task => task.completed)) {
          project.status = 'Completed';
        }
      }
      return project;
    });
  }

  markProjectCompleted(event) {
    const projectId = parseInt(event.target.dataset.id);
    this.projects = this.projects.map(project => 
      project.id === projectId ? { ...project, status: 'Completed' } : project
    );
  }

  projectCardClass(status) {
    return status === 'Completed' ? 'project-card completed' : 'project-card ongoing';
  }
}