import { LightningElement, track, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductList extends LightningElement {
    @track products = [];
    @track isLoading = false;
    @track error = null;
    filterValue = '';

    @wire(getProducts, { filter: '$filterValue' })
    wiredProducts({ data, error }) {
        this.isLoading = true;
        if (data) {
            this.products = data;
            this.error = null;
        } else if (error) {
            this.error = error.body.message;
            this.products = [];
        }
        this.isLoading = false;
    }

    handleFilterChange(event) {
        this.filterValue = event.detail.filterValue;
    }

    handleProductClick(event) {
        const productId = event.currentTarget.dataset.id;
        const selectedProduct = this.products.find((product) => product.Id === productId);
    
        // Pass the selected product to the modal
        const modal = this.template.querySelector('c-product-detail-modal');
        if (modal) {
            modal.openModal(selectedProduct);
        }
    }
    
    

   
}