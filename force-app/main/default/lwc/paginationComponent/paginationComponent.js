import { LightningElement, api } from 'lwc';

export default class PaginationComponent extends LightningElement {
    @api currentPage = 1; // Current page number
    @api pageSize = 20;   // Number of records per page
    @api totalRecords = 0; // Total number of records

    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.dispatchEvent(new CustomEvent('pagechange', { detail: { page: this.currentPage - 1 } }));
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.dispatchEvent(new CustomEvent('pagechange', { detail: { page: this.currentPage + 1 } }));
        }
    }
}