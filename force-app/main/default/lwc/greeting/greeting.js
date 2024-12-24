import { LightningElement } from 'lwc';

export default class Greeting extends LightningElement {
    name = 'World';

    changeName() {
        this.name = 'Salesforce';
    }
}