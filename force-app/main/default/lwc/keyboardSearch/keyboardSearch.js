import { LightningElement, track } from 'lwc';

export default class KeyboardSearch extends LightningElement {
    @track searchQuery = '';
    @track filteredResults = [];
    @track items = [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Orange' },
        { id: 3, name: 'Banana' },
        { id: 4, name: 'Grapes' },
        { id: 5, name: 'Pineapple' }
    ];

    handleInputChange(event) {
        this.searchQuery = event.target.value;
    }

    handleKeyUp(event) {
        const key = event.key;
        
        if (key === 'Enter') {
            console.log('Search submitted:', this.searchQuery);
        } else if (key === 'Escape') {
            this.clearSearch();
        } else {
            this.updateFilteredResults();
        }
    }

    updateFilteredResults() {
        this.filteredResults = this.items.filter(item =>
            item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    clearSearch() {
        this.searchQuery = '';
        this.filteredResults = [];
        console.log('Search cleared');
    }
}