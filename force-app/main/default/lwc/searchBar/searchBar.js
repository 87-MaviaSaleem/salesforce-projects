import { LightningElement, track } from 'lwc';
import getSuggestions from '@salesforce/apex/SearchSuggestionController.getSuggestions';

export default class SearchBar extends LightningElement {
    @track suggestions = [];
    searchQuery = '';

    handleKeyDown(event) {
        // Optionally handle special keys (e.g., Enter, Backspace)
        console.log('Key down: ', event.key);
    }

    handleKeyUp(event) {
        this.searchQuery = event.target.value;

        // Fetch suggestions if the query is not empty
        if (this.searchQuery) {
            this.fetchSuggestions(this.searchQuery);
        } else {
            this.suggestions = [];
        }
    }

    fetchSuggestions(query) {
        getSuggestions({ query })
            .then(result => {
                this.suggestions = result;
            })
            .catch(error => {
                console.error('Error fetching suggestions: ', error);
            });
    }
}