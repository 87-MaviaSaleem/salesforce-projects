// dataImport.js
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DataImport extends LightningElement {
    file;
    progress = 0;
    isImporting = false;

    handleFileChange(event) {
        const fileInput = this.template.querySelector('.file-input');
        this.file = fileInput.files[0];
    }

    handleUpload() {
        if (this.file) {
            this.isImporting = true;
            this.progress = 0;
            this.importData();
        } else {
            this.showToast('Error', 'No file selected.', 'error');
        }
    }

    importData() {
        let interval = setInterval(() => {
            this.progress += 10;
            if (this.progress >= 100) {
                clearInterval(interval);
                this.isImporting = false;
                this.showToast('Success', 'File uploaded and processed successfully.', 'success');
            }
        }, 500);
    }

    handleCancel() {
        this.isImporting = false;
        this.progress = 0;
        this.showToast('Info', 'Import process cancelled.', 'info');
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}