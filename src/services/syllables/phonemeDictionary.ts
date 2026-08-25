/**
 * Canonical eSpeak NG IPA Phoneme & Syllable Dictionary
 * 
 * Provides clinically accurate, authoritative eSpeak NG IPA phonetic transcriptions,
 * syllable segmentation, and syllable-to-phoneme token mapping for stroke rehabilitation,
 * aphasia articulation practice, and Piper TTS neural synthesis.
 */

export interface CanonicalDictionaryEntry {
  canonicalIpa: string;
  syllables: {
    text: string;
    ipa: string;
    phoneticSpelling?: string;
    stress: 'primary' | 'secondary' | 'unstressed';
    phonemes: string[];
  }[];
}

export const CANONICAL_PHONEME_DICTIONARY: Record<string, CanonicalDictionaryEntry> = {
  // Flagship showcase example: photography -> pho | tog | ra | phy
  'photography': {
    canonicalIpa: 'fəˈtɑːɡɹəfi',
    syllables: [
      { text: 'pho', ipa: 'fə', phoneticSpelling: 'fuh', stress: 'unstressed', phonemes: ['f', 'ə'] },
      { text: 'tog', ipa: 'ˈtɑːɡ', phoneticSpelling: 'TAHG', stress: 'primary', phonemes: ['t', 'ɑː', 'ɡ'] },
      { text: 'ra', ipa: 'ɹə', phoneticSpelling: 'ruh', stress: 'unstressed', phonemes: ['ɹ', 'ə'] },
      { text: 'phy', ipa: 'fi', phoneticSpelling: 'fee', stress: 'unstressed', phonemes: ['f', 'i'] },
    ],
  },

  // Needs & Essentials
  'water': {
    canonicalIpa: 'ˈwɔːtəɹ',
    syllables: [
      { text: 'wa', ipa: 'ˈwɔː', stress: 'primary', phonemes: ['w', 'ɔː'] },
      { text: 'ter', ipa: 'təɹ', stress: 'unstressed', phonemes: ['t', 'ə', 'ɹ'] },
    ],
  },
  'bathroom': {
    canonicalIpa: 'ˈbæθɹuːm',
    syllables: [
      { text: 'bath', ipa: 'ˈbæθ', stress: 'primary', phonemes: ['b', 'æ', 'θ'] },
      { text: 'room', ipa: 'ɹuːm', stress: 'unstressed', phonemes: ['ɹ', 'uː', 'm'] },
    ],
  },
  'glasses': {
    canonicalIpa: 'ˈɡlæsɪz',
    syllables: [
      { text: 'glass', ipa: 'ˈɡlæs', stress: 'primary', phonemes: ['ɡ', 'l', 'æ', 's'] },
      { text: 'es', ipa: 'ɪz', stress: 'unstressed', phonemes: ['ɪ', 'z'] },
    ],
  },
  'blanket': {
    canonicalIpa: 'ˈblæŋkɪt',
    syllables: [
      { text: 'blan', ipa: 'ˈblæŋ', stress: 'primary', phonemes: ['b', 'l', 'æ', 'ŋ'] },
      { text: 'ket', ipa: 'kɪt', stress: 'unstressed', phonemes: ['k', 'ɪ', 't'] },
    ],
  },
  'reposition': {
    canonicalIpa: 'ˌriːpəˈzɪʃən',
    syllables: [
      { text: 're', ipa: 'ˌriː', stress: 'secondary', phonemes: ['ɹ', 'iː'] },
      { text: 'po', ipa: 'pə', stress: 'unstressed', phonemes: ['p', 'ə'] },
      { text: 'si', ipa: 'ˈzɪ', stress: 'primary', phonemes: ['z', 'ɪ'] },
      { text: 'tion', ipa: 'ʃən', stress: 'unstressed', phonemes: ['ʃ', 'ə', 'n'] },
    ],
  },
  'hungry': {
    canonicalIpa: 'ˈhʌŋɡɹi',
    syllables: [
      { text: 'hun', ipa: 'ˈhʌŋ', stress: 'primary', phonemes: ['h', 'ʌ', 'ŋ'] },
      { text: 'gry', ipa: 'ɡɹi', stress: 'unstressed', phonemes: ['ɡ', 'ɹ', 'i'] },
    ],
  },
  'thirsty': {
    canonicalIpa: 'ˈθɜːɹsti',
    syllables: [
      { text: 'thirs', ipa: 'ˈθɜːɹs', stress: 'primary', phonemes: ['θ', 'ɜː', 'ɹ', 's'] },
      { text: 'ty', ipa: 'ti', stress: 'unstressed', phonemes: ['t', 'i'] },
    ],
  },
  'coffee': {
    canonicalIpa: 'ˈkɔːfi',
    syllables: [
      { text: 'cof', ipa: 'ˈkɔː', stress: 'primary', phonemes: ['k', 'ɔː'] },
      { text: 'fee', ipa: 'fi', stress: 'unstressed', phonemes: ['f', 'i'] },
    ],
  },
  'pillow': {
    canonicalIpa: 'ˈpɪloʊ',
    syllables: [
      { text: 'pil', ipa: 'ˈpɪ', stress: 'primary', phonemes: ['p', 'ɪ'] },
      { text: 'low', ipa: 'loʊ', stress: 'unstressed', phonemes: ['l', 'oʊ'] },
    ],
  },
  'napkin': {
    canonicalIpa: 'ˈnæpkɪn',
    syllables: [
      { text: 'nap', ipa: 'ˈnæp', stress: 'primary', phonemes: ['n', 'æ', 'p'] },
      { text: 'kin', ipa: 'kɪn', stress: 'unstressed', phonemes: ['k', 'ɪ', 'n'] },
    ],
  },
  'slippers': {
    canonicalIpa: 'ˈslɪpəɹz',
    syllables: [
      { text: 'slip', ipa: 'ˈslɪ', stress: 'primary', phonemes: ['s', 'l', 'ɪ'] },
      { text: 'pers', ipa: 'pəɹz', stress: 'unstressed', phonemes: ['p', 'ə', 'ɹ', 'z'] },
    ],
  },
  'wheelchair': {
    canonicalIpa: 'ˈwiːltʃɛɹ',
    syllables: [
      { text: 'wheel', ipa: 'ˈwiːl', stress: 'primary', phonemes: ['w', 'iː', 'l'] },
      { text: 'chair', ipa: 'tʃɛɹ', stress: 'unstressed', phonemes: ['tʃ', 'ɛ', 'ɹ'] },
    ],
  },
  'telephone': {
    canonicalIpa: 'ˈtɛlɪfoʊn',
    syllables: [
      { text: 'te', ipa: 'ˈtɛ', phoneticSpelling: 'te', stress: 'primary', phonemes: ['t', 'ɛ'] },
      { text: 'le', ipa: 'lɪ', phoneticSpelling: 'le', stress: 'unstressed', phonemes: ['l', 'ɪ'] },
      { text: 'phone', ipa: 'foʊn', phoneticSpelling: 'phone', stress: 'unstressed', phonemes: ['f', 'oʊ', 'n'] },
    ],
  },
  'bookshelf': {
    canonicalIpa: 'ˈbʊkʃɛlf',
    syllables: [
      { text: 'book', ipa: 'ˈbʊk', phoneticSpelling: 'book', stress: 'primary', phonemes: ['b', 'ʊ', 'k'] },
      { text: 'shelf', ipa: 'ʃɛlf', phoneticSpelling: 'shelf', stress: 'unstressed', phonemes: ['ʃ', 'ɛ', 'l', 'f'] },
    ],
  },
  'toothbrush': {
    canonicalIpa: 'ˈtuːθbɹʌʃ',
    syllables: [
      { text: 'tooth', ipa: 'ˈtuːθ', phoneticSpelling: 'tooth', stress: 'primary', phonemes: ['t', 'uː', 'θ'] },
      { text: 'brush', ipa: 'bɹʌʃ', phoneticSpelling: 'brush', stress: 'unstressed', phonemes: ['b', 'ɹ', 'ʌ', 'ʃ'] },
    ],
  },
  'backpack': {
    canonicalIpa: 'ˈbækpæk',
    syllables: [
      { text: 'back', ipa: 'ˈbæk', phoneticSpelling: 'back', stress: 'primary', phonemes: ['b', 'æ', 'k'] },
      { text: 'pack', ipa: 'pæk', phoneticSpelling: 'pack', stress: 'unstressed', phonemes: ['p', 'æ', 'k'] },
    ],
  },
  'notebook': {
    canonicalIpa: 'ˈnoʊtbʊk',
    syllables: [
      { text: 'note', ipa: 'ˈnoʊt', phoneticSpelling: 'note', stress: 'primary', phonemes: ['n', 'oʊ', 't'] },
      { text: 'book', ipa: 'bʊk', phoneticSpelling: 'book', stress: 'unstressed', phonemes: ['b', 'ʊ', 'k'] },
    ],
  },

  // Health & Body
  'medicine': {
    canonicalIpa: 'ˈmɛdɪsɪn',
    syllables: [
      { text: 'med', ipa: 'ˈmɛd', stress: 'primary', phonemes: ['m', 'ɛ', 'd'] },
      { text: 'i', ipa: 'ɪ', stress: 'unstressed', phonemes: ['ɪ'] },
      { text: 'cine', ipa: 'sɪn', stress: 'unstressed', phonemes: ['s', 'ɪ', 'n'] },
    ],
  },
  'dizzy': {
    canonicalIpa: 'ˈdɪzi',
    syllables: [
      { text: 'diz', ipa: 'ˈdɪ', stress: 'primary', phonemes: ['d', 'ɪ'] },
      { text: 'zy', ipa: 'zi', stress: 'unstressed', phonemes: ['z', 'i'] },
    ],
  },
  'doctor': {
    canonicalIpa: 'ˈdɑːktəɹ',
    syllables: [
      { text: 'doc', ipa: 'ˈdɑːk', stress: 'primary', phonemes: ['d', 'ɑː', 'k'] },
      { text: 'tor', ipa: 'təɹ', stress: 'unstressed', phonemes: ['t', 'ə', 'ɹ'] },
    ],
  },
  'nurse': {
    canonicalIpa: 'ˈnɜːɹs',
    syllables: [
      { text: 'nurse', ipa: 'ˈnɜːɹs', stress: 'primary', phonemes: ['n', 'ɜː', 'ɹ', 's'] },
    ],
  },
  'hospital': {
    canonicalIpa: 'ˈhɑːspɪtəl',
    syllables: [
      { text: 'hos', ipa: 'ˈhɑːs', stress: 'primary', phonemes: ['h', 'ɑː', 's'] },
      { text: 'pi', ipa: 'pɪ', stress: 'unstressed', phonemes: ['p', 'ɪ'] },
      { text: 'tal', ipa: 'təl', stress: 'unstressed', phonemes: ['t', 'ə', 'l'] },
    ],
  },
  'bandage': {
    canonicalIpa: 'ˈbændɪdʒ',
    syllables: [
      { text: 'ban', ipa: 'ˈbæn', stress: 'primary', phonemes: ['b', 'æ', 'n'] },
      { text: 'dage', ipa: 'dɪdʒ', stress: 'unstressed', phonemes: ['d', 'ɪ', 'dʒ'] },
    ],
  },
  'numbness': {
    canonicalIpa: 'ˈnʌmnəs',
    syllables: [
      { text: 'numb', ipa: 'ˈnʌm', stress: 'primary', phonemes: ['n', 'ʌ', 'm'] },
      { text: 'ness', ipa: 'nəs', stress: 'unstressed', phonemes: ['n', 'ə', 's'] },
    ],
  },
  'headache': {
    canonicalIpa: 'ˈhɛdeɪk',
    syllables: [
      { text: 'head', ipa: 'ˈhɛd', stress: 'primary', phonemes: ['h', 'ɛ', 'd'] },
      { text: 'ache', ipa: 'eɪk', stress: 'unstressed', phonemes: ['eɪ', 'k'] },
    ],
  },
  'stomach': {
    canonicalIpa: 'ˈstʌmək',
    syllables: [
      { text: 'stom', ipa: 'ˈstʌm', stress: 'primary', phonemes: ['s', 't', 'ʌ', 'm'] },
      { text: 'ach', ipa: 'ək', stress: 'unstressed', phonemes: ['ə', 'k'] },
    ],
  },
  'shoulder': {
    canonicalIpa: 'ˈʃoʊldəɹ',
    syllables: [
      { text: 'shoul', ipa: 'ˈʃoʊl', stress: 'primary', phonemes: ['ʃ', 'oʊ', 'l'] },
      { text: 'der', ipa: 'dəɹ', stress: 'unstressed', phonemes: ['d', 'ə', 'ɹ'] },
    ],
  },
  'temperature': {
    canonicalIpa: 'ˈtɛmpəɹətʃəɹ',
    syllables: [
      { text: 'tem', ipa: 'ˈtɛm', stress: 'primary', phonemes: ['t', 'ɛ', 'm'] },
      { text: 'per', ipa: 'pəɹ', stress: 'unstressed', phonemes: ['p', 'ə', 'ɹ'] },
      { text: 'a', ipa: 'ə', stress: 'unstressed', phonemes: ['ə'] },
      { text: 'ture', ipa: 'tʃəɹ', stress: 'unstressed', phonemes: ['tʃ', 'ə', 'ɹ'] },
    ],
  },
  'prescription': {
    canonicalIpa: 'pɹəˈskɹɪpʃən',
    syllables: [
      { text: 'pre', ipa: 'pɹə', stress: 'unstressed', phonemes: ['p', 'ɹ', 'ə'] },
      { text: 'scrip', ipa: 'ˈskɹɪp', stress: 'primary', phonemes: ['s', 'k', 'ɹ', 'ɪ', 'p'] },
      { text: 'tion', ipa: 'ʃən', stress: 'unstressed', phonemes: ['ʃ', 'ə', 'n'] },
    ],
  },
  'rehabilitation': {
    canonicalIpa: 'ˌɹiːhəˌbɪlɪˈteɪʃən',
    syllables: [
      { text: 're', ipa: 'ˌɹiː', stress: 'secondary', phonemes: ['ɹ', 'iː'] },
      { text: 'ha', ipa: 'hə', stress: 'unstressed', phonemes: ['h', 'ə'] },
      { text: 'bil', ipa: 'ˌbɪl', stress: 'secondary', phonemes: ['b', 'ɪ', 'l'] },
      { text: 'i', ipa: 'ɪ', stress: 'unstressed', phonemes: ['ɪ'] },
      { text: 'ta', ipa: 'ˈteɪ', stress: 'primary', phonemes: ['t', 'eɪ'] },
      { text: 'tion', ipa: 'ʃən', stress: 'unstressed', phonemes: ['ʃ', 'ə', 'n'] },
    ],
  },
  'therapy': {
    canonicalIpa: 'ˈθɛɹəpi',
    syllables: [
      { text: 'ther', ipa: 'ˈθɛɹ', stress: 'primary', phonemes: ['θ', 'ɛ', 'ɹ'] },
      { text: 'a', ipa: 'ə', stress: 'unstressed', phonemes: ['ə'] },
      { text: 'py', ipa: 'pi', stress: 'unstressed', phonemes: ['p', 'i'] },
    ],
  },
  'breathing': {
    canonicalIpa: 'ˈbɹiːðɪŋ',
    syllables: [
      { text: 'breath', ipa: 'ˈbɹiːð', stress: 'primary', phonemes: ['b', 'ɹ', 'iː', 'ð'] },
      { text: 'ing', ipa: 'ɪŋ', stress: 'unstressed', phonemes: ['ɪ', 'ŋ'] },
    ],
  },
  'swallow': {
    canonicalIpa: 'ˈswɑːloʊ',
    syllables: [
      { text: 'swal', ipa: 'ˈswɑː', stress: 'primary', phonemes: ['s', 'w', 'ɑː'] },
      { text: 'low', ipa: 'loʊ', stress: 'unstressed', phonemes: ['l', 'oʊ'] },
    ],
  },

  // Feelings
  'happy': {
    canonicalIpa: 'ˈhæpi',
    syllables: [
      { text: 'hap', ipa: 'ˈhæ', stress: 'primary', phonemes: ['h', 'æ'] },
      { text: 'py', ipa: 'pi', stress: 'unstressed', phonemes: ['p', 'i'] },
    ],
  },
  'frustrated': {
    canonicalIpa: 'ˈfɹʌstɹeɪtɪd',
    syllables: [
      { text: 'frus', ipa: 'ˈfɹʌs', stress: 'primary', phonemes: ['f', 'ɹ', 'ʌ', 's'] },
      { text: 'trat', ipa: 'tɹeɪt', stress: 'unstressed', phonemes: ['t', 'ɹ', 'eɪ', 't'] },
      { text: 'ed', ipa: 'ɪd', stress: 'unstressed', phonemes: ['ɪ', 'd'] },
    ],
  },
  'anxious': {
    canonicalIpa: 'ˈæŋkʃəs',
    syllables: [
      { text: 'anx', ipa: 'ˈæŋk', stress: 'primary', phonemes: ['æ', 'ŋ', 'k'] },
      { text: 'ious', ipa: 'ʃəs', stress: 'unstressed', phonemes: ['ʃ', 'ə', 's'] },
    ],
  },
  'tired': {
    canonicalIpa: 'ˈtaɪəɹd',
    syllables: [
      { text: 'tired', ipa: 'ˈtaɪəɹd', stress: 'primary', phonemes: ['t', 'aɪ', 'ə', 'ɹ', 'd'] },
    ],
  },
  'grateful': {
    canonicalIpa: 'ˈɡɹeɪtfəl',
    syllables: [
      { text: 'grate', ipa: 'ˈɡɹeɪt', stress: 'primary', phonemes: ['ɡ', 'ɹ', 'eɪ', 't'] },
      { text: 'ful', ipa: 'fəl', stress: 'unstressed', phonemes: ['f', 'ə', 'l'] },
    ],
  },
  'peaceful': {
    canonicalIpa: 'ˈpiːsfəl',
    syllables: [
      { text: 'peace', ipa: 'ˈpiːs', stress: 'primary', phonemes: ['p', 'iː', 's'] },
      { text: 'ful', ipa: 'fəl', stress: 'unstressed', phonemes: ['f', 'ə', 'l'] },
    ],
  },
  'excited': {
    canonicalIpa: 'ɪkˈsaɪtɪd',
    syllables: [
      { text: 'ex', ipa: 'ɪk', stress: 'unstressed', phonemes: ['ɪ', 'k'] },
      { text: 'cit', ipa: 'ˈsaɪt', stress: 'primary', phonemes: ['s', 'aɪ', 't'] },
      { text: 'ed', ipa: 'ɪd', stress: 'unstressed', phonemes: ['ɪ', 'd'] },
    ],
  },
  'confused': {
    canonicalIpa: 'kənˈfjuːzd',
    syllables: [
      { text: 'con', ipa: 'kən', stress: 'unstressed', phonemes: ['k', 'ə', 'n'] },
      { text: 'fused', ipa: 'ˈfjuːzd', stress: 'primary', phonemes: ['f', 'j', 'uː', 'z', 'd'] },
    ],
  },
  'comfortable': {
    canonicalIpa: 'ˈkʌmftəbəl',
    syllables: [
      { text: 'com', ipa: 'ˈkʌmf', stress: 'primary', phonemes: ['k', 'ʌ', 'm', 'f'] },
      { text: 'fort', ipa: 'tə', stress: 'unstressed', phonemes: ['t', 'ə'] },
      { text: 'a', ipa: 'bəl', stress: 'unstressed', phonemes: ['b', 'ə', 'l'] },
      { text: 'ble', ipa: 'bəl', stress: 'unstressed', phonemes: ['b', 'ə', 'l'] },
    ],
  },

  // Family & Social
  'daughter': {
    canonicalIpa: 'ˈdɔːtəɹ',
    syllables: [
      { text: 'daugh', ipa: 'ˈdɔː', stress: 'primary', phonemes: ['d', 'ɔː'] },
      { text: 'ter', ipa: 'təɹ', stress: 'unstressed', phonemes: ['t', 'ə', 'ɹ'] },
    ],
  },
  'family': {
    canonicalIpa: 'ˈfæməli',
    syllables: [
      { text: 'fam', ipa: 'ˈfæm', stress: 'primary', phonemes: ['f', 'æ', 'm'] },
      { text: 'i', ipa: 'ə', stress: 'unstressed', phonemes: ['ə'] },
      { text: 'ly', ipa: 'li', stress: 'unstressed', phonemes: ['l', 'i'] },
    ],
  },
  'children': {
    canonicalIpa: 'ˈtʃɪldɹən',
    syllables: [
      { text: 'chil', ipa: 'ˈtʃɪl', stress: 'primary', phonemes: ['tʃ', 'ɪ', 'l'] },
      { text: 'dren', ipa: 'dɹən', stress: 'unstressed', phonemes: ['d', 'ɹ', 'ə', 'n'] },
    ],
  },
  'grandchildren': {
    canonicalIpa: 'ˈɡɹændˌtʃɪldɹən',
    syllables: [
      { text: 'grand', ipa: 'ˈɡɹænd', stress: 'primary', phonemes: ['ɡ', 'ɹ', 'æ', 'n', 'd'] },
      { text: 'chil', ipa: 'ˌtʃɪl', stress: 'secondary', phonemes: ['tʃ', 'ɪ', 'l'] },
      { text: 'dren', ipa: 'dɹən', stress: 'unstressed', phonemes: ['d', 'ɹ', 'ə', 'n'] },
    ],
  },
  'grandpa': {
    canonicalIpa: 'ˈɡɹændpɑː',
    syllables: [
      { text: 'grand', ipa: 'ˈɡɹænd', stress: 'primary', phonemes: ['ɡ', 'ɹ', 'æ', 'n', 'd'] },
      { text: 'pa', ipa: 'pɑː', stress: 'unstressed', phonemes: ['p', 'ɑː'] },
    ],
  },
  'grandma': {
    canonicalIpa: 'ˈɡɹændmɑː',
    syllables: [
      { text: 'grand', ipa: 'ˈɡɹænd', stress: 'primary', phonemes: ['ɡ', 'ɹ', 'æ', 'n', 'd'] },
      { text: 'ma', ipa: 'mɑː', stress: 'unstressed', phonemes: ['m', 'ɑː'] },
    ],
  },
  'caregiver': {
    canonicalIpa: 'ˈkɛɹˌɡɪvəɹ',
    syllables: [
      { text: 'care', ipa: 'ˈkɛɹ', stress: 'primary', phonemes: ['k', 'ɛ', 'ɹ'] },
      { text: 'giv', ipa: 'ˌɡɪv', stress: 'secondary', phonemes: ['ɡ', 'ɪ', 'v'] },
      { text: 'er', ipa: 'əɹ', stress: 'unstressed', phonemes: ['ə', 'ɹ'] },
    ],
  },
  'welcome': {
    canonicalIpa: 'ˈwɛlkəm',
    syllables: [
      { text: 'wel', ipa: 'ˈwɛl', stress: 'primary', phonemes: ['w', 'ɛ', 'l'] },
      { text: 'come', ipa: 'kəm', stress: 'unstressed', phonemes: ['k', 'ə', 'm'] },
    ],
  },
  'morning': {
    canonicalIpa: 'ˈmɔːɹnɪŋ',
    syllables: [
      { text: 'morn', ipa: 'ˈmɔːɹ', stress: 'primary', phonemes: ['m', 'ɔː', 'ɹ'] },
      { text: 'ing', ipa: 'nɪŋ', stress: 'unstressed', phonemes: ['n', 'ɪ', 'ŋ'] },
    ],
  },
  'evening': {
    canonicalIpa: 'ˈiːvnɪŋ',
    syllables: [
      { text: 'eve', ipa: 'ˈiːv', stress: 'primary', phonemes: ['iː', 'v'] },
      { text: 'ning', ipa: 'nɪŋ', stress: 'unstressed', phonemes: ['n', 'ɪ', 'ŋ'] },
    ],
  },
  'afternoon': {
    canonicalIpa: 'ˌæftəɹˈnuːn',
    syllables: [
      { text: 'af', ipa: 'ˌæf', stress: 'secondary', phonemes: ['æ', 'f'] },
      { text: 'ter', ipa: 'təɹ', stress: 'unstressed', phonemes: ['t', 'ə', 'ɹ'] },
      { text: 'noon', ipa: 'ˈnuːn', stress: 'primary', phonemes: ['n', 'uː', 'n'] },
    ],
  },
  'yesterday': {
    canonicalIpa: 'ˈjɛstəɹdeɪ',
    syllables: [
      { text: 'yes', ipa: 'ˈjɛs', stress: 'primary', phonemes: ['j', 'ɛ', 's'] },
      { text: 'ter', ipa: 'təɹ', stress: 'unstressed', phonemes: ['t', 'ə', 'ɹ'] },
      { text: 'day', ipa: 'deɪ', stress: 'unstressed', phonemes: ['d', 'eɪ'] },
    ],
  },
  'tomorrow': {
    canonicalIpa: 'təˈmɔːɹoʊ',
    syllables: [
      { text: 'to', ipa: 'tə', stress: 'unstressed', phonemes: ['t', 'ə'] },
      { text: 'mor', ipa: 'ˈmɔːɹ', stress: 'primary', phonemes: ['m', 'ɔː', 'ɹ'] },
      { text: 'row', ipa: 'oʊ', stress: 'unstressed', phonemes: ['oʊ'] },
    ],
  },

  // Activities & Objects
  'butterfly': {
    canonicalIpa: 'ˈbʌtəɹflaɪ',
    syllables: [
      { text: 'but', ipa: 'ˈbʌt', stress: 'primary', phonemes: ['b', 'ʌ', 't'] },
      { text: 'ter', ipa: 'əɹ', stress: 'unstressed', phonemes: ['ə', 'ɹ'] },
      { text: 'fly', ipa: 'flaɪ', stress: 'unstressed', phonemes: ['f', 'l', 'aɪ'] },
    ],
  },
  'refrigerator': {
    canonicalIpa: 'ɹɪˈfɹɪdʒəˌɹeɪtəɹ',
    syllables: [
      { text: 're', ipa: 'ɹɪ', stress: 'unstressed', phonemes: ['ɹ', 'ɪ'] },
      { text: 'frig', ipa: 'ˈfɹɪdʒ', stress: 'primary', phonemes: ['f', 'ɹ', 'ɪ', 'dʒ'] },
      { text: 'er', ipa: 'ə', stress: 'unstressed', phonemes: ['ə'] },
      { text: 'a', ipa: 'ˌɹeɪ', stress: 'secondary', phonemes: ['ɹ', 'eɪ'] },
      { text: 'tor', ipa: 'təɹ', stress: 'unstressed', phonemes: ['t', 'ə', 'ɹ'] },
    ],
  },
  'sunshine': {
    canonicalIpa: 'ˈsʌnʃaɪn',
    syllables: [
      { text: 'sun', ipa: 'ˈsʌn', stress: 'primary', phonemes: ['s', 'ʌ', 'n'] },
      { text: 'shine', ipa: 'ʃaɪn', stress: 'unstressed', phonemes: ['ʃ', 'aɪ', 'n'] },
    ],
  },
  'exercise': {
    canonicalIpa: 'ˈɛksəɹsaɪz',
    syllables: [
      { text: 'ex', ipa: 'ˈɛk', stress: 'primary', phonemes: ['ɛ', 'k'] },
      { text: 'er', ipa: 'səɹ', stress: 'unstressed', phonemes: ['s', 'ə', 'ɹ'] },
      { text: 'cise', ipa: 'saɪz', stress: 'unstressed', phonemes: ['s', 'aɪ', 'z'] },
    ],
  },
  'music': {
    canonicalIpa: 'ˈmjuːzɪk',
    syllables: [
      { text: 'mu', ipa: 'ˈmjuː', stress: 'primary', phonemes: ['m', 'j', 'uː'] },
      { text: 'sic', ipa: 'zɪk', stress: 'unstressed', phonemes: ['z', 'ɪ', 'k'] },
    ],
  },
  'television': {
    canonicalIpa: 'ˈtɛləˌvɪʒən',
    syllables: [
      { text: 'te', ipa: 'ˈtɛ', phoneticSpelling: 'te', stress: 'primary', phonemes: ['t', 'ɛ'] },
      { text: 'le', ipa: 'lə', phoneticSpelling: 'le', stress: 'unstressed', phonemes: ['l', 'ə'] },
      { text: 'vi', ipa: 'ˌvɪ', phoneticSpelling: 'vi', stress: 'secondary', phonemes: ['v', 'ɪ'] },
      { text: 'sion', ipa: 'ʒən', phoneticSpelling: 'zhun', stress: 'unstressed', phonemes: ['ʒ', 'ə', 'n'] },
    ],
  },
  'outside': {
    canonicalIpa: 'ˌaʊtˈsaɪd',
    syllables: [
      { text: 'out', ipa: 'ˌaʊt', stress: 'secondary', phonemes: ['aʊ', 't'] },
      { text: 'side', ipa: 'ˈsaɪd', stress: 'primary', phonemes: ['s', 'aɪ', 'd'] },
    ],
  },
  'bedroom': {
    canonicalIpa: 'ˈbɛdɹuːm',
    syllables: [
      { text: 'bed', ipa: 'ˈbɛd', stress: 'primary', phonemes: ['b', 'ɛ', 'd'] },
      { text: 'room', ipa: 'ɹuːm', stress: 'unstressed', phonemes: ['ɹ', 'uː', 'm'] },
    ],
  },
  'kitchen': {
    canonicalIpa: 'ˈkɪtʃən',
    syllables: [
      { text: 'kitch', ipa: 'ˈkɪtʃ', stress: 'primary', phonemes: ['k', 'ɪ', 'tʃ'] },
      { text: 'en', ipa: 'ən', stress: 'unstressed', phonemes: ['ə', 'n'] },
    ],
  },
  'garden': {
    canonicalIpa: 'ˈɡɑːɹdən',
    syllables: [
      { text: 'gar', ipa: 'ˈɡɑːɹ', stress: 'primary', phonemes: ['ɡ', 'ɑː', 'ɹ'] },
      { text: 'den', ipa: 'dən', stress: 'unstressed', phonemes: ['d', 'ə', 'n'] },
    ],
  },
  'practice': {
    canonicalIpa: 'ˈpɹæktɪs',
    syllables: [
      { text: 'prac', ipa: 'ˈpɹæk', stress: 'primary', phonemes: ['p', 'ɹ', 'æ', 'k'] },
      { text: 'tice', ipa: 'tɪs', stress: 'unstressed', phonemes: ['t', 'ɪ', 's'] },
    ],
  },
  'reading': {
    canonicalIpa: 'ˈɹiːdɪŋ',
    syllables: [
      { text: 'read', ipa: 'ˈɹiː', stress: 'primary', phonemes: ['ɹ', 'iː'] },
      { text: 'ing', ipa: 'dɪŋ', stress: 'unstressed', phonemes: ['d', 'ɪ', 'ŋ'] },
    ],
  },
  'walking': {
    canonicalIpa: 'ˈwɔːkɪŋ',
    syllables: [
      { text: 'walk', ipa: 'ˈwɔː', stress: 'primary', phonemes: ['w', 'ɔː'] },
      { text: 'ing', ipa: 'kɪŋ', stress: 'unstressed', phonemes: ['k', 'ɪ', 'ŋ'] },
    ],
  },
  'computer': {
    canonicalIpa: 'kəmˈpjuːtəɹ',
    syllables: [
      { text: 'com', ipa: 'kəm', stress: 'unstressed', phonemes: ['k', 'ə', 'm'] },
      { text: 'pu', ipa: 'ˈpjuː', stress: 'primary', phonemes: ['p', 'j', 'uː'] },
      { text: 'ter', ipa: 'təɹ', stress: 'unstressed', phonemes: ['t', 'ə', 'ɹ'] },
    ],
  },
  'calendar': {
    canonicalIpa: 'ˈkæləndəɹ',
    syllables: [
      { text: 'cal', ipa: 'ˈkæ', stress: 'primary', phonemes: ['k', 'æ'] },
      { text: 'en', ipa: 'lən', stress: 'unstressed', phonemes: ['l', 'ə', 'n'] },
      { text: 'dar', ipa: 'dəɹ', stress: 'unstressed', phonemes: ['d', 'ə', 'ɹ'] },
    ],
  },
  'umbrella': {
    canonicalIpa: 'ʌmˈbɹɛlə',
    syllables: [
      { text: 'um', ipa: 'ʌm', stress: 'unstressed', phonemes: ['ʌ', 'm'] },
      { text: 'brel', ipa: 'ˈbɹɛ', stress: 'primary', phonemes: ['b', 'ɹ', 'ɛ'] },
      { text: 'la', ipa: 'lə', stress: 'unstressed', phonemes: ['l', 'ə'] },
    ],
  },
  'together': {
    canonicalIpa: 'təˈɡɛðəɹ',
    syllables: [
      { text: 'to', ipa: 'tə', stress: 'unstressed', phonemes: ['t', 'ə'] },
      { text: 'geth', ipa: 'ˈɡɛð', stress: 'primary', phonemes: ['ɡ', 'ɛ', 'ð'] },
      { text: 'er', ipa: 'əɹ', stress: 'unstressed', phonemes: ['ə', 'ɹ'] },
    ],
  },
  'important': {
    canonicalIpa: 'ɪmˈpɔːɹtənt',
    syllables: [
      { text: 'im', ipa: 'ɪm', stress: 'unstressed', phonemes: ['ɪ', 'm'] },
      { text: 'por', ipa: 'ˈpɔːɹ', stress: 'primary', phonemes: ['p', 'ɔː', 'ɹ'] },
      { text: 'tant', ipa: 'tənt', stress: 'unstressed', phonemes: ['t', 'ə', 'n', 't'] },
    ],
  },
  'remember': {
    canonicalIpa: 'ɹɪˈmɛmbəɹ',
    syllables: [
      { text: 're', ipa: 'ɹɪ', stress: 'unstressed', phonemes: ['ɹ', 'ɪ'] },
      { text: 'mem', ipa: 'ˈmɛm', stress: 'primary', phonemes: ['m', 'ɛ', 'm'] },
      { text: 'ber', ipa: 'bəɹ', stress: 'unstressed', phonemes: ['b', 'ə', 'ɹ'] },
    ],
  },
  'wonderful': {
    canonicalIpa: 'ˈwʌndəɹfəl',
    syllables: [
      { text: 'won', ipa: 'ˈwʌn', stress: 'primary', phonemes: ['w', 'ʌ', 'n'] },
      { text: 'der', ipa: 'dəɹ', stress: 'unstressed', phonemes: ['d', 'ə', 'ɹ'] },
      { text: 'ful', ipa: 'fəl', stress: 'unstressed', phonemes: ['f', 'ə', 'l'] },
    ],
  },
};
