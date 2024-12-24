import { LightningElement, track } from 'lwc';

export default class PostCreation extends LightningElement {
    @track isModalOpen = false; // Controls modal visibility
    @track isEmojiPickerOpen = false; // Controls emoji picker visibility
    postContent = ''; // Holds content typed in the post field

    // Open the post modal
    openModal() {
        this.isModalOpen = true;
    }

    // Close the post modal
    closeModal() {
        this.isModalOpen = false;
    }

    // Handle input in the post text area
    handleInputChange(event) {
        this.postContent = event.target.value;
    }

    // Toggle emoji picker visibility
    toggleEmojiPicker() {
        this.isEmojiPickerOpen = !this.isEmojiPickerOpen;
    }

    // Add emoji to the post content
    addEmoji(event) {
        this.postContent += event.target.textContent;
        this.isEmojiPickerOpen = false; // Close the emoji picker after selection
    }

    // Handle media option selection (photo, video, etc.)
    handleAddPhoto() {
        // Add logic for adding photo
    }

    handleAddVideo() {
        // Add logic for adding video
    }

    handleAddLocation() {
        // Add logic for adding location
    }

    handleMoreOptions() {
        // Handle additional options (like polls, tags, etc.)
    }

    // Handle the boost toggle
    handleBoostToggle(event) {
        // Handle boost post toggle logic here
    }

    // Handle post submission
    handlePost() {
        console.log('Post Content:', this.postContent);
        // Add your post submission logic here
    }
}