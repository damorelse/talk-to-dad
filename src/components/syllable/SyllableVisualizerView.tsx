import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SyllableCard } from './SyllableCard.tsx';
import { CategorySelector } from '../grid/CategorySelector.tsx';
import { DebouncedTouchable } from '../common/DebouncedTouchable.tsx';
import { usePiperSyllables } from '../../hooks/usePiperSyllables.ts';
import { useSettings } from '../../hooks/useSettings.ts';
import { speechEngine, isChineseText } from '../../services/audio/WebSpeechEngine.ts';
import { getZhuyinForChar } from '../../services/syllables/zhuyinDictionary.ts';
import { getWeeklyCardsForCategory } from '../../services/therapy/weeklyCardSelector.ts';
import type { AACCard, AACCategory, SyllablePhonemeData } from '../../types/index.ts';
import {
  Volume2,
  MessageSquareQuote,
  Square,
  Languages,
  Search,
  X,
} from 'lucide-react';

export interface SyllableVisualizerViewProps {
  categories?: AACCategory[];
  cards?: AACCard[];
}

export interface SoundItOutVocabItem {
  id: string;
  cardId: string;
  categoryId: string;
  categoryName?: string;
  categoryNameZh?: string;
  icon?: string;
  wordEn: string;
  wordZh: string;
  spokenTextEn?: string;
  spokenTextZh?: string;
  phoneticSyllables?: string;
  isPhrase: boolean;
  isWeeklyTherapy: boolean;
  isFavorite: boolean;
  order: number;
}

export const SyllableVisualizerView: React.FC<SyllableVisualizerViewProps> = ({
  categories: propCategories = [],
  cards: propCards = [],
}) => {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [customInput, setCustomInput] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('weekly');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vocabMode, setVocabMode] = useState<'words' | 'phrases'>('words');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isCustomActive, setIsCustomActive] = useState<boolean>(false);

  const allCategories = propCategories;
  const allCards = propCards;

  // Chinese articulation states
  const [zhActiveIdx, setZhActiveIdx] = useState<number | null>(null);
  const [isZhPlaying, setIsZhPlaying] = useState<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const {
    word,
    setWord,
    speed,
    pronunciationData,
    activeSyllableIdx,
    isPlaying: isEnPlaying,
    playSingleSyllable,
    playIndividualPhoneme,
    soundItOut: soundItOutEn,
    speakWholeWord: speakWholeWordEn,
    stop: stopEn,
  } = usePiperSyllables('Water', 0.5);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      isPlayingRef.current = false;
      speechEngine.cancel();
    };
  }, []);

  const { settings } = useSettings();
  const weeklyCount = settings?.weeklyFocusCardsPerCategory ?? 2;

  // Compute the set of card IDs selected for this week's Word Finding therapy per category
  const weeklyCardIdSet = useMemo(() => {
    const set = new Set<string>();
    for (const cat of allCategories) {
      const weekly = getWeeklyCardsForCategory(allCards, cat.id, undefined, weeklyCount);
      for (const c of weekly) {
        set.add(c.id);
      }
    }
    return set;
  }, [allCategories, allCards, weeklyCount]);

  // Extract vocabulary items from AAC cards (splitting slashes and handling word vs phrase modes)
  const allVocabItems = useMemo<SoundItOutVocabItem[]>(() => {
    const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));
    const items: SoundItOutVocabItem[] = [];

    for (const card of allCards) {
      const cat = categoryMap.get(card.categoryId);
      const isWeekly = weeklyCardIdSet.has(card.id);
      const isFav = !!card.isFavorite;

      if (vocabMode === 'words') {
        // Split labels by slashes (e.g. "Rest / Nap", "水 / 喝水")
        const enParts = (card.label || '').split(/\s*[\/／]\s*/).map((s) => s.trim()).filter(Boolean);
        const zhParts = (card.labelZh || '').split(/\s*[\/／]\s*/).map((s) => s.trim()).filter(Boolean);

        const count = Math.max(enParts.length, zhParts.length, 1);
        for (let i = 0; i < count; i++) {
          const wEn = enParts[i] || enParts[0] || card.label || 'Word';
          const wZh = zhParts[i] || zhParts[0] || card.labelZh || wEn;
          const phonetic = (enParts.length === 1) ? card.phoneticSyllables : undefined;

          items.push({
            id: `${card.id}-w${i}`,
            cardId: card.id,
            categoryId: card.categoryId,
            categoryName: cat?.name,
            categoryNameZh: cat?.nameZh,
            icon: card.icon,
            wordEn: wEn,
            wordZh: wZh,
            spokenTextEn: card.spokenText,
            spokenTextZh: card.spokenTextZh,
            phoneticSyllables: phonetic,
            isPhrase: false,
            isWeeklyTherapy: isWeekly,
            isFavorite: isFav,
            order: card.order || 0,
          });
        }
      } else {
        // Phrase mode: spoken text sentences
        const wEn = card.spokenText || card.label || 'Word';
        const wZh = card.spokenTextZh || card.labelZh || wEn;

        items.push({
          id: `${card.id}-phrase`,
          cardId: card.id,
          categoryId: card.categoryId,
          categoryName: cat?.name,
          categoryNameZh: cat?.nameZh,
          icon: card.icon,
          wordEn: wEn,
          wordZh: wZh,
          spokenTextEn: card.spokenText,
          spokenTextZh: card.spokenTextZh,
          phoneticSyllables: undefined,
          isPhrase: true,
          isWeeklyTherapy: isWeekly,
          isFavorite: isFav,
          order: card.order || 0,
        });
      }
    }

    return items;
  }, [allCards, allCategories, weeklyCardIdSet, vocabMode]);

  // Set initial selected card on mount once cards are loaded
  const initialSelectionDoneRef = useRef(false);
  useEffect(() => {
    if (allVocabItems.length > 0 && !initialSelectionDoneRef.current) {
      initialSelectionDoneRef.current = true;
      const initialItem = allVocabItems.find((i) => i.isWeeklyTherapy) || allVocabItems[0];
      if (initialItem) {
        setSelectedItemId(initialItem.id);
        const targetWord = language === 'zh' ? initialItem.wordZh : initialItem.wordEn;
        setWord(targetWord);
      }
    }
  }, [allVocabItems, language, setWord]);

  // Filtered vocabulary list based on active category & search query
  const filteredVocabList = useMemo(() => {
    let list = allVocabItems;

    if (selectedCategoryId === 'weekly') {
      list = list.filter((item) => item.isWeeklyTherapy);
    } else if (selectedCategoryId === 'favorites') {
      list = list.filter((item) => item.isFavorite);
    } else if (selectedCategoryId !== 'all') {
      list = list.filter((item) => item.categoryId === selectedCategoryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.wordEn.toLowerCase().includes(q) ||
          item.wordZh.toLowerCase().includes(q) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(q)) ||
          (item.categoryNameZh && item.categoryNameZh.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allVocabItems, selectedCategoryId, searchQuery]);

  const isCurrentChinese = isChineseText(word) || language === 'zh';

  const currentSelectedCard = useMemo(() => {
    if (isCustomActive || !selectedItemId) return null;
    return allVocabItems.find((i) => i.id === selectedItemId) || null;
  }, [allVocabItems, selectedItemId, isCustomActive]);

  const stopAll = () => {
    isPlayingRef.current = false;
    speechEngine.cancel();
    stopEn();
    setZhActiveIdx(null);
    setIsZhPlaying(false);
  };

  // Category Selection with Auto-Sync to First Card in New Category
  const handleSelectCategory = (catId: string) => {
    if (catId === selectedCategoryId && !isCustomActive) return;
    stopAll();
    setSelectedCategoryId(catId);
    setIsCustomActive(false);

    // Compute items in the new category
    let nextList = allVocabItems;
    if (catId === 'weekly') {
      nextList = nextList.filter((item) => item.isWeeklyTherapy);
    } else if (catId === 'favorites') {
      nextList = nextList.filter((item) => item.isFavorite);
    } else if (catId !== 'all') {
      nextList = nextList.filter((item) => item.categoryId === catId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      nextList = nextList.filter(
        (item) =>
          item.wordEn.toLowerCase().includes(q) ||
          item.wordZh.toLowerCase().includes(q) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(q)) ||
          (item.categoryNameZh && item.categoryNameZh.toLowerCase().includes(q))
      );
    }

    const firstItem = nextList[0];
    if (firstItem) {
      setSelectedItemId(firstItem.id);
      const targetWord = language === 'zh' ? firstItem.wordZh : firstItem.wordEn;
      setWord(targetWord);
    }
  };

  // Search Query Change with Auto-Sync to Filtered Results
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    stopAll();
    setIsCustomActive(false);

    const q = query.trim().toLowerCase();
    let nextList = allVocabItems;
    if (selectedCategoryId === 'weekly') {
      nextList = nextList.filter((item) => item.isWeeklyTherapy);
    } else if (selectedCategoryId === 'favorites') {
      nextList = nextList.filter((item) => item.isFavorite);
    } else if (selectedCategoryId !== 'all') {
      nextList = nextList.filter((item) => item.categoryId === selectedCategoryId);
    }

    if (q) {
      nextList = nextList.filter(
        (item) =>
          item.wordEn.toLowerCase().includes(q) ||
          item.wordZh.toLowerCase().includes(q) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(q)) ||
          (item.categoryNameZh && item.categoryNameZh.toLowerCase().includes(q))
      );
    }

    // If current selection is not present in the filtered matches, switch active card to first match
    if (nextList.length > 0) {
      const currentStillPresent = nextList.some((i) => i.id === selectedItemId);
      if (!currentStillPresent) {
        const firstItem = nextList[0];
        setSelectedItemId(firstItem.id);
        const targetWord = language === 'zh' ? firstItem.wordZh : firstItem.wordEn;
        setWord(targetWord);
      }
    }
  };

  // Toggle Language Handler
  const handleSelectLanguage = (lang: 'en' | 'zh') => {
    setLanguage(lang);
    stopAll();

    if (selectedItemId && !isCustomActive) {
      const currentItem = allVocabItems.find((i) => i.id === selectedItemId);
      if (currentItem) {
        setWord(lang === 'zh' ? currentItem.wordZh : currentItem.wordEn);
        return;
      }
    }

    const firstItem = filteredVocabList[0] || allVocabItems[0];
    if (firstItem) {
      setSelectedItemId(firstItem.id);
      setWord(lang === 'zh' ? firstItem.wordZh : firstItem.wordEn);
    }
  };

  // Select Vocabulary Item Handler
  const handleSelectVocabItem = (item: SoundItOutVocabItem) => {
    stopAll();
    setSelectedItemId(item.id);
    setIsCustomActive(false);
    const targetWord = language === 'zh' ? item.wordZh : item.wordEn;
    setWord(targetWord);
  };

  // Toggle Word vs Phrase Mode Handler
  const handleSelectVocabMode = (mode: 'words' | 'phrases') => {
    if (mode === vocabMode) return;
    stopAll();
    setVocabMode(mode);

    // Synchronize current card into the new mode
    if (selectedItemId) {
      const currentItem = allVocabItems.find((i) => i.id === selectedItemId);
      if (currentItem) {
        const cardId = currentItem.cardId;
        const targetCard = allCards.find((c) => c.id === cardId);
        if (targetCard) {
          if (mode === 'phrases') {
            const rawW = language === 'zh' ? (targetCard.spokenTextZh || targetCard.labelZh) : (targetCard.spokenText || targetCard.label);
            setWord(rawW || targetCard.label || 'Word');
            setSelectedItemId(`${targetCard.id}-phrase`);
          } else {
            const w = language === 'zh' ? targetCard.labelZh : targetCard.label;
            const cleanW = (w || '').split(/\s*[\/／]\s*/)[0];
            setWord(cleanW || targetCard.label || 'Word');
            setSelectedItemId(`${targetCard.id}-w0`);
          }
        }
      }
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      stopAll();
      const trimmed = customInput.trim();
      if (isChineseText(trimmed)) {
        setLanguage('zh');
      }
      setIsCustomActive(true);
      setSelectedItemId(null);
      setWord(trimmed);
      setCustomInput('');
    }
  };

  // Chinese Syllable stepping handler ("Sound It Out" for Chinese)
  // Sequence: 1. Speaks whole phrase -> 2. Sounds it out character-by-character -> 3. Speaks whole phrase again
  const soundItOutChinese = async () => {
    if (isPlayingRef.current) return;
    setIsZhPlaying(true);
    isPlayingRef.current = true;

    // Filter out punctuation and spaces for individual character voicing
    const chars = Array.from(word).filter((c) => !/[\s，。！？、,!?.]/.test(c));
    const delayMs = Math.round((1.0 / speed) * 450);

    try {
      // STEP 1: Speak the whole Chinese phrase first
      if (isPlayingRef.current) {
        setZhActiveIdx(null);
        await new Promise<void>((resolve) => {
          speechEngine.speak(word, {
            locale: 'zh-TW',
            rate: Math.min(1.0, speed * 1.2),
            onEnd: () => resolve(),
            onError: () => resolve(),
          });
        });
        await new Promise((r) => setTimeout(r, 450));
      }

      // STEP 2: Sound it out character by character
      for (let i = 0; i < chars.length; i++) {
        if (!isPlayingRef.current) break;
        setZhActiveIdx(i);
        await new Promise<void>((resolve) => {
          speechEngine.speak(chars[i], {
            locale: 'zh-TW',
            rate: speed,
            onEnd: () => resolve(),
            onError: () => resolve(),
          });
        });
        if (i < chars.length - 1 && isPlayingRef.current) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }

      // STEP 3: Speak the whole Chinese phrase again
      if (isPlayingRef.current && isMountedRef.current) {
        setZhActiveIdx(null);
        await new Promise((r) => setTimeout(r, 350));
        await new Promise<void>((resolve) => {
          speechEngine.speak(word, {
            locale: 'zh-TW',
            rate: Math.min(1.0, speed * 1.2),
            onEnd: () => resolve(),
            onError: () => resolve(),
          });
        });
      }
    } finally {
      if (isMountedRef.current) {
        setZhActiveIdx(null);
        setIsZhPlaying(false);
        isPlayingRef.current = false;
      }
    }
  };

  // Chinese single syllable click handler
  const playSingleChineseSyllable = (idx: number) => {
    const chars = Array.from(word).filter((c) => !/[\s，。！？、,!?.]/.test(c));
    if (!chars[idx]) return;
    setZhActiveIdx(idx);
    speechEngine.speak(chars[idx], {
      locale: 'zh-TW',
      rate: speed,
      onEnd: () => {
        if (isMountedRef.current) setZhActiveIdx(null);
      },
      onError: () => {
        if (isMountedRef.current) setZhActiveIdx(null);
      },
    });
  };

  const speakWholeWordChinese = () => {
    speechEngine.speak(word, {
      locale: 'zh-TW',
      rate: Math.min(1.0, speed * 1.2),
    });
  };

  // Generate Chinese syllables if current word is Chinese
  const chineseSyllables: SyllablePhonemeData[] = isCurrentChinese
    ? Array.from(word)
        .filter((char) => !/[\s，。！？、,!?.]/.test(char))
        .map((char, idx) => ({
          index: idx,
          text: char,
          ipa: getZhuyinForChar(char),
          phonemes: [char],
          stress: idx === 0 ? 'primary' : 'unstressed',
        }))
    : [];

  const isPlaying = isCurrentChinese ? isZhPlaying : isEnPlaying;
  const currentActiveIdx = isCurrentChinese ? zhActiveIdx : activeSyllableIdx;
  const activePartsCount = isCurrentChinese
    ? chineseSyllables.length
    : (pronunciationData.syllables?.length || 1);
  const hasMultipleParts = activePartsCount > 1;

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-y-auto scrollbar-none p-1 sm:p-2 select-none">
      {/* Top Controls Toolbar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 bg-transparent border border-transparent px-1 py-0.5 sm:py-1 rounded-2xl shrink-0">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Language Selector Toggle with subtle Voice Indicator */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            <button
              type="button"
              onClick={() => handleSelectLanguage('en')}
              className={`
                px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                ${language === 'en' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              <span>English</span>
              {language === 'en' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Piper Neural Speech Active" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSelectLanguage('zh')}
              className={`
                px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                ${language === 'zh' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              <span>中文</span>
              {language === 'zh' && (
                <span className="text-[10px] font-bold text-slate-950 px-1 bg-amber-300 rounded-sm leading-none" title="注音符號 (BoPoMoFo)">注</span>
              )}
            </button>
          </div>

          {/* Phrase vs Sentence Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleSelectVocabMode('words')}
              className={`
                px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer
                ${vocabMode === 'words' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              Phrase
            </button>
            <button
              type="button"
              onClick={() => handleSelectVocabMode('phrases')}
              className={`
                px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer
                ${vocabMode === 'phrases' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              Sentence
            </button>
          </div>
        </div>

        {/* Custom Word Input */}
        <form onSubmit={handleApplyCustom} className="flex items-center gap-1.5 w-full sm:w-72 md:w-80 shrink-0">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type custom word..."
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
          >
            Analyze
          </button>
        </form>
      </div>

      {/* Main Articulation Stage */}
      <div className="w-full shrink-0 min-h-0 bg-transparent border border-transparent rounded-3xl py-1 sm:py-2 px-2 sm:px-6 flex flex-col items-center justify-center gap-1.5 sm:gap-2 relative transition-all duration-200">
        {/* Context Anchor Header (Semantic Clue) */}
        <div className="flex items-center gap-2.5 px-3 py-0 rounded-2xl bg-transparent border border-transparent text-sm sm:text-base font-bold text-slate-300 shrink-0">
          {currentSelectedCard ? (
            <>
              {currentSelectedCard.icon && <span className="text-lg sm:text-2xl leading-none">{currentSelectedCard.icon}</span>}
              <span className="text-white font-black">{currentSelectedCard.wordEn}</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-300 font-bold">{currentSelectedCard.wordZh}</span>
            </>
          ) : (
            <>
              <span className="text-amber-400">✏️</span>
              <span className="text-white font-black">{word}</span>
              <span className="text-slate-400 text-xs">(Custom)</span>
            </>
          )}
        </div>

        {/* Syllable Cards Breakdown Component */}
        <div className="w-full max-w-5xl py-0.5 sm:py-1 flex items-center justify-center">
          <SyllableCard
            word={word}
            syllableData={isCurrentChinese ? chineseSyllables : pronunciationData.syllables}
            activeSyllableIndex={currentActiveIdx}
            onSyllableClick={(_, idx) => {
              if (isCurrentChinese) {
                playSingleChineseSyllable(idx);
              } else {
                playSingleSyllable(idx);
              }
            }}
            onPhonemeClick={(ph) => {
              if (!isCurrentChinese) {
                playIndividualPhoneme(ph);
              }
            }}
            showIpa={true}
            showStress={!isCurrentChinese}
          />
        </div>

        {/* Primary Action Trigger Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center pt-0 sm:pt-0.5 shrink-0">
          {hasMultipleParts && (
            <DebouncedTouchable
              onPress={() => {
                if (isCurrentChinese) {
                  soundItOutChinese();
                } else {
                  soundItOutEn();
                }
              }}
              disabled={isPlaying}
              minTouchSize="lg"
              className={`
                px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl font-black flex items-center gap-2 text-sm sm:text-base shadow-xl transition-all cursor-pointer
                ${
                  isPlaying
                    ? 'bg-amber-600/60 text-white/70 cursor-wait'
                    : 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-amber-900/40 border border-amber-400/30'
                }
              `}
            >
              <MessageSquareQuote className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              <span>Sound It Out</span>
            </DebouncedTouchable>
          )}

          <DebouncedTouchable
            onPress={() => {
              if (isCurrentChinese) {
                speakWholeWordChinese();
              } else {
                speakWholeWordEn();
              }
            }}
            disabled={isPlaying}
            minTouchSize="lg"
            className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl font-black flex items-center gap-2 text-sm sm:text-base shadow-xl shadow-blue-900/40"
          >
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            <span>Speak</span>
          </DebouncedTouchable>

          {isPlaying && (
            <button
              type="button"
              onClick={stopAll}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 sm:py-3 rounded-2xl font-bold flex items-center gap-1.5 text-xs sm:text-sm shadow-lg cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>

      {/* AAC Card Vocabulary Browser - Taller container with single-touch continuous scroll flow */}
      <div className="w-full min-h-[420px] sm:min-h-[500px] md:min-h-[560px] bg-slate-900/90 border border-slate-800/80 p-3 sm:p-4 rounded-2xl flex flex-col gap-3 shadow-xs shrink-0">
        {/* Category Navigation Bar */}
        <div className="shrink-0">
          <CategorySelector
            categories={allCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            showAll={false}
            showWeekly={true}
            showFavorites={true}
          />
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search AAC cards..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Vocabulary Chips Grid - Naturally wraps and displays all cards in one fluid gesture */}
        <div className="w-full flex items-start content-start gap-2 sm:gap-2.5 flex-wrap pb-3">
          {filteredVocabList.length === 0 ? (
            <div className="w-full py-8 text-center text-xs sm:text-sm text-slate-500">
              No matching AAC card vocabulary found
            </div>
          ) : (
            filteredVocabList.map((item) => {
              const isSelected = !isCustomActive && selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectVocabItem(item)}
                  className={`
                    px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border-2 shadow-xs shrink-0
                    ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black ring-2 ring-amber-400/50 shadow-md scale-102'
                        : item.isWeeklyTherapy
                        ? 'bg-slate-950 text-amber-300 hover:bg-slate-800 border-amber-500/40 hover:border-amber-400'
                        : 'bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-white border-slate-800 hover:border-slate-700'
                    }
                  `}
                >
                  {item.icon && <span className="text-base sm:text-lg leading-none shrink-0">{item.icon}</span>}
                  <span className={isSelected ? 'text-slate-950 font-black' : 'text-white'}>
                    {item.wordEn}
                  </span>
                  <span className={`text-[11px] sm:text-xs ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                    · {item.wordZh}
                  </span>
                  {item.isWeeklyTherapy && (
                    <span title="Weekly Therapy Focus" className="text-amber-400 text-xs ml-0.5">
                      ✨
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
