import { LightningElement, api, track } from 'lwc';

export default class ProductDetailModal extends LightningElement {
    @api selectedProduct = {};
    @track isModalOpen = false;

    @api
    openModal(product) {
        this.selectedProduct = product;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }
}