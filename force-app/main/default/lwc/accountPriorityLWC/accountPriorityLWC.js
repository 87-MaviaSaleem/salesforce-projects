import { LightningElement } from 'lwc';
import runBatchJob from '@salesforce/apex/AccountBatchController.runBatchJob';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountPriorityLWC extends LightningElement {
    handleRunBatch() {
        runBatchJob()
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Batch job has been initiated.',
                    variant: 'success'
                }));
            })
            .catch(error => {
                console.error(error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                }));
            });
    }
}