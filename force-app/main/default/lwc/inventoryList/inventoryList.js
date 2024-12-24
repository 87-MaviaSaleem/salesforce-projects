import { LightningElement, wire, track } from 'lwc';
import getInventory from '@salesforce/apex/InventoryController.getInventory';
import updateInventoryStock from '@salesforce/apex/InventoryController.updateInventoryStock';
import { refreshApex } from '@salesforce/apex';

export default class InventoryList extends LightningElement {
    @track inventoryData;
    @track error;
    stockUpdates = {};
    wiredResult;

    @wire(getInventory)
    wiredInventory(result) {
        this.wiredResult = result;
        if (result.data) {
            this.inventoryData = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body.message;
        }
    }

    handleInputChange(event) {
        const itemId = event.target.dataset.id;
        this.stockUpdates[itemId] = event.target.value;
    }

    async updateStock(event) {
        const itemId = event.target.dataset.id;
        const newStockLevel = this.stockUpdates[itemId];
        if (newStockLevel) {
            try {
                await updateInventoryStock({ inventoryId: itemId, stockLevel: parseInt(newStockLevel, 10) });
                this.dispatchEvent(new CustomEvent('stockupdated', { detail: itemId }));
                await refreshApex(this.wiredResult);
            } catch (error) {
                this.error = error.body.message;
            }
        }
    }
}