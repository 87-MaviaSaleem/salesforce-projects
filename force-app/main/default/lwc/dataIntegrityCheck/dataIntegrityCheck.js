import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import validateData from '@salesforce/apex/ComplianceController.validateData';
import DATA_INTEGRITY_CHANNEL from '@salesforce/messageChannel/dataIntegrityChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DataIntegrityCheck extends LightningElement {
    @wire(MessageContext)
    messageContext;

    componentName = 'DataIntegrityCheck';

    handleValidate() {
        validateData()
            .then(result => {
                const message = {
                    messageType: 'ValidationResult',
                    source: this.componentName,
                    validationResults: result,
                    errors: result.errors
                };
                publish(this.messageContext, DATA_INTEGRITY_CHANNEL, message);

                if (result.isValid) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Validation Successful',
                            message: 'All data is valid.',
                            variant: 'success'
                        })
                    );
                } else {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Validation Errors Found',
                            message: 'Data integrity issues detected.',
                            variant: 'error'
                        })
                    );
                }
            })
            .catch(error => {
                // Handle unexpected errors
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}