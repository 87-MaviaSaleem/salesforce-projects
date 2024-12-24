import { LightningElement, track } from 'lwc';
import fetchServerData from '@salesforce/apex/DataController.fetchServerData';
import saveServerData from '@salesforce/apex/DataController.saveServerData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import lzStringResource from '@salesforce/resourceUrl/lzString';

export default class LocalStorageFallback extends LightningElement {
    @track data = [];
    @track isOnline = navigator.onLine;
    newItemName = '';
    currentPage = 1;
    pageSize = 20;

    connectedCallback() {
        // Add event listeners for online and offline events
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);

        // Load the LZString library
        loadScript(this, lzStringResource)
            .then(() => {
                // Library loaded successfully
                this.initializeData();
            })
            .catch(error => {
                console.error('Error loading LZString library:', error);
                this.showNotification('Error loading compression library.', 'error');
            });
    }

    disconnectedCallback() {
        // Remove event listeners
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
    }

    handleOnline = () => {
        this.isOnline = true;
        this.showNotification('You are back online.', 'info');
        // Sync local data with server
        this.syncData();
        // Fetch latest data from server
        this.fetchData(this.currentPage);
    }

    handleOffline = () => {
        this.isOnline = false;
        this.showNotification('You are offline. Data will be saved locally.', 'warning');
    }

    initializeData() {
        if (this.isOnline) {
            // Fetch data from server
            this.fetchData(this.currentPage);
        } else {
            // Load data from localStorage
            this.loadLocalData(this.currentPage);
        }
    }

    fetchData(page = 1) {
        fetchServerData({ pageNumber: page, pageSize: this.pageSize })
            .then(result => {
                this.data = result;
                // Compress and save current page data to localStorage
                const compressedData = window.LZString.compress(JSON.stringify(this.data));
                localStorage.setItem(`appDataPage${page}`, compressedData);
            })
            .catch(error => {
                this.showNotification('Error fetching data from server.', 'error');
                console.error('Fetch Error:', error);
            });
    }

    loadLocalData(page = 1) {
        const compressedData = localStorage.getItem(`appDataPage${page}`);
        if (compressedData) {
            const decompressedData = window.LZString.decompress(compressedData);
            this.data = JSON.parse(decompressedData);
        } else {
            this.data = [];
        }
    }

    saveData(newData) {
        if (this.isOnline) {
            // Save data to server
            saveServerData({ data: [newData] })
                .then(() => {
                    this.showNotification('Data saved successfully.', 'success');
                    this.fetchData(this.currentPage);
                })
                .catch(error => {
                    this.showNotification('Error saving data to server.', 'error');
                    console.error('Save Error:', error);
                });
        } else {
            // Save data to localStorage with compression
            this.data.push(newData);
            const compressedData = window.LZString.compress(JSON.stringify(this.data));
            try {
                localStorage.setItem(`appDataPage${this.currentPage}`, compressedData);
                this.showNotification('You are offline. Data saved locally.', 'info');
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    this.handleQuotaExceededError(e);
                } else {
                    console.error('Storage Error:', e);
                }
            }
        }
    }

    syncData() {
        // Iterate over stored pages and sync data
        for (let page = 1; ; page++) {
            const compressedData = localStorage.getItem(`appDataPage${page}`);
            if (!compressedData) {
                break; // No more pages to sync
            }
            const decompressedData = window.LZString.decompress(compressedData);
            const unsyncedData = JSON.parse(decompressedData);
            saveServerData({ data: unsyncedData })
                .then(() => {
                    localStorage.removeItem(`appDataPage${page}`);
                    this.showNotification(`Page ${page} data synced with server.`, 'success');
                })
                .catch(error => {
                    this.showNotification(`Error syncing page ${page} data with server.`, 'error');
                    console.error(`Sync Error on page ${page}:`, error);
                });
        }
    }

    handleQuotaExceededError(error) {
        this.showNotification('Local storage limit exceeded. Unable to save data.', 'error');
        console.error('Quota Exceeded Error:', error);
        // Optionally prompt user to clear data or increase storage
    }

    handleInputChange(event) {
        this.newItemName = event.target.value;
    }

    handleAddItem() {
        if (this.newItemName.trim() === '') {
            this.showNotification('Item name cannot be empty.', 'warning');
            return;
        }

        const newItem = {
            id: Date.now(),
            name: this.newItemName,
        };

        this.saveData(newItem);
        this.newItemName = '';
    }

    handleNextPage() {
        this.currentPage++;
        if (this.isOnline) {
            this.fetchData(this.currentPage);
        } else {
            this.loadLocalData(this.currentPage);
        }
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            if (this.isOnline) {
                this.fetchData(this.currentPage);
            } else {
                this.loadLocalData(this.currentPage);
            }
        }
    }

    handleClearOfflineData() {
        // Remove all items related to offline data from localStorage
        for (let key in localStorage) {
            if (key.startsWith('appDataPage')) {
                localStorage.removeItem(key);
            }
        }
        this.showNotification('Offline data cleared.', 'success');
    }

    showNotification(message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Notification',
                message: message,
                variant: variant,
            })
        );
    }
}