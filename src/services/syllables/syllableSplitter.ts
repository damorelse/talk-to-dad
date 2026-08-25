/**
 * Phonetic Syllable Segmentation Engine & eSpeak NG / Piper TTS Integration
 * Formats multi-syllable words with middle-dot separators (e.g., "Wa · ter")
 * and maps phonemes to individually defined syllables for speech rehabilitation.
 */

import type { SyllablePhonemeData, WordPronunciationData } from '../../types/index.ts';
import { phonemizeWord, getCanonicalIpa, formatIpaWithSyllables } from './espeakPhonemizer.ts';
import { piperTTSService, generateDeterministicPhonemeAudio } from './piperTTSService.ts';
import { CANONICAL_PHONEME_DICTIONARY } from './phonemeDictionary.ts';

// Clinical dictionary of common AAC & rehabilitation vocabulary syllables (lowercase keys)
export const CLINICAL_SYLLABLE_DICTIONARY: Record<string, string[]> = {
  // Showcase flagship example
  'photography': ['pho', 'tog', 'ra', 'phy'],

  // Needs & Essentials
  'water': ['wa', 'ter'],
  'bathroom': ['bath', 'room'],
  'glasses': ['glass', 'es'],
  'blanket': ['blan', 'ket'],
  'reposition': ['re', 'po', 'si', 'tion'],
  'hungry': ['hun', 'gry'],
  'thirsty': ['thirs', 'ty'],
  'coffee': ['cof', 'fee'],
  'pillow': ['pil', 'low'],
  'napkin': ['nap', 'kin'],
  'slippers': ['slip', 'pers'],
  'wheelchair': ['wheel', 'chair'],
  'telephone': ['te', 'le', 'phone'],
  'bookshelf': ['book', 'shelf'],
  'toothbrush': ['tooth', 'brush'],
  'backpack': ['back', 'pack'],
  'notebook': ['note', 'book'],

  // Health & Body
  'medicine': ['med', 'i', 'cine'],
  'dizzy': ['diz', 'zy'],
  'doctor': ['doc', 'tor'],
  'nurse': ['nurse'],
  'hospital': ['hos', 'pi', 'tal'],
  'bandage': ['ban', 'dage'],
  'numbness': ['numb', 'ness'],
  'headache': ['head', 'ache'],
  'stomach': ['stom', 'ach'],
  'shoulder': ['shoul', 'der'],
  'temperature': ['tem', 'per', 'a', 'ture'],
  'prescription': ['pre', 'scrip', 'tion'],
  'rehabilitation': ['re', 'ha', 'bil', 'i', 'ta', 'tion'],
  'therapy': ['ther', 'a', 'py'],
  'breathing': ['breath', 'ing'],
  'swallow': ['swal', 'low'],

  // Feelings
  'happy': ['hap', 'py'],
  'frustrated': ['frus', 'trat', 'ed'],
  'anxious': ['anx', 'ious'],
  'tired': ['tired'],
  'grateful': ['grate', 'ful'],
  'peaceful': ['peace', 'ful'],
  'excited': ['ex', 'cit', 'ed'],
  'confused': ['con', 'fused'],
  'comfortable': ['com', 'fort', 'a', 'ble'],

  // Family & Social
  'daughter': ['daugh', 'ter'],
  'family': ['fam', 'i', 'ly'],
  'children': ['chil', 'dren'],
  'grandchildren': ['grand', 'chil', 'dren'],
  'grandpa': ['grand', 'pa'],
  'grandma': ['grand', 'ma'],
  'caregiver': ['care', 'giv', 'er'],
  'welcome': ['wel', 'come'],
  'morning': ['morn', 'ing'],
  'evening': ['eve', 'ning'],
  'afternoon': ['af', 'ter', 'noon'],
  'yesterday': ['yes', 'ter', 'day'],
  'tomorrow': ['to', 'mor', 'row'],

  // Activities & Objects
  'butterfly': ['but', 'ter', 'fly'],
  'refrigerator': ['re', 'frig', 'er', 'a', 'tor'],
  'sunshine': ['sun', 'shine'],
  'exercise': ['ex', 'er', 'cise'],
  'music': ['mu', 'sic'],
  'television': ['te', 'le', 'vi', 'sion'],
  'outside': ['out', 'side'],
  'bedroom': ['bed', 'room'],
  'kitchen': ['kitch', 'en'],
  'garden': ['gar', 'den'],
  'practice': ['prac', 'tice'],
  'reading': ['read', 'ing'],
  'walking': ['walk', 'ing'],
  'computer': ['com', 'pu', 'ter'],
  'calendar': ['cal', 'en', 'dar'],
  'umbrella': ['um', 'brel', 'la'],
  'together': ['to', 'geth', 'er'],
  'important': ['im', 'por', 'tant'],
  'remember': ['re', 'mem', 'ber'],
  'wonderful': ['won', 'der', 'ful'],

  // Numbers
  'zero': ['ze', 'ro'],
  'seven': ['sev', 'en'],
  'eleven': ['e', 'lev', 'en'],
  'twelve': ['twelve'],
  'thirteen': ['thir', 'teen'],
  'fourteen': ['four', 'teen'],
  'fifteen': ['fif', 'teen'],
  'sixteen': ['six', 'teen'],
  'seventeen': ['sev', 'en', 'teen'],
  'eighteen': ['eigh', 'teen'],
  'nineteen': ['nine', 'teen'],
  'twenty': ['twen', 'ty'],
  'thirty': ['thir', 'ty'],
  'hundred': ['hun', 'dred'],
};

/**
 * Algorithmic rule-based phonetic syllable splitter fallback.
 * Applies English syllable division heuristics (V/CV, VC/CV, VCCCV, consonant blends, suffixes).
 */
export function algorithmicSyllableSplit(word: string): string[] {
  const clean = word.trim();
  if (clean.length <= 3) return [clean];

  const lower = clean.toLowerCase();
  // Check dictionary first
  if (CLINICAL_SYLLABLE_DICTIONARY[lower]) {
    return matchCase(CLINICAL_SYLLABLE_DICTIONARY[lower], clean);
  }

  const vowels = 'aeiouy';
  const isVowel = (c: string | undefined): boolean => !!c && vowels.includes(c.toLowerCase());

  // Onset consonant clusters that stay together with the following vowel
  const ONSETS = new Set([
    'str', 'spl', 'spr', 'scr', 'shr', 'thr',
    'ch', 'sh', 'th', 'ph', 'wh', 'qu',
    'pl', 'bl', 'cl', 'gl', 'fl', 'sl',
    'pr', 'br', 'tr', 'dr', 'cr', 'gr', 'fr',
    'sk', 'sp', 'st', 'sw', 'sm', 'sn', 'tw', 'dw'
  ]);

  // Find vowel nuclei (contiguous vowel runs)
  const nuclei: { start: number; end: number }[] = [];
  let inV = false;
  let startIdx = 0;
  for (let i = 0; i < clean.length; i++) {
    const v = isVowel(clean[i]);
    if (v && !inV) {
      inV = true;
      startIdx = i;
    } else if (!v && inV) {
      inV = false;
      nuclei.push({ start: startIdx, end: i - 1 });
    }
  }
  if (inV) nuclei.push({ start: startIdx, end: clean.length - 1 });

  // Handle silent trailing 'e' (e.g. in 'cake', 'plate')
  if (nuclei.length > 1) {
    const lastNucleus = nuclei[nuclei.length - 1];
    if (
      lastNucleus.start === clean.length - 1 &&
      clean[clean.length - 1].toLowerCase() === 'e' &&
      !isVowel(clean[clean.length - 2])
    ) {
      // Check if preceded by 'l' (as in '-ble', '-ple') -> keep as syllabic l
      if (clean[clean.length - 2]?.toLowerCase() !== 'l') {
        nuclei.pop();
      }
    }
  }

  if (nuclei.length <= 1) return [clean];

  // Determine split points between consecutive vowel nuclei
  const splitPoints: number[] = [];
  for (let n = 0; n < nuclei.length - 1; n++) {
    const n1 = nuclei[n];
    const n2 = nuclei[n + 1];
    const consStart = n1.end + 1;
    const consEnd = n2.start - 1;
    const consCount = consEnd - consStart + 1;

    if (consCount <= 0) {
      // Diphthong / hiatus split (e.g., 'li-on', 're-act')
      splitPoints.push(n1.end + 1);
    } else if (consCount === 1) {
      // V / CV
      splitPoints.push(consStart);
    } else if (consCount === 2) {
      const two = clean.slice(consStart, consStart + 2).toLowerCase();
      if (ONSETS.has(two)) {
        splitPoints.push(consStart); // V / CCV (e.g. 'fa-ther')
      } else {
        splitPoints.push(consStart + 1); // VC / CV (e.g. 'doc-tor', 'nap-kin')
      }
    } else if (consCount === 3) {
      const two = clean.slice(consStart + 1, consStart + 3).toLowerCase();
      const firstTwo = clean.slice(consStart, consStart + 2).toLowerCase();
      if (ONSETS.has(two)) {
        splitPoints.push(consStart + 1); // VC / CCV (e.g. 'book-shelf', 'mon-ster', 'pump-kin')
      } else if (ONSETS.has(firstTwo)) {
        splitPoints.push(consStart + 2);
      } else {
        splitPoints.push(consStart + 1);
      }
    } else {
      // 4 or more consonants (e.g. 'in-struct', 'night-stand')
      const lastTwo = clean.slice(consEnd - 1, consEnd + 1).toLowerCase();
      const lastThree = clean.slice(consEnd - 2, consEnd + 1).toLowerCase();
      if (ONSETS.has(lastThree)) {
        splitPoints.push(consEnd - 2);
      } else if (ONSETS.has(lastTwo)) {
        splitPoints.push(consEnd - 1);
      } else {
        splitPoints.push(Math.floor((consStart + consEnd) / 2) + 1);
      }
    }
  }

  // Slice string into syllables using splitPoints
  const syllables: string[] = [];
  let prev = 0;
  for (const pt of splitPoints) {
    syllables.push(clean.slice(prev, pt));
    prev = pt;
  }
  if (prev < clean.length) {
    syllables.push(clean.slice(prev));
  }

  return syllables.length > 0 ? syllables : [clean];
}

/**
 * Maps the original casing of `original` to the segmented `syllables`.
 */
function matchCase(syllables: string[], original: string): string[] {
  let charIdx = 0;
  return syllables.map(s => {
    let result = '';
    for (let i = 0; i < s.length; i++) {
      result += original[charIdx] || s[i];
      charIdx++;
    }
    return result;
  });
}

/**
 * Splits a single word into syllables.
 */
export function splitWordIntoSyllables(word: string): string[] {
  if (!word || word.trim().length === 0) return [];
  const clean = word.trim();
  const lower = clean.toLowerCase();

  // 1. Check Canonical eSpeak NG dictionary first
  if (CANONICAL_PHONEME_DICTIONARY[lower]) {
    return matchCase(
      CANONICAL_PHONEME_DICTIONARY[lower].syllables.map((s) => s.text),
      clean
    );
  }

  // 2. Check Clinical dictionary
  if (CLINICAL_SYLLABLE_DICTIONARY[lower]) {
    return matchCase(CLINICAL_SYLLABLE_DICTIONARY[lower], clean);
  }

  // 3. Fallback to algorithmic eSpeak rule-based splitter
  return algorithmicSyllableSplit(clean);
}

/**
 * Formats a single word or phrase with middle dot separators (e.g. "Wa · ter").
 */
export function formatWithMiddleDot(text: string): string {
  if (!text) return '';
  // If already formatted with middots, normalize spacing
  if (text.includes('·')) {
    return text.split(/\s*·\s*/).join(' · ');
  }

  const words = text.split(/\s+/);
  return words.map(w => {
    const syllables = splitWordIntoSyllables(w);
    return syllables.join(' · ');
  }).join('   ');
}

export interface VisualizerPhraseItem {
  word: string;
  syllables: string[];
}

/**
 * Breaks a full phrase into words with their syllables for the syllable visualizer.
 */
export function breakPhraseForVisualizer(phrase: string): VisualizerPhraseItem[] {
  if (!phrase) return [];
  const words = phrase.split(/\s+/).filter(Boolean);
  return words.map(w => ({
    word: w,
    syllables: splitWordIntoSyllables(w),
  }));
}

/**
 * Returns full pronunciation metadata with mapped syllables, canonical IPA, and phonemes.
 */
export function getWordPronunciation(word: string): WordPronunciationData {
  return phonemizeWord(word);
}

/**
 * Returns syllable breakdown array with IPA data.
 */
export function getSyllableBreakdownWithIpa(word: string): SyllablePhonemeData[] {
  const data = phonemizeWord(word);
  return data.syllables;
}

// Re-exports
export {
  phonemizeWord,
  getCanonicalIpa,
  formatIpaWithSyllables,
  piperTTSService,
  generateDeterministicPhonemeAudio,
  CANONICAL_PHONEME_DICTIONARY,
};
