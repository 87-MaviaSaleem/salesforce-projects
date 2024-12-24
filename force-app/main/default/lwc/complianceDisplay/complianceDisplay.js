import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import VALIDATION_CHANNEL from '@salesforce/messageChannel/ValidationChannel__c';

export default class ComplianceDisplay extends LightningElement {
    @wire(MessageContext)
    messageContext;

    validationType = 'ComplianceCheck';
    @track validationResults;
    subscription = null;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                VALIDATION_CHANNEL,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        if (
            message.messageType === 'ValidationResult' &&
            message.validationType === this.validationType
        ) {
            // Process validation result
            this.validationResults = message.validationResults;
        }
    }
}