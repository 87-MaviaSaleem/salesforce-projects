import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import VALIDATION_CHANNEL from '@salesforce/messageChannel/ValidationChannel__c';
import performValidation from '@salesforce/apex/ComplianceController.performValidation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ComplianceCheck extends LightningElement {
    @wire(MessageContext)
    messageContext;

    validationType = 'ComplianceCheck';

    handleValidate() {
        performValidation({ validationType: this.validationType })
            .then(result => {
                const message = {
                    messageType: 'ValidationResult',
                    source: 'ComplianceCheck',
                    validationType: this.validationType,
                    validationResults: result
                };
                publish(this.messageContext, VALIDATION_CHANNEL, message);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Validation Complete',
                        message: 'Compliance check completed.',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Validation Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}