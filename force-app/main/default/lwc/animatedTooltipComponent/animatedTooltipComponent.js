import { LightningElement } from 'lwc';

export default class AnimatedTooltipComponent extends LightningElement {
    // State variables to manage tooltip visibility and message
    tooltipMessage = "This is a dynamic tooltip!";
    isTooltipVisible = false;

    // Getter for dynamically applying the tooltip class
    get tooltipClass() {
        return this.isTooltipVisible ? 'tooltip show' : 'tooltip';
    }

    // Method to show the tooltip when mouse enters the area
    showTooltip() {
        this.isTooltipVisible = true;
    }

    // Method to hide the tooltip when mouse leaves the area
    hideTooltip() {
        this.isTooltipVisible = false;
    }
}