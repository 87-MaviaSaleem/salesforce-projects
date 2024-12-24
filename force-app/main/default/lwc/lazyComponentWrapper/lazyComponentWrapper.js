import { LightningElement } from 'lwc'; 
export default class LazyComponentWrapper extends LightningElement {
    lazyLoaded = false;

    handleButtonClick() {
        // Set lazyLoaded flag to true when the button is clicked
        this.lazyLoaded = true;
    }
}