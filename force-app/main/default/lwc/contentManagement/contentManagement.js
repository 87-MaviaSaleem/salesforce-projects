import { LightningElement, track } from 'lwc';

export default class ContentManagement extends LightningElement {
  @track articles = [];
  @track title = '';
  @track content = '';
  @track editMode = false;
  editingId = null;

  // Getter to control button label
  get buttonLabel() {
    return this.editMode ? 'Update Article' : 'Create Article';
  }

  handleTitleChange(event) {
    this.title = event.target.value;
  }

  handleContentChange(event) {
    this.content = event.target.value;
  }

  saveArticle() {
    if (this.editMode) {
      const article = this.articles.find(a => a.id === this.editingId);
      article.title = this.title;
      article.content = this.content;
      this.editMode = false;
      this.editingId = null;
    } else {
      this.articles = [
        ...this.articles,
        { id: Date.now(), title: this.title, content: this.content }
      ];
    }
    this.clearForm();
  }

  editArticle(event) {
    const id = parseInt(event.target.dataset.id, 10);
    const article = this.articles.find(a => a.id === id);
    this.title = article.title;
    this.content = article.content;
    this.editMode = true;
    this.editingId = id;
  }

  deleteArticle(event) {
    const id = parseInt(event.target.dataset.id, 10);
    this.articles = this.articles.filter(article => article.id !== id);
  }

  clearForm() {
    this.title = '';
    this.content = '';
  }
}