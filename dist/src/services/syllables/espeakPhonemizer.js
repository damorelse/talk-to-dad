/**
 * eSpeak NG Grapheme-to-Phoneme (G2P) & Canonical IPA Phonemizer Engine
 *
 * Derives canonical IPA phoneme sequences from words, explicitly preserves syllable
 * boundaries, and maps individual phonemes to their respective syllables for Piper TTS synthesis.
 */
import { CANONICAL_PHONEME_DICTIONARY } from './phonemeDictionary.js';
import { splitWordIntoSyllables } from './syllableSplitter.js';
// Suffixes and rules influencing English stress positioning
const PENULTIMATE_STRESS_SUFFIXES = ['tion', 'sion', 'ic', 'ical', 'ity', 'ian', 'ious', 'graphy', 'ology'];
const UNSTRESSED_PREFIXES = ['re', 'de', 'be', 'a', 'un', 'in', 'ex', 'con', 'dis', 'pro', 'pre', 'mis', 'non'];
/**
 * Phonemizes a single grapheme syllable string into IPA phoneme tokens.
 */
export function phonemizeGraphemeSyllable(syllableText, isPrimaryStressed, isSecondaryStressed, isFinalSyllable, _totalSyllables) {
    const clean = syllableText.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) {
        return { ipa: '', phonemes: [] };
    }
    const phonemes = [];
    let i = 0;
    while (i < clean.length) {
        const two = clean.slice(i, i + 2);
        const three = clean.slice(i, i + 3);
        const char = clean[i];
        // Three-letter graphemes
        if (three === 'tch') {
            phonemes.push('tʃ');
            i += 3;
            continue;
        }
        if (three === 'igh') {
            phonemes.push('aɪ');
            i += 3;
            continue;
        }
        // Two-letter graphemes (Digraphs)
        if (two === 'ph') {
            phonemes.push('f');
            i += 2;
            continue;
        }
        if (two === 'th') {
            phonemes.push('θ');
            i += 2;
            continue;
        }
        if (two === 'sh') {
            phonemes.push('ʃ');
            i += 2;
            continue;
        }
        if (two === 'ch') {
            phonemes.push('tʃ');
            i += 2;
            continue;
        }
        if (two === 'ck') {
            phonemes.push('k');
            i += 2;
            continue;
        }
        if (two === 'ng') {
            phonemes.push('ŋ');
            i += 2;
            continue;
        }
        if (two === 'qu') {
            phonemes.push('k');
            phonemes.push('w');
            i += 2;
            continue;
        }
        if (two === 'wh') {
            phonemes.push('w');
            i += 2;
            continue;
        }
        if (two === 'wr') {
            phonemes.push('ɹ');
            i += 2;
            continue;
        }
        if (two === 'kn') {
            phonemes.push('n');
            i += 2;
            continue;
        }
        if (two === 'dg') {
            phonemes.push('dʒ');
            i += 2;
            continue;
        }
        if (two === 'ee' || two === 'ea') {
            phonemes.push('iː');
            i += 2;
            continue;
        }
        if (two === 'oo') {
            phonemes.push('uː');
            i += 2;
            continue;
        }
        if (two === 'ai' || two === 'ay') {
            phonemes.push('eɪ');
            i += 2;
            continue;
        }
        if (two === 'ou' || two === 'ow') {
            phonemes.push('aʊ');
            i += 2;
            continue;
        }
        if (two === 'oi' || two === 'oy') {
            phonemes.push('ɔɪ');
            i += 2;
            continue;
        }
        if (two === 'oa') {
            phonemes.push('oʊ');
            i += 2;
            continue;
        }
        if (two === 'ar') {
            phonemes.push('ɑː');
            phonemes.push('ɹ');
            i += 2;
            continue;
        }
        if (two === 'or') {
            phonemes.push('ɔː');
            phonemes.push('ɹ');
            i += 2;
            continue;
        }
        if (two === 'er' || two === 'ir' || two === 'ur') {
            phonemes.push(isPrimaryStressed ? 'ɜː' : 'ə');
            phonemes.push('ɹ');
            i += 2;
            continue;
        }
        // Single letters
        switch (char) {
            case 'a':
                if (isPrimaryStressed) {
                    phonemes.push('æ');
                }
                else {
                    phonemes.push('ə');
                }
                break;
            case 'e':
                if (isPrimaryStressed) {
                    phonemes.push('ɛ');
                }
                else if (isFinalSyllable && i === clean.length - 1 && clean.length > 1) {
                    // Silent e at end of syllable (unless 1 char syllable)
                    // omit
                }
                else {
                    phonemes.push('ə');
                }
                break;
            case 'i':
                if (isPrimaryStressed) {
                    phonemes.push('ɪ');
                }
                else {
                    phonemes.push('ɪ');
                }
                break;
            case 'o':
                if (isPrimaryStressed) {
                    phonemes.push('ɑː');
                }
                else {
                    phonemes.push('ə');
                }
                break;
            case 'u':
                if (isPrimaryStressed) {
                    phonemes.push('ʌ');
                }
                else {
                    phonemes.push('ə');
                }
                break;
            case 'y':
                if (isFinalSyllable && i === clean.length - 1) {
                    phonemes.push('i');
                }
                else if (isPrimaryStressed) {
                    phonemes.push('aɪ');
                }
                else {
                    phonemes.push('ɪ');
                }
                break;
            case 'b':
                phonemes.push('b');
                break;
            case 'c':
                // Soft c before e, i, y
                if (['e', 'i', 'y'].includes(clean[i + 1])) {
                    phonemes.push('s');
                }
                else {
                    phonemes.push('k');
                }
                break;
            case 'd':
                phonemes.push('d');
                break;
            case 'f':
                phonemes.push('f');
                break;
            case 'g':
                // Soft g before e, i, y
                if (['e', 'i', 'y'].includes(clean[i + 1])) {
                    phonemes.push('dʒ');
                }
                else {
                    phonemes.push('ɡ');
                }
                break;
            case 'h':
                phonemes.push('h');
                break;
            case 'j':
                phonemes.push('dʒ');
                break;
            case 'k':
                phonemes.push('k');
                break;
            case 'l':
                phonemes.push('l');
                break;
            case 'm':
                phonemes.push('m');
                break;
            case 'n':
                phonemes.push('n');
                break;
            case 'p':
                phonemes.push('p');
                break;
            case 'r':
                phonemes.push('ɹ');
                break;
            case 's':
                // intervocalic or final s can be /z/
                phonemes.push('s');
                break;
            case 't':
                phonemes.push('t');
                break;
            case 'v':
                phonemes.push('v');
                break;
            case 'w':
                phonemes.push('w');
                break;
            case 'x':
                phonemes.push('k');
                phonemes.push('s');
                break;
            case 'z':
                phonemes.push('z');
                break;
            default:
                // pass through non-standard characters
                if (char.trim())
                    phonemes.push(char);
                break;
        }
        i++;
    }
    // Ensure at least one phoneme
    if (phonemes.length === 0 && clean.length > 0) {
        phonemes.push('ə');
    }
    let ipa = phonemes.join('');
    if (isPrimaryStressed) {
        ipa = 'ˈ' + ipa;
    }
    else if (isSecondaryStressed) {
        ipa = 'ˌ' + ipa;
    }
    return { ipa, phonemes };
}
/**
 * Derives the primary and secondary stress indices for a sequence of syllables.
 */
export function calculateStressIndices(syllables, fullWord) {
    const count = syllables.length;
    if (count <= 1)
        return { primaryIdx: 0, secondaryIdx: null };
    const lowerWord = fullWord.toLowerCase();
    // Check suffix stress rules
    for (const suf of PENULTIMATE_STRESS_SUFFIXES) {
        if (lowerWord.endsWith(suf) && count >= 2) {
            return {
                primaryIdx: Math.max(0, count - 2),
                secondaryIdx: count >= 4 ? 0 : null,
            };
        }
    }
    // 2-syllable words
    if (count === 2) {
        const firstSyl = syllables[0].toLowerCase();
        if (UNSTRESSED_PREFIXES.includes(firstSyl)) {
            return { primaryIdx: 1, secondaryIdx: null };
        }
        return { primaryIdx: 0, secondaryIdx: null };
    }
    // 3-syllable words
    if (count === 3) {
        const firstSyl = syllables[0].toLowerCase();
        if (UNSTRESSED_PREFIXES.includes(firstSyl)) {
            return { primaryIdx: 1, secondaryIdx: null };
        }
        return { primaryIdx: 0, secondaryIdx: 2 };
    }
    // 4+ syllable words: default primary on antepenult (e.g. pho-TOG-ra-phy)
    const primaryIdx = Math.max(0, count - 3);
    const secondaryIdx = primaryIdx > 1 ? 0 : (count > primaryIdx + 2 ? count - 1 : null);
    return { primaryIdx, secondaryIdx };
}
/**
 * Phonemizes a word and returns its full WordPronunciationData with mapped syllables and IPA.
 */
export function phonemizeWord(word) {
    if (!word || !word.trim()) {
        return {
            word: '',
            canonicalIpa: '',
            syllables: [],
            source: 'espeak_g2p',
            generatedAt: Date.now(),
        };
    }
    const clean = word.trim();
    const lower = clean.toLowerCase();
    // 1. Check Canonical Clinical & Vocabulary Dictionary
    if (CANONICAL_PHONEME_DICTIONARY[lower]) {
        const entry = CANONICAL_PHONEME_DICTIONARY[lower];
        const syllables = entry.syllables.map((s, idx) => ({
            index: idx,
            text: s.text,
            ipa: s.ipa,
            phoneticSpelling: s.phoneticSpelling || s.text,
            stress: s.stress,
            phonemes: [...s.phonemes],
        }));
        return {
            word: clean,
            canonicalIpa: entry.canonicalIpa,
            syllables,
            source: 'clinical_dictionary',
            generatedAt: Date.now(),
        };
    }
    // 2. Algorithmic eSpeak NG G2P Fallback Engine
    const textSyllables = splitWordIntoSyllables(clean);
    const { primaryIdx, secondaryIdx } = calculateStressIndices(textSyllables, clean);
    const syllables = textSyllables.map((sylText, idx) => {
        const isPrimary = idx === primaryIdx;
        const isSecondary = idx === secondaryIdx;
        const stress = isPrimary ? 'primary' : isSecondary ? 'secondary' : 'unstressed';
        const { ipa, phonemes } = phonemizeGraphemeSyllable(sylText, isPrimary, isSecondary, idx === textSyllables.length - 1, textSyllables.length);
        return {
            index: idx,
            text: sylText,
            ipa,
            stress,
            phonemes,
        };
    });
    // Construct canonical full IPA string
    const canonicalIpa = syllables.map(s => s.ipa).join('');
    return {
        word: clean,
        canonicalIpa,
        syllables,
        source: 'espeak_g2p',
        generatedAt: Date.now(),
    };
}
/**
 * Returns the canonical IPA string for a given word.
 */
export function getCanonicalIpa(word) {
    const data = phonemizeWord(word);
    return data.canonicalIpa;
}
/**
 * Returns formatted IPA breakdown with middle dots or brackets (e.g. "fə · ˈtɑːɡ · ɹə · fi").
 */
export function formatIpaWithSyllables(word) {
    const data = phonemizeWord(word);
    return data.syllables.map(s => s.ipa).join(' · ');
}
