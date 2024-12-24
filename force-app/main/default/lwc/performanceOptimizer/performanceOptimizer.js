import { LightningElement } from 'lwc';

export default class PerformanceOptimizer extends LightningElement {
    productList = [
        { 
            id: 1, 
            name: 'Product 1', 
            imageUrl: 'https://png.pngitem.com/pimgs/s/43-434027_product-beauty-skin-care-personal-care-liquid-tree.png', 
            description: 'This is a detailed description of Product 1.'
        },
        { 
            id: 2, 
            name: 'Product 2', 
            imageUrl: 'https://png.pngitem.com/pimgs/s/43-434027_product-beauty-skin-care-personal-care-liquid-tree.png', 
            description: 'This is a detailed description of Product 2.'
        },
        { 
            id: 3, 
            name: 'Product 3', 
            imageUrl: 'https://png.pngitem.com/pimgs/s/43-434027_product-beauty-skin-care-personal-care-liquid-tree.png', 
            description: 'This is a detailed description of Product 3.'
        }
    ];

    isModalOpen = false;
    selectedProduct = null;

    // Throttle function to limit the rate of function execution
    throttle(func, limit) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), limit);
        };
    }

    handleMouseEvent(event) {
        const productId = event.target.dataset.id;
        
        // Throttle the logging
        this.throttle(() => {
            if (event.type === 'mouseenter') {
                console.log(`Mouse entered Product ID: ${productId}`);
            } else if (event.type === 'mouseleave') {
                console.log(`Mouse left Product ID: ${productId}`);
            }
        }, 200)();
    }

    openModal(event) {
        const productId = event.target.dataset.id;
        this.selectedProduct = this.productList.find(product => product.id === parseInt(productId));
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedProduct = null;
    }

    stopPropagation(event) {
        event.stopPropagation(); // Prevent the overlay from closing the modal when clicked inside the modal
    }
}