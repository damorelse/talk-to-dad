import { DEFAULT_CARDS } from '../db/defaultData.js';
export const AAC_CORE_VOCABULARY = [
    // Top starters & emergency words
    { word: 'I', weight: 100 },
    { word: 'Please', weight: 95 },
    { word: 'Help', weight: 95 },
    { word: 'Yes', weight: 95 },
    { word: 'No', weight: 95 },
    { word: 'Thank you', weight: 95 },
    { word: 'Water', weight: 90 },
    { word: 'Pain', weight: 90 },
    { word: 'Bathroom', weight: 90 },
    { word: 'Want', weight: 88 },
    { word: 'Need', weight: 88 },
    { word: 'Medicine', weight: 85 },
    { word: 'Doctor', weight: 85 },
    { word: 'Tired', weight: 85 },
    { word: 'Hungry', weight: 85 },
    { word: 'Thirsty', weight: 85 },
    { word: 'Love', weight: 85 },
    { word: 'More', weight: 82 },
    { word: 'Stop', weight: 82 },
    { word: 'Wait', weight: 82 },
    // Pronouns & Questions
    { word: 'Me', weight: 80 },
    { word: 'You', weight: 80 },
    { word: 'We', weight: 75 },
    { word: 'What', weight: 75 },
    { word: 'Where', weight: 75 },
    { word: 'When', weight: 70 },
    { word: 'Why', weight: 70 },
    { word: 'How', weight: 70 },
    // Verbs
    { word: 'Go', weight: 80 },
    { word: 'Eat', weight: 80 },
    { word: 'Drink', weight: 80 },
    { word: 'Sleep', weight: 78 },
    { word: 'Rest', weight: 78 },
    { word: 'Sit', weight: 75 },
    { word: 'Stand', weight: 75 },
    { word: 'Walk', weight: 75 },
    { word: 'See', weight: 75 },
    { word: 'Feel', weight: 75 },
    { word: 'Like', weight: 75 },
    { word: 'Have', weight: 75 },
    { word: 'Call', weight: 72 },
    { word: 'Listen', weight: 70 },
    { word: 'Open', weight: 70 },
    { word: 'Close', weight: 70 },
    // Objects & Daily nouns
    { word: 'Glasses', weight: 78 },
    { word: 'Blanket', weight: 78 },
    { word: 'Pillow', weight: 75 },
    { word: 'Telephone', weight: 75 },
    { word: 'Music', weight: 75 },
    { word: 'Television', weight: 72 },
    { word: 'Book', weight: 70 },
    { word: 'Coffee', weight: 75 },
    { word: 'Tea', weight: 70 },
    { word: 'Bed', weight: 75 },
    { word: 'Chair', weight: 75 },
    { word: 'Home', weight: 80 },
    { word: 'Family', weight: 80 },
    { word: 'Daughter', weight: 75 },
    { word: 'Son', weight: 75 },
    { word: 'Wife', weight: 75 },
    { word: 'Husband', weight: 75 },
    // Feelings & Descriptors
    { word: 'Good', weight: 80 },
    { word: 'Bad', weight: 78 },
    { word: 'Happy', weight: 78 },
    { word: 'Sad', weight: 70 },
    { word: 'Cold', weight: 78 },
    { word: 'Hot', weight: 78 },
    { word: 'Dizzy', weight: 75 },
    { word: 'Numb', weight: 72 },
    { word: 'Hurt', weight: 80 },
    { word: 'Better', weight: 75 },
    { word: 'Again', weight: 72 },
    { word: 'Okay', weight: 80 },
];
/**
 * Extracts and weights vocabulary items from AAC cards.
 */
export function extractVocabularyFromCards(cards) {
    const map = new Map();
    // 1. Seed with core high-frequency starters
    for (const item of AAC_CORE_VOCABULARY) {
        map.set(item.word.toLowerCase(), { ...item });
    }
    // 2. Extract words and phrases from cards
    for (const card of cards) {
        const favoriteBonus = card.isFavorite ? 10 : 0;
        // A. Card Label (e.g. "Rest / Nap", "Go for a Walk", "Water")
        if (card.label) {
            const parts = card.label.split('/').map(p => p.trim()).filter(Boolean);
            for (const part of parts) {
                const cleanPart = part.replace(/[^\w\s'-]/g, '').trim();
                if (cleanPart && cleanPart.length > 0) {
                    const lower = cleanPart.toLowerCase();
                    const baseWeight = 86 + favoriteBonus;
                    const existing = map.get(lower);
                    if (!existing || existing.weight < baseWeight) {
                        map.set(lower, {
                            word: cleanPart,
                            weight: baseWeight,
                            category: card.categoryId,
                        });
                    }
                    // Individual words within multi-word label
                    const words = cleanPart.split(/\s+/);
                    if (words.length > 1) {
                        for (const w of words) {
                            const cleanW = w.trim();
                            if (cleanW.length > 1) {
                                const lowerW = cleanW.toLowerCase();
                                const wordWeight = 80 + favoriteBonus;
                                const existingW = map.get(lowerW);
                                if (!existingW || existingW.weight < wordWeight) {
                                    map.set(lowerW, {
                                        word: cleanW,
                                        weight: wordWeight,
                                        category: card.categoryId,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        // B. Words from spokenText (e.g. "I would like some water, please.")
        if (card.spokenText) {
            const tokens = card.spokenText.split(/\s+/);
            for (const t of tokens) {
                const cleanToken = t.replace(/[^\w'-]/g, '').trim();
                if (cleanToken.length > 1) {
                    const lower = cleanToken.toLowerCase();
                    const tokenWeight = 75 + favoriteBonus;
                    const existing = map.get(lower);
                    if (!existing || existing.weight < tokenWeight) {
                        const formatted = cleanToken.charAt(0).toUpperCase() + cleanToken.slice(1).toLowerCase();
                        map.set(lower, {
                            word: formatted,
                            weight: tokenWeight,
                            category: card.categoryId,
                        });
                    }
                }
            }
        }
        // C. Words from clue (e.g. "You drink this when you are thirsty.")
        if (card.clue) {
            const tokens = card.clue.split(/\s+/);
            for (const t of tokens) {
                const cleanToken = t.replace(/[^\w'-]/g, '').trim();
                if (cleanToken.length > 2) {
                    const lower = cleanToken.toLowerCase();
                    const tokenWeight = 70 + favoriteBonus;
                    const existing = map.get(lower);
                    if (!existing || existing.weight < tokenWeight) {
                        const formatted = cleanToken.charAt(0).toUpperCase() + cleanToken.slice(1).toLowerCase();
                        map.set(lower, {
                            word: formatted,
                            weight: tokenWeight,
                            category: card.categoryId,
                        });
                    }
                }
            }
        }
    }
    return Array.from(map.values());
}
export class WordPredictor {
    vocabulary;
    topStarters = [];
    customWeights = new Map();
    constructor(initialCards = DEFAULT_CARDS) {
        this.vocabulary = this.processVocab(extractVocabularyFromCards(initialCards));
    }
    processVocab(items) {
        const processed = items.map(item => ({
            word: item.word,
            lower: item.word.toLowerCase(),
            weight: item.weight,
        }));
        // Sort descending by base weight
        processed.sort((a, b) => b.weight - a.weight);
        this.topStarters = processed.slice(0, 10).map(i => i.word);
        return processed;
    }
    /**
     * Dynamically loads or updates vocabulary from AAC cards.
     */
    loadCards(cards) {
        if (cards && cards.length > 0) {
            this.vocabulary = this.processVocab(extractVocabularyFromCards(cards));
        }
    }
    /**
     * Predicts top candidate words based on the current user typing prefix and AAC cards.
     */
    predict(prefix, maxResults = 6, cards) {
        if (cards && cards.length > 0) {
            this.loadCards(cards);
        }
        const trimmed = prefix.trim();
        if (!trimmed) {
            if (this.customWeights.size === 0) {
                return this.topStarters.slice(0, maxResults);
            }
            const starters = [...this.vocabulary];
            starters.sort((a, b) => {
                const weightA = (this.customWeights.get(a.lower) || 0) + a.weight;
                const weightB = (this.customWeights.get(b.lower) || 0) + b.weight;
                return weightB - weightA;
            });
            return starters.slice(0, maxResults).map(item => item.word);
        }
        const lowerPrefix = trimmed.toLowerCase();
        const isFirstUpper = /^[A-Z]/.test(trimmed);
        const isAllUpper = /^[A-Z]+$/.test(trimmed) && trimmed.length > 1;
        let selectedItems = [];
        if (this.customWeights.size === 0) {
            // Vocabulary is pre-sorted by weight descending; collect first maxResults matches directly
            for (let i = 0; i < this.vocabulary.length; i++) {
                const item = this.vocabulary[i];
                if (item.lower.startsWith(lowerPrefix)) {
                    selectedItems.push(item);
                    if (selectedItems.length >= maxResults)
                        break;
                }
            }
        }
        else {
            const matches = [];
            for (let i = 0; i < this.vocabulary.length; i++) {
                const item = this.vocabulary[i];
                if (item.lower.startsWith(lowerPrefix)) {
                    matches.push(item);
                }
            }
            matches.sort((a, b) => {
                const weightA = (this.customWeights.get(a.lower) || 0) + a.weight;
                const weightB = (this.customWeights.get(b.lower) || 0) + b.weight;
                return weightB - weightA;
            });
            selectedItems = matches.slice(0, maxResults);
        }
        return selectedItems.map(item => {
            let word = item.word;
            if (isAllUpper) {
                word = word.toUpperCase();
            }
            else if (isFirstUpper) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            else {
                word = word.toLowerCase();
            }
            return word;
        });
    }
    /**
     * Increases weight of used words for personalized dynamic prediction.
     */
    recordUsage(word) {
        const lower = word.trim().toLowerCase();
        const current = this.customWeights.get(lower) || 0;
        this.customWeights.set(lower, current + 5);
    }
}
export const wordPredictor = new WordPredictor();
