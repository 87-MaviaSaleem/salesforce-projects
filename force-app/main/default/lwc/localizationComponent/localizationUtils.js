//import { loadScript } from 'lightning/platformResourceLoader';
import EN_TRANSLATIONS from '@salesforce/resourceUrl/enTranslations';
import FR_TRANSLATIONS from '@salesforce/resourceUrl/frTranslations';
import ES_TRANSLATIONS from '@salesforce/resourceUrl/esTranslations';

export async function loadLanguageFile(languageCode) {
    switch (languageCode) {
        case 'en':
            return fetch(EN_TRANSLATIONS).then(response => response.json());
        case 'fr':
            return fetch(FR_TRANSLATIONS).then(response => response.json());
        case 'es':
            return fetch(ES_TRANSLATIONS).then(response => response.json());
        default:
            return fetch(EN_TRANSLATIONS).then(response => response.json());  // Fallback to English
    }
}

export function getLocalizedText(key, translations) {
    return translations[key] || key;  // Return key if translation is missing
}