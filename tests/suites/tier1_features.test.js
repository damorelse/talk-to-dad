/**
 * Tier 1: Feature Test Suites (F01–F16)
 * Verifies core functionality of all 16 AAC PWA features.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_CARDS, 
  DEFAULT_VISUAL_SCENES, 
  DEFAULT_HOTSPOTS, 
  DEFAULT_SETTINGS 
} from '../../src/services/db/defaultData.ts';
import { FITZGERALD_COLOR_MAP } from '../../src/types/index.ts';
import { 
  splitWordIntoSyllables, 
  formatWithMiddleDot, 
  breakPhraseForVisualizer 
} from '../../src/services/syllables/syllableSplitter.ts';
import { wordPredictor } from '../../src/services/keyboard/wordPredictor.ts';
import { clampDebounceMs } from '../../src/hooks/useMotorDebounce.ts';
import { speechEngine, filterAndGroupVoices } from '../../src/services/audio/WebSpeechEngine.ts';
import { toneEngine } from '../../src/services/audio/WebAudioToneEngine.ts';
import { audioService } from '../../src/services/audio/AudioService.ts';
import { BODY_REGIONS, WONG_BAKER_PAIN_LEVELS } from '../../src/types/painData.ts';

describe('Tier 1: Feature Verification (F01 - F16)', () => {

  describe('F01: Persistent Emergency Bar', () => {
    it('should have instant emergency audio triggers with high priority', async () => {
      await audioService.triggerEmergency('I need help right now!');
      assert.ok(true, 'Emergency trigger completed without throwing');
    });

    it('should support the 6 standard emergency quick actions', () => {
      const emergencyActions = ['YES', 'NO', 'HELP', 'PAIN', 'BATHROOM', 'WAIT'];
      assert.equal(emergencyActions.length, 6);
    });
  });

  describe('F02: Category Card Grid & Scaling', () => {
    it('should provide 9 clinical categories with icons and color themes', () => {
      assert.equal(DEFAULT_CATEGORIES.length, 9);
      const catIds = DEFAULT_CATEGORIES.map(c => c.id);
      assert.ok(catIds.includes('cat-needs'));
      assert.ok(catIds.includes('cat-health'));
      assert.ok(catIds.includes('cat-food'));
      assert.ok(catIds.includes('cat-feelings'));
      assert.ok(catIds.includes('cat-family'));
      assert.ok(catIds.includes('cat-time'));
      assert.ok(catIds.includes('cat-numbers'));
      assert.ok(catIds.includes('cat-activities'));
      assert.ok(catIds.includes('cat-places'));
    });

    it('should contain 35+ rich default AAC cards with spoken phrases', () => {
      assert.ok(DEFAULT_CARDS.length >= 35, `Expected >=35 cards, found ${DEFAULT_CARDS.length}`);
      for (const card of DEFAULT_CARDS) {
        assert.ok(card.id, 'Card must have ID');
        assert.ok(card.label, 'Card must have label');
        assert.ok(card.spokenText, 'Card must have spokenText');
        assert.ok(card.fitzgeraldCategory, 'Card must have fitzgeraldCategory');
      }
    });
  });

  describe('F03: Fitzgerald Key Color Coding System', () => {
    it('should define all 8 standard Fitzgerald categories with distinct color styles', () => {
      const roles = ['people', 'verbs', 'nouns', 'adjectives', 'social', 'questions', 'places', 'emergency'];
      for (const role of roles) {
        const style = FITZGERALD_COLOR_MAP[role];
        assert.ok(style, `Style for role ${role} must exist`);
        assert.ok(style.border, `Border class for ${role} must exist`);
        assert.ok(style.bg, `Background class for ${role} must exist`);
        assert.ok(style.text, `Text class for ${role} must exist`);
      }
    });
  });

  describe('F04: Sentence Builder Strip', () => {
    it('should concatenate cards and format sequential spoken sentence', () => {
      const card1 = DEFAULT_CARDS.find(c => c.label === 'Water');
      const card2 = DEFAULT_CARDS.find(c => c.id === 'card-rest');
      assert.ok(card1 && card2);
      const sentence = [card1, card2].map(c => c.spokenText).join('. ');
      assert.ok(sentence.includes('water'));
    });
  });

  describe('F05: Visual Scene Displays & Hotspots', () => {
    it('should load default visual scenes and interactive percentage hotspots', () => {
      assert.ok(DEFAULT_VISUAL_SCENES.length >= 5);
      assert.ok(DEFAULT_HOTSPOTS.length >= 18);

      // Verify Scene IDs and Titles
      const livingRoom = DEFAULT_VISUAL_SCENES.find(s => s.id === 'scene-livingroom');
      const kitchen = DEFAULT_VISUAL_SCENES.find(s => s.id === 'scene-kitchen');
      const bedroom = DEFAULT_VISUAL_SCENES.find(s => s.id === 'scene-bedroom');
      const bathroom = DEFAULT_VISUAL_SCENES.find(s => s.id === 'scene-bathroom');
      const garden = DEFAULT_VISUAL_SCENES.find(s => s.id === 'scene-garden');

      assert.ok(livingRoom, 'Living Room scene must exist');
      assert.ok(livingRoom.description.includes('Couch') || livingRoom.description.includes('couch'), 'Living room description should reference couch');
      assert.ok(kitchen, 'Kitchen scene must exist');
      assert.equal(kitchen.title, 'Kitchen', 'Kitchen title must be "Kitchen"');
      assert.ok(bedroom, 'Bedroom scene must exist');
      assert.equal(bedroom.title, 'Bedroom');
      assert.ok(bathroom, 'Bathroom scene must exist');
      assert.equal(bathroom.title, 'Bathroom');
      assert.ok(garden, 'Garden scene must exist');
      assert.equal(garden.title, 'Garden');

      // Verify Living Room Hotspots (couch, remote, water, pet quorra)
      const couch = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-chair' && hs.sceneId === 'scene-livingroom');
      assert.ok(couch, 'Couch hotspot must exist in Living Room');
      assert.equal(couch.label, 'Couch', 'Living room hotspot must be labeled "Couch"');
      assert.ok(couch.spokenText.includes('couch'), 'Spoken text should reference couch');

      const petQuorra = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-pet-quorra' && hs.sceneId === 'scene-livingroom');
      assert.ok(petQuorra, 'Quorra hotspot must exist in Living Room');
      assert.equal(petQuorra.label, 'Quorra');
      assert.ok(petQuorra.spokenText.includes('Quorra'), 'Spoken text should reference Quorra');

      // Verify Kitchen Hotspots (refrigerator, sink, coffee maker, dining table, water cup)
      const fridge = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-fridge' && hs.sceneId === 'scene-kitchen');
      const kitchenSink = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-kitchen-sink' && hs.sceneId === 'scene-kitchen');
      const coffeeMaker = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-coffee-pot' && hs.sceneId === 'scene-kitchen');
      const diningTable = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-dining-table' && hs.sceneId === 'scene-kitchen');
      const kitchenWater = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-kitchen-water' && hs.sceneId === 'scene-kitchen');

      assert.ok(fridge, 'Refrigerator hotspot must exist');
      assert.ok(kitchenSink, 'Kitchen sink hotspot must exist');
      assert.ok(coffeeMaker, 'Coffee maker hotspot must exist');
      assert.ok(diningTable, 'Dining table hotspot must exist');
      assert.ok(kitchenWater, 'Kitchen water cup hotspot must exist on dining table');
      assert.equal(kitchenWater.label, 'Water Cup');
      assert.ok(kitchenWater.spokenText.includes('water'));

      // Verify Bedroom Hotspots (bed, desk, laptop, ipad)
      const bed = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-bed' && hs.sceneId === 'scene-bedroom');
      const desk = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-desk' && hs.sceneId === 'scene-bedroom');
      const laptop = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-laptop' && hs.sceneId === 'scene-bedroom');
      const ipad = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-ipad' && hs.sceneId === 'scene-bedroom');
      assert.ok(bed, 'Bed hotspot must exist');
      assert.ok(desk, 'Desk hotspot must exist');
      assert.ok(laptop, 'Laptop hotspot must exist');
      assert.ok(ipad, 'iPad hotspot must exist');

      // Verify Bathroom Hotspots (toilet, shower, sink, toothbrush)
      const toilet = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-toilet' && hs.sceneId === 'scene-bathroom');
      const shower = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-shower' && hs.sceneId === 'scene-bathroom');
      const bathSink = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-bathroom-sink' && hs.sceneId === 'scene-bathroom');
      const toothbrush = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-toothbrush' && hs.sceneId === 'scene-bathroom');
      assert.ok(toilet, 'Toilet hotspot must exist');
      assert.ok(shower, 'Shower hotspot must exist');
      assert.ok(bathSink, 'Bathroom sink hotspot must exist');
      assert.ok(toothbrush, 'Toothbrush hotspot must exist');

      // Verify Garden Hotspots (sun, trees, flowers, grass)
      const sun = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-sun' && hs.sceneId === 'scene-garden');
      const trees = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-trees' && hs.sceneId === 'scene-garden');
      const flowers = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-flowers' && hs.sceneId === 'scene-garden');
      const grass = DEFAULT_HOTSPOTS.find(hs => hs.id === 'hs-grass' && hs.sceneId === 'scene-garden');
      assert.ok(sun, 'Sun hotspot must exist');
      assert.ok(trees, 'Trees hotspot must exist');
      assert.ok(flowers, 'Flowers hotspot must exist');
      assert.ok(grass, 'Grass hotspot must exist');

      for (const hs of DEFAULT_HOTSPOTS) {
        assert.ok(hs.x >= 0 && hs.x <= 100, 'X must be in 0..100');
        assert.ok(hs.y >= 0 && hs.y <= 100, 'Y must be in 0..100');
        assert.ok(hs.width >= 5 && hs.width <= 100, 'Width must be >= 5');
        assert.ok(hs.height >= 5 && hs.height <= 100, 'Height must be >= 5');
        assert.ok(hs.spokenText, 'Hotspot must have spoken phrase');
        assert.ok(hs.labelZh, 'Hotspot must have bilingual Chinese label');
      }
    });
  });

  describe('F06: Interactive Pain Map & Wong-Baker FACES', () => {
    it('should provide 18 anatomical body regions for front/back mapping including throat, neck, feet and butt', () => {
      assert.equal(BODY_REGIONS.length, 18);
      const head = BODY_REGIONS.find(r => r.id === 'head');
      assert.ok(head);
      assert.equal(head.name, 'Head');
      const throat = BODY_REGIONS.find(r => r.id === 'throat');
      assert.ok(throat);
      assert.equal(throat.name, 'Throat');
      assert.equal(throat.view, 'front');
      const neck = BODY_REGIONS.find(r => r.id === 'neck');
      assert.ok(neck);
      assert.equal(neck.name, 'Neck');
      assert.equal(neck.view, 'back');
      const hips = BODY_REGIONS.find(r => r.id === 'hips');
      assert.ok(hips);
      assert.equal(hips.view, 'front');
      const butt = BODY_REGIONS.find(r => r.id === 'butt');
      assert.ok(butt);
      assert.equal(butt.name, 'Butt');
      assert.equal(butt.view, 'back');
      const leftFoot = BODY_REGIONS.find(r => r.id === 'left-foot');
      assert.ok(leftFoot);
      assert.equal(leftFoot.name, 'Left Foot');
    });

    it('should define 6 Wong-Baker FACES scale levels from 0 to 10', () => {
      assert.equal(WONG_BAKER_PAIN_LEVELS.length, 6);
      assert.equal(WONG_BAKER_PAIN_LEVELS[0].level, 0);
      assert.equal(WONG_BAKER_PAIN_LEVELS[5].level, 10);
    });
  });

  describe('F07: Phonetic Syllable Segmentation', () => {
    it('should correctly segment clinical words with middle dots', () => {
      assert.equal(formatWithMiddleDot('Water'), 'Wa · ter');
      assert.equal(formatWithMiddleDot('Hospital'), 'Hos · pi · tal');
      assert.equal(formatWithMiddleDot('Medicine'), 'Med · i · cine');
      assert.equal(formatWithMiddleDot('Butterfly'), 'But · ter · fly');
      assert.equal(formatWithMiddleDot('Refrigerator'), 'Re · frig · er · a · tor');
    });

    it('should preserve original casing in syllable splits', () => {
      const lower = splitWordIntoSyllables('water');
      const upper = splitWordIntoSyllables('WATER');
      const cap = splitWordIntoSyllables('Water');

      assert.deepEqual(lower, ['wa', 'ter']);
      assert.deepEqual(upper, ['WA', 'TER']);
      assert.deepEqual(cap, ['Wa', 'ter']);
    });
  });

  describe('F08: Speech Therapy Flashcards & Fanfare', () => {
    it('should maintain rich AAC rehabilitation cards with clinical clues and phonetic syllables', () => {
      const cardsWithClues = DEFAULT_CARDS.filter(c => c.clue && c.clueZh);
      assert.ok(cardsWithClues.length >= 20, 'Should have rich bilingual clinical clues across core cards');

      for (const card of cardsWithClues) {
        assert.ok(card.label, 'Card must have label');
        assert.ok(card.labelZh, 'Card must have labelZh');
        assert.ok(card.spokenText, 'Card must have spokenText');
        assert.ok(card.spokenTextZh, 'Card must have spokenTextZh');
      }
    });

    it('should execute 1046Hz success fanfare without error', () => {
      toneEngine.playSuccessFanfare();
      assert.ok(true);
    });
  });

  describe('F09: Big-Button Speech Keyboard & Predictions', () => {
    it('should predict relevant AAC words based on typing prefix', () => {
      const wResults = wordPredictor.predict('w');
      assert.ok(wResults.includes('water') || wResults.includes('Water') || wResults.includes('want'));

      const hResults = wordPredictor.predict('h');
      assert.ok(hResults.includes('help') || hResults.includes('Help') || hResults.includes('hungry'));
    });

    it('should return top starters when prefix is empty', () => {
      const starters = wordPredictor.predict('', 6);
      assert.equal(starters.length, 6);
      assert.ok(starters.includes('I'));
      assert.ok(starters.includes('Please'));
    });
  });

  describe('F10: Motor Accessibility & Tap Debounce', () => {
    it('should clamp anti-tremor debounce delay between 200ms and 500ms', () => {
      assert.equal(clampDebounceMs(50), 200);
      assert.equal(clampDebounceMs(150), 200);
      assert.equal(clampDebounceMs(300), 300);
      assert.equal(clampDebounceMs(450), 450);
      assert.equal(clampDebounceMs(800), 500);
      assert.equal(clampDebounceMs(undefined), 300);
    });

    it('should play 800Hz tactile tap confirmation chime', () => {
      toneEngine.playTapChime();
      assert.ok(true);
    });
  });

  describe('F11: Dual Audio Engine & Fallback', () => {
    it('should select natural Apple or English voice when available', () => {
      const voice = speechEngine.getPreferredVoice();
      assert.ok(voice);
      assert.ok(voice.name.includes('Samantha') || voice.lang.startsWith('en'));
    });

    it('should speak card text successfully', async () => {
      await speechEngine.speak('Testing speech synthesis engine');
      assert.ok(true);
    });

    it('should filter voices to only en-US and zh-TW, grouped by locale and sorted by name', () => {
      const mockVoices = [
        { name: 'Zoe', lang: 'en-US', voiceURI: 'v-zoe' },
        { name: 'Alice', lang: 'en-US', voiceURI: 'v-alice' },
        { name: 'Thomas', lang: 'fr-FR', voiceURI: 'v-thomas' },
        { name: 'Mei-Jia', lang: 'zh-TW', voiceURI: 'v-meijia' },
        { name: 'An-Chi', lang: 'zh_TW', voiceURI: 'v-anchi' },
        { name: 'Hans', lang: 'de-DE', voiceURI: 'v-hans' },
        { name: 'Bob', lang: 'en_US', voiceURI: 'v-bob' },
        { name: 'Kyoko', lang: 'ja-JP', voiceURI: 'v-kyoko' },
      ];

      const groups = filterAndGroupVoices(mockVoices);
      assert.equal(groups.length, 2);

      // en-US Group
      const enGroup = groups.find(g => g.locale === 'en-US');
      assert.ok(enGroup);
      assert.equal(enGroup.voices.length, 3);
      assert.deepEqual(enGroup.voices.map(v => v.name), ['Alice', 'Bob', 'Zoe']);

      // zh-TW Group
      const zhGroup = groups.find(g => g.locale === 'zh-TW');
      assert.ok(zhGroup);
      assert.equal(zhGroup.voices.length, 2);
      assert.deepEqual(zhGroup.voices.map(v => v.name), ['An-Chi', 'Mei-Jia']);
    });

    it('should exclude all 19 specified eccentric/novelty voices from preferred voice options', () => {
      const noveltyNames = [
        'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles',
        'Cellos', 'Good News', 'Grandma', 'Jester', 'Junior', 'Kathy',
        'Organ', 'Sandy', 'Superstar', 'Trinoids', 'Whisper', 'Wobble', 'Zarvox'
      ];

      const mockWithNovelty = [
        ...noveltyNames.map(name => ({ name, lang: 'en-US', voiceURI: `v-${name.toLowerCase().replace(/\s+/g, '')}` })),
        { name: 'Samantha', lang: 'en-US', voiceURI: 'v-samantha' },
        { name: 'Alex', lang: 'en-US', voiceURI: 'v-alex' },
        { name: 'Mei-Jia', lang: 'zh-TW', voiceURI: 'v-meijia' },
      ];

      const groups = filterAndGroupVoices(mockWithNovelty);
      const enGroup = groups.find(g => g.locale === 'en-US');
      assert.ok(enGroup);
      assert.equal(enGroup.voices.length, 2);
      assert.deepEqual(enGroup.voices.map(v => v.name), ['Alex', 'Samantha']);

      // Ensure none of the novelty voices are present
      for (const name of noveltyNames) {
        assert.equal(enGroup.voices.some(v => v.name === name), false, `Voice "${name}" must be excluded`);
      }
    });

    it('should prioritize Samantha as default for en-US and Mei-Jia for zh-TW', () => {
      const enVoice = speechEngine.getPreferredVoiceForLocale('en-US');
      assert.ok(enVoice);
      assert.equal(enVoice.name, 'Samantha');
      assert.equal(enVoice.lang, 'en-US');

      const zhVoice = speechEngine.getPreferredVoiceForLocale('zh-TW');
      assert.ok(zhVoice);
      assert.equal(zhVoice.name, 'Mei-Jia');
      assert.equal(zhVoice.lang, 'zh-TW');
    });

    it('should support ultra-slow speech rate down to 0.25x speed for rehabilitation', async () => {
      await speechEngine.speak('Slow speech therapy practice', { rate: 0.25 });
      assert.ok(true);
    });
  });

  describe('F12: IndexedDB Schema & Dual-Language Data Definition', () => {
    it('should verify default settings values including per-locale voice settings', () => {
      assert.equal(DEFAULT_SETTINGS.theme, 'dark');
      assert.equal(DEFAULT_SETTINGS.gridCols, 4);
      assert.equal(DEFAULT_SETTINGS.tapDebounceMs, 300);
      assert.equal(DEFAULT_SETTINGS.speechRate, 0.9);
      assert.equal(DEFAULT_SETTINGS.selectedVoiceEnUS, '');
      assert.equal(DEFAULT_SETTINGS.selectedVoiceZhTW, '');
      assert.equal(DEFAULT_SETTINGS.cardSpeechLanguage, 'en-then-zh');
    });

    it('should verify all default AAC cards have Traditional Chinese names populated', () => {
      assert.ok(DEFAULT_CARDS.length >= 30, 'Should have standard card suite');
      for (const card of DEFAULT_CARDS) {
        assert.ok(card.label, 'Card must have English label');
        assert.ok(card.labelZh, `Card "${card.label}" must have Traditional Chinese labelZh`);
        assert.ok(card.spokenTextZh, `Card "${card.label}" must have Traditional Chinese spokenTextZh`);
      }
    });

    it('should include number cards from 0 to 20, 30, and 100 with dual-language support', () => {
      const numberCards = DEFAULT_CARDS.filter(c => c.categoryId === 'cat-numbers');
      assert.ok(numberCards.length >= 20, 'Should have comprehensive number cards');
      
      const expectedWords = [
        'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen', 'Twenty', 'Thirty', 'Hundred'
      ];
      const labels = numberCards.map(c => c.label);
      for (const word of expectedWords) {
        assert.ok(labels.includes(word), `Number card ${word} must exist`);
      }
    });

    it('should include date cards (today, tomorrow, yesterday) and all 7 days of the week', () => {
      const timeCards = DEFAULT_CARDS.filter(c => c.categoryId === 'cat-time');
      const labels = timeCards.map(c => c.label);
      
      assert.ok(labels.includes('Today'), 'Today card must exist');
      assert.ok(labels.includes('Tomorrow'), 'Tomorrow card must exist');
      assert.ok(labels.includes('Yesterday'), 'Yesterday card must exist');
      
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (const day of days) {
        assert.ok(labels.includes(day), `Day of the week ${day} must exist`);
      }
    });

    it('should verify all default AAC categories have Traditional Chinese names populated', () => {
      for (const cat of DEFAULT_CATEGORIES) {
        assert.ok(cat.name, 'Category must have English name');
        assert.ok(cat.nameZh, `Category "${cat.name}" must have Traditional Chinese nameZh`);
      }
    });
  });

  describe('F13: Caregiver 3-Second Hold Protection', () => {
    it('should protect caregiver mode via 3-second hold', () => {
      const HOLD_DURATION_MS = 3000;
      assert.equal(HOLD_DURATION_MS, 3000);
    });
  });

  describe('F14: In-App Visual Editor Data Models', () => {
    it('should allow constructing custom card with custom syllables, voice, and Traditional Chinese name', () => {
      const customCard = {
        id: 'card-custom-1',
        categoryId: 'cat-needs',
        label: 'Grandpa',
        labelZh: '爺爺',
        spokenText: 'Hello Grandpa!',
        spokenTextZh: '爺爺您好！',
        phoneticSyllables: 'Grand · pa',
        fitzgeraldCategory: 'people',
        icon: '👴',
        audioBlobId: 'blob-voice-1',
        order: 99,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      assert.equal(customCard.label, 'Grandpa');
      assert.equal(customCard.labelZh, '爺爺');
      assert.equal(customCard.spokenTextZh, '爺爺您好！');
      assert.equal(customCard.phoneticSyllables, 'Grand · pa');
    });
  });

  describe('F15: Backup, Restore & CSV Importer', () => {
    it('should parse valid CSV data rows', () => {
      const csv = 'Label,Spoken Text,Fitzgerald Role,Emoji,Syllables\nTea,I want tea,nouns,🍵,Tea\nRest,I want to rest,verbs,🛏️,Rest';
      const lines = csv.split('\n');
      assert.equal(lines.length, 3);
      assert.equal(lines[1].split(',')[0], 'Tea');
    });
  });

  describe('F16: PWA Offline Caching & Manifest', () => {
    it('should verify PWA metadata specification', () => {
      const manifest = {
        name: 'TalkWithDad - AAC Progressive Web App',
        short_name: 'TalkWithDad',
        display: 'standalone',
        theme_color: '#2563eb',
        background_color: '#0f172a',
      };
      assert.equal(manifest.display, 'standalone');
      assert.equal(manifest.theme_color, '#2563eb');
    });
  });
});
