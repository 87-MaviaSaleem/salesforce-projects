import { LightningElement } from 'lwc';

export default class LazyComponent extends LightningElement {
    renderedCallback() {
        console.log("hello");
        this.template.querySelector('.lazy-load').textContent = 'This is a lazily loaded component!';
    }
}