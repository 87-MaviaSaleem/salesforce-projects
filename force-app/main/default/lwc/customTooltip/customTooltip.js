import { LightningElement } from 'lwc';

export default class CustomTooltip extends LightningElement {
    tooltipVisible = false;
    tooltipData = '';
    tooltipContent = '';

    // Data for product, graph, and medication info
    tooltipInfo = {
        product: 'Product description: A high-quality product with great value.',
        stock: 'Stock Price: $150, 10% increase today!',
        medication: 'Medication Info: Ibuprofen - Pain Relief.'
    };

    // Handle hover on product name (Scenario 1)
    handleMouseOver(event) {
        event.stopPropagation();
        event.preventDefault();
        this.tooltipData = this.tooltipInfo.product;
        this.tooltipVisible = true;
    }

    // Handle hover on graph points (Scenario 2)
    handleGraphHover(event) {
        event.stopPropagation();
        event.preventDefault();
        this.tooltipData = this.tooltipInfo.stock;
        this.tooltipVisible = true;
    }

    // Handle hover on medication name (Scenario 3)
    handleMedicationHover(event) {
        event.stopPropagation();
        event.preventDefault();
        this.tooltipContent = this.tooltipInfo.medication;
        this.tooltipVisible = true;
    }

    // Handle clicks on 'Add to Cart' and other buttons (Scenario 1)
    handleButtonClick(event) {
        if (event.target.classList.contains('add-to-cart')) {
            event.stopPropagation();
        }
    }

    // Handle clicks on links (Scenario 3)
    handleLinkClick(event) {
        if (event.target.tagName === 'A') {
            event.stopPropagation();
        }
    }

    // Close the tooltip if clicked outside the component
    handleClickOutside(event) {
        if (!this.template.contains(event.target)) {
            this.tooltipVisible = false; // Hide tooltip when clicking outside
        }
    }

    // Add event listeners on component mount
    connectedCallback() {
        document.addEventListener('click', this.handleClickOutside.bind(this));
    }

    // Clean up event listeners when component is removed
    disconnectedCallback() {
        document.removeEventListener('click', this.handleClickOutside.bind(this));
    }
}