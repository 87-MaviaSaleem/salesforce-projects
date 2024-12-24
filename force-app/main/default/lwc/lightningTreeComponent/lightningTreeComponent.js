import { LightningElement, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

// Import Apex methods
import getAllParentAccounts from "@salesforce/apex/AccountOpportunityController.getAllParentAccounts";
import getChildOpportunities from "@salesforce/apex/AccountOpportunityController.getChildOpportunities";

// Define columns for the tree grid
const COLS = [
    { fieldName: "Name", label: "Account/Opportunity Name" },
    { fieldName: "Type", label: "Type" },
    { fieldName: "StageOrIndustry", label: "Stage/Industry" }
];

export default class LightningTreeComponent extends LightningElement {
    @track gridColumns = COLS; // Tree grid columns
    @track gridData = []; // Original grid data
    @track filteredGridData = []; // Filtered data for search
    @track isLoading = true; // Loading indicator
    @track searchTerm = ""; // Search term input
    @track error = null; // Error state

    // Fetch Parent Accounts
    @wire(getAllParentAccounts)
    parentAccounts({ error, data }) {
        if (error) {
            this.error = error;
            console.error("Error fetching parent accounts:", error);
            this.showToast("Error", "Failed to load accounts.", "error");
        } else if (data) {
            this.gridData = data.map((account) => ({
                id: account.Id,
                Name: account.Name,
                Type: account.Type,
                StageOrIndustry: account.Industry,
                _children: null // Placeholder for lazy loading
            }));
            this.filteredGridData = [...this.gridData]; // Initialize filtered data
            this.isLoading = false;
        }
    }

    // Handle row expansion to fetch child Opportunities dynamically
    handleOnToggle(event) {
        const rowId = event.detail.name; // Expanded row ID
        const isExpanded = event.detail.isExpanded; // Check if expanded

        if (isExpanded) {
            const expandedRow = this.gridData.find((row) => row.id === rowId);

            // Fetch child opportunities only if not already loaded
            if (expandedRow && expandedRow._children === null) {
                this.isLoading = true;
                getChildOpportunities({ accountId: rowId })
                    .then((opportunities) => {
                        if (opportunities && opportunities.length > 0) {
                            const childRows = opportunities.map((opp) => ({
                                id: opp.Id,
                                Name: opp.Name,
                                Type: opp.Type,
                                StageOrIndustry: opp.StageName,
                                _children: [] // No further children
                            }));
                            expandedRow._children = childRows;
                            this.filteredGridData = [...this.gridData]; // Refresh filtered data
                        } else {
                            this.showToast(
                                "Info",
                                "No opportunities found for this account.",
                                "info"
                            );
                        }
                    })
                    .catch((error) => {
                        console.error("Error loading opportunities:", error);
                        this.showToast("Error", "Failed to load opportunities.", "error");
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            }
        }
    }

    // Handle search input
    handleSearch(event) {
        this.searchTerm = event.target.value.toLowerCase();

        if (this.searchTerm) {
            this.filteredGridData = this.filterTreeData(this.gridData, this.searchTerm);
        } else {
            this.filteredGridData = [...this.gridData]; // Reset to original data
        }
    }

    // Recursive filtering of tree data by name
    filterTreeData(data, searchTerm) {
        return data
            .map((row) => {
                const matches = row.Name.toLowerCase().includes(searchTerm);
                let filteredChildren = [];

                if (row._children && row._children.length > 0) {
                    filteredChildren = this.filterTreeData(row._children, searchTerm);
                }

                if (matches || filteredChildren.length > 0) {
                    return {
                        ...row,
                        _children: filteredChildren
                    };
                }

                return null; // Exclude non-matching rows
            })
            .filter((row) => row !== null);
    }

    // Show toast notifications
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}