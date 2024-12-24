import { LightningElement, track, wire } from 'lwc';
import getOrders from '@salesforce/apex/OrderService.getOrders';
import filterOrders from '@salesforce/apex/OrderService.filterOrders';
import { refreshApex } from '@salesforce/apex';

export default class OrderDashboard extends LightningElement {
    @track orders;
    @track page = 1;
    @track sortField = 'Order_Date__c';
    @track sortOrder = 'ASC';
    @track filterStatus = '';
    recordsPerPage = 10;
    totalRecords = 0;

    sortOptions = [
        { label: 'Date', value: 'Order_Date__c' },
        { label: 'Amount', value: 'Order_Amount__c' },
    ];

    statusOptions = [
        { label: 'All', value: '' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Shipped', value: 'Shipped' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Canceled', value: 'Canceled' },
    ];

    @wire(getOrders, { limitSize: '$recordsPerPage', offsetSize: '($page - 1) * $recordsPerPage', sortField: '$sortField', sortOrder: '$sortOrder' })
    wiredOrders(result) {
        this.orders = result;
    }

    handleNextPage() {
        this.page++;
        refreshApex(this.orders);
    }

    handlePreviousPage() {
        this.page--;
        refreshApex(this.orders);
    }

    handleSortChange(event) {
        this.sortField = event.detail.value;
        refreshApex(this.orders);
    }

    handleFilterChange(event) {
        this.filterStatus = event.detail.value;
        this.page = 1;
        this.loadFilteredOrders();
    }

    loadFilteredOrders() {
        filterOrders({ status: this.filterStatus })
            .then((data) => {
                this.orders = data;
            });
    }
}