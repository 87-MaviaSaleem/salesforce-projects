import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import DATA_INTEGRITY_CHANNEL from '@salesforce/messageChannel/dataIntegrityChannel__c';

export default class DataIntegrityDisplay extends LightningElement {
    @wire(MessageContext)
    messageContext;

    @track validationResults;
    @track errors;
    subscription = null;
    componentName = 'DataIntegrityDisplay';

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                DATA_INTEGRITY_CHANNEL,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        if (message.source !== this.componentName && message.messageType === 'ValidationResult') {
            this.validationResults = message.validationResults;
            this.errors = message.errors;
        }
    }
}