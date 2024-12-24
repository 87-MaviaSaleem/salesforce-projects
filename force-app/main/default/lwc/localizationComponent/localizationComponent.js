import { LightningElement, track } from 'lwc';
//import enTranslations from '@salesforce/resourceUrl/enTranslations';
//import esTranslations from '@salesforce/resourceUrl/esTranslations';
//import frTranslations from '@salesforce/resourceUrl/frTranslations';
import { loadLanguageFile, getLocalizedText } from './localizationUtils';

export default class LocalizationComponent extends LightningElement {
    @track selectedLanguage = 'en';
    @track translations = {};
    @track languageOptions = [
        { label: 'English', value: 'en' },
        { label: 'French', value: 'fr' },
        { label: 'Spanish', value: 'es' }
    ];

    @track welcomeMessage;
    @track totalSales = 100000;
    @track totalCustomers = 500;
    @track totalSalesLabel;
    @track totalCustomersLabel;
    @track title;

    async connectedCallback() {
        await this.loadTranslations();
    }

    async loadTranslations() {
        this.translations = await loadLanguageFile(this.selectedLanguage);
        this.title = getLocalizedText('title', this.translations);
        this.welcomeMessage = getLocalizedText('welcomeMessage', this.translations);
        this.totalSalesLabel = getLocalizedText('totalSalesLabel', this.translations);
        this.totalCustomersLabel = getLocalizedText('totalCustomersLabel', this.translations);
    }

    async handleLanguageChange(event) {
        this.selectedLanguage = event.detail.value;
        await this.loadTranslations();
    }
}