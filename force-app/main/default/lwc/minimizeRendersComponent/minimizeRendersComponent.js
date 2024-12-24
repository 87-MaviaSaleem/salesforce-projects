import { LightningElement, api, track } from 'lwc';

export default class MinimizeRendersComponent extends LightningElement {
    _items = [];
    @track visibleItems = [];
    @track scrollTop = 0;

    itemHeight = 50; // Fixed height for each item
    containerHeight = 400; // Height of the scrolling container

    @api
    get items() {
        return this._items;
    }
    set items(value) {
        if (JSON.stringify(value) !== JSON.stringify(this._items)) {
            this._items = value ? [...value] : [];
            this.updateVisibleItems(); // Recalculate visible items when items change
        }
    }

    // Style for the overall list height
    get listHeightStyle() {
        return `height: ${this._items.length * this.itemHeight}px; position: relative;`;
    }

    // Lifecycle hooks
    connectedCallback() {
        this.updateVisibleItems();
    }

    renderedCallback() {
        this.updateVisibleItems();
    }

    // Calculate visible items with precomputed styles
    updateVisibleItems() {
        const startIndex = Math.floor(this.scrollTop / this.itemHeight);
        const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
        const endIndex = startIndex + visibleCount;

        this.visibleItems = this._items.slice(startIndex, endIndex).map((item, index) => ({
            ...item,
            style: `position: absolute; top: ${(startIndex + index) * this.itemHeight}px; height: ${this.itemHeight}px; width: 100%;`
        }));
    }

    handleScroll(event) {
        this.scrollTop = event.target.scrollTop;
        this.updateVisibleItems();
    }
}