import { LightningElement } from 'lwc';

let debounceTimeout;

export default class MouseEventHandler extends LightningElement {
    message = 'Hover over the button or click it to see the effect!';
    tooltipMessage = 'I am a tooltip!';
    tooltipClass = 'tooltip-hidden';  // Initially hidden
    tooltipStyle = 'position: absolute;';

    handleClick() {
        this.message = 'Button was clicked!';
    }

    handleMouseEnter() {
        this.message = 'Mouse entered the button!';
        this.tooltipClass = 'tooltip-visible';  // Show tooltip when mouse enters
    }

    handleMouseLeave() {
        this.message = 'Mouse left the button!';
        this.tooltipClass = 'tooltip-hidden';  // Hide tooltip when mouse leaves
    }

    handleMouseMove(event) {
        // Debounce to avoid excessive updates while moving the mouse rapidly
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            // Update tooltip position based on mouse coordinates
            this.tooltipStyle = `position: absolute; top: ${event.clientY + 10}px; left: ${event.clientX + 10}px;`;
        }, 100); // Update every 100ms
    }
}