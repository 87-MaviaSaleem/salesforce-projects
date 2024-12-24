import { LightningElement, track } from 'lwc';

export default class NewsFeed extends LightningElement {
    @track articleOptions = [
        { label: 'Tech News', value: 'techNews' },
        { label: 'Sports News', value: 'sportsNews' },
        { label: 'Business News', value: 'businessNews' },
    ];

    @track selectedArticle = '';
    @track selectedArticleContent = null;

    handleArticleChange(event) {
        this.selectedArticle = event.detail.value;
        this.loadArticle(this.selectedArticle);
    }

    async loadArticle(article) {
        try {
            // Dynamically import the article content based on selection
            if (article === 'techNews') {
             //   const { default: techNewsContent } = await import('./techNews.js');
                this.selectedArticleContent = techNewsContent;
            } else if (article === 'sportsNews') {
             //   const { default: sportsNewsContent } = await import('./sportsNews.js');
                this.selectedArticleContent = sportsNewsContent;
            } else if (article === 'businessNews') {
              //  const { default: businessNewsContent } = await import('./businessNews.js');
                this.selectedArticleContent = businessNewsContent;
            }
        } catch (error) {
            console.error('Error loading article:', error);
        }
    }
}