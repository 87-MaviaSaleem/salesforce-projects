import { LightningElement } from 'lwc';

export default class FilterInput extends LightningElement {
    handleFilterChange(event) {
        const filterValue = event.target.value;
        const filterEvent = new CustomEvent('filterchange', {
            detail: { filterValue },
        });
        this.dispatchEvent(filterEvent);
    }
}