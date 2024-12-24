import { LightningElement, wire, track } from 'lwc';
import searchProducts from '@salesforce/apex/ProductSearchController.searchProducts';
import getCategories from '@salesforce/apex/ProductSearchController.getCategories';

export default class ProductSearch extends LightningElement {
    searchTerm = '';
    selectedCategory = '';
    products = [];
    noResults = false;
    error;
    currentPage = 1;            // Current page for pagination
    pageSize = 10;              // Number of products per page
    totalProducts = 0;          // Total number of products in the database
    isFirstPage = true;         // Flag to disable "Previous" button on the first page
    isLastPage = false;         // Flag to disable "Next" button on the last page
    @track categoryOptions = []; // To store category options for the combobox

    // Wire service to fetch categories from Apex
    @wire(getCategories)
    wiredCategories({ data, error }) {
        if (data) {
            // Mapping category data for the combobox
            this.categoryOptions = data.map(category => ({
                label: category.Name,
                value: category.Name
            }));
        } else if (error) {
            this.error = error.body.message;
        }
    }

    // Handle changes in the search term
    handleSearchChange(event) {
        this.searchTerm = event.target.value;
    }

    // Handle changes in the selected category
    handleCategoryChange(event) {
        this.selectedCategory = event.target.value;
    }

    // Trigger the search when the "Search" button is clicked
    handleSearchClick() {
        this.currentPage = 1;  // Reset to the first page on a new search
        this.searchProductsFromServer();
    }

    // Search for products from the server, handling pagination
    searchProductsFromServer() {
        searchProducts({
            searchTerm: '%' + this.searchTerm + '%',
            categoryId: this.selectedCategory,
            pageNumber: this.currentPage,
            pageSize: this.pageSize
        })
            .then((result) => {
                this.products = result.products;
                this.totalProducts = result.totalRecords;
                this.noResults = this.products.length === 0; // Check for no results
                this.isFirstPage = this.currentPage === 1;   // Disable "Previous" if on first page
                this.isLastPage = this.currentPage * this.pageSize >= this.totalProducts; // Disable "Next" if on last page
                this.error = undefined;
            })
            .catch((error) => {
                this.products = [];
                this.noResults = false;
                this.error = error.body.message;
            });
    }

    // Handle the "Next" button click (move to the next page)
    handleNextPage() {
        this.currentPage++;
        this.searchProductsFromServer();
    }

    // Handle the "Previous" button click (move to the previous page)
    handlePreviousPage() {
        this.currentPage--;
        this.searchProductsFromServer();
    }

    // Optional: For product detail view (expand with actual logic)
    viewProductDetail(event) {
        const productName = event.target.text;
        alert('Product details for: ' + productName);
    }
}