import { LightningElement, wire } from 'lwc';
import getSortedAccounts from '@salesforce/apex/AccountController.getSortedAccounts';

export default class AccountList extends LightningElement {
    accountName = '';
    industry = '';
    sortField = 'Name';
    sortOrder = 'ASC';
    accounts = [];

    industryOptions = [
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Apparel', value: 'Apparel' },
        { label: 'Banking', value: 'Banking' },
        { label: 'Construction', value: 'Construction' },
        { label: 'Energy', value: 'Energy' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Manufacturing', value: 'Manufacturing' },
        { label: 'Technology', value: 'Technology' },
        { label: 'Telecommunications', value: 'Telecommunications' },
        { label: 'Transportation', value: 'Transportation' }
    ];
    columns = [
        {
            label: 'Account Name',       // Column Header (Title)
            fieldName: 'Name',           // Field from Account object
            type: 'text',                // Type for displaying text
            sortable: true               // Makes the column sortable
        },
        {
            label: 'Industry',           // Column Header (Title)
            fieldName: 'Industry',       // Field from Account object
            type: 'text',                // Type for displaying text
            sortable: true               // Makes the column sortable
        },
        {
            label: 'Created Date',       // Column Header (Title)
            fieldName: 'CreatedDate',    // Field from Account object
            type: 'date',                // Type for displaying date
            typeAttributes: {
                year: "numeric",        // Format options for date
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short"   // Timezone format
            },
            sortable: true               // Makes the column sortable
        }
    ];

    @wire(getSortedAccounts, { 
        accountName: '$accountName', 
        industry: '$industry', 
        sortField: '$sortField', 
        sortOrder: '$sortOrder' 
    })
    accountsHandler({ data, error }) {
        if (data) {
            this.accounts = data;
            console.log(this.accounts); 
        } else if (error) {
            console.error(error);
        }
    }

    handleNameChange(event) {
        // this.accountName = '%' + event.target.value + '%';
        this.accountName = event.target.value ; 
        console.log(this.accountName); 
    }

    handleIndustryChange(event) {
        this.industry = event.target.value ;
        console.log(this.industry);
        // this.industry = '%' + event.target.value + '%';
    }

    handleSortChange(event) {
        const { field, order } = event.target.dataset;
        this.sortField = field;
        this.sortOrder = order;
    }
}