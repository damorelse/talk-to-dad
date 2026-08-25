import React, { useState, useMemo, useCallback } from "react";
import { AACCategory, AACCard } from "../../types";
import { FlashcardDeck } from "./FlashcardDeck";
import { CategorySelector } from "../grid/CategorySelector";
import { DebouncedTouchable } from "../common/DebouncedTouchable";
import { useAudio } from "../../hooks/useAudio";
import { useSettings } from "../../hooks/useSettings";
import { selectWeeklyCards } from "../../services/therapy/weeklyCardSelector";
import {
  QuorraCompanion,
  QuorraAnimationType,
  ALL_CORNER_ANIMATIONS,
  ALL_CROSSING_ANIMATIONS,
} from "./QuorraCompanion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trophy,
  Award,
  Volume2,
} from "lucide-react";

interface TherapySessionViewProps {
  categories: AACCategory[];
  cards: AACCard[];
}

export const TherapySessionView: React.FC<TherapySessionViewProps> = ({
  categories,
  cards,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "favorites">("cat-needs");
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [celebrationActive, setCelebrationActive] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);

  // Quorra Mascot Companion State
  const [quorraAnim, setQuorraAnim] = useState<QuorraAnimationType | null>(null);
  const [quorraAnimKey, setQuorraAnimKey] = useState<number>(0);
  const [quorraCategory, setQuorraCategory] = useState<{ name: string; nameZh?: string }>({
    name: "Daily Needs",
    nameZh: "日常需求",
  });

  const { playSuccess, speakBilingual } = useAudio();
  const { settings } = useSettings();
  const weeklyCount = settings?.weeklyFocusCardsPerCategory ?? 2;

  // Build unified continuous stream of weekly focus cards across all categories
  const allWeeklyCards = useMemo(() => {
    const list: { card: AACCard; category: AACCategory }[] = [];

    // Order categories as defined in DEFAULT_CATEGORIES
    for (let cIdx = 0; cIdx < categories.length; cIdx++) {
      const cat = categories[cIdx];
      const catCards = cards.filter((c) => c.categoryId === cat.id);
      const selCards = selectWeeklyCards(catCards, cat.id, undefined, weeklyCount);
      selCards.forEach((card) => {
        list.push({ card, category: cat });
      });
    }
    return list;
  }, [cards, categories, weeklyCount]);

  const currentItem = allWeeklyCards[cardIndex] || allWeeklyCards[0];
  const currentCard = currentItem?.card;
  const currentCategoryId = currentItem?.category?.id;
  const prevCategoryIdRef = React.useRef<string | null>(null);

  // Trigger 5s top crossing animation on category changes
  const triggerCrossingAnimation = useCallback((name: string, nameZh?: string) => {
    setQuorraCategory({ name, nameZh });
    const randomCrossing = ALL_CROSSING_ANIMATIONS[Math.floor(Math.random() * ALL_CROSSING_ANIMATIONS.length)];
    setQuorraAnim(randomCrossing);
    setQuorraAnimKey((k) => k + 1);
  }, []);

  // Milestone animations on multiples of 3 randomly picked from the 25 corner animations
  const triggerMilestoneAnimation = useCallback(() => {
    const randomAnim = ALL_CORNER_ANIMATIONS[Math.floor(Math.random() * ALL_CORNER_ANIMATIONS.length)];
    setQuorraAnim(randomAnim);
    setQuorraAnimKey((k) => k + 1);
  }, []);

  const handleCompleteAnimation = useCallback(() => {
    setQuorraAnim(null);
  }, []);

  // Synchronize category transitions whenever the active card enters a new category
  React.useEffect(() => {
    if (!currentCategoryId) return;

    if (prevCategoryIdRef.current !== null && prevCategoryIdRef.current !== currentCategoryId) {
      setSelectedCategoryId(currentCategoryId);
      const cat = categories.find((c) => c.id === currentCategoryId);
      if (cat) {
        triggerCrossingAnimation(cat.name, cat.nameZh);
      }
    }

    prevCategoryIdRef.current = currentCategoryId;
  }, [currentCategoryId, categories, triggerCrossingAnimation]);

  // Handle jump when user manually taps a category tab at top
  const handleSelectCategory = (catId: string | "favorites") => {
    setSelectedCategoryId(catId);
    setIsFlipped(false);
    setIsSessionComplete(false);

    if (catId === "favorites") {
      const favIdx = allWeeklyCards.findIndex((item) => item.card.isFavorite);
      if (favIdx !== -1) {
        setCardIndex(favIdx);
      }
      return;
    }

    const firstCardIdx = allWeeklyCards.findIndex((item) => item.category.id === catId);
    if (firstCardIdx !== -1) {
      const isSameCard = cardIndex === firstCardIdx;
      setCardIndex(firstCardIdx);
      const cat = categories.find((c) => c.id === catId);
      if (cat && isSameCard) {
        triggerCrossingAnimation(cat.name, cat.nameZh);
      }
    }
  };

  const handleSpeak = () => {
    if (!currentCard) return;
    if (isFlipped) {
      speakBilingual(currentCard.label, currentCard.labelZh);
    } else {
      const clueText = currentCard.clue || currentCard.spokenText || currentCard.label;
      const clueTextZh = currentCard.clueZh || currentCard.spokenTextZh || currentCard.labelZh;
      speakBilingual(clueText, clueTextZh);
    }
  };

  const handleCorrect = () => {
    // Play 1046Hz success fanfare
    playSuccess();
    const newCorrect = correctCount + 1;
    setCorrectCount(newCorrect);
    setCelebrationActive(true);

    if (!isFlipped) {
      setIsFlipped(true);
    }

    // Check if score is multiple of 3
    if (newCorrect > 0 && newCorrect % 3 === 0) {
      triggerMilestoneAnimation();
    }

    setTimeout(() => {
      setCelebrationActive(false);

      // Auto-advance to next card in unified continuous stream
      if (cardIndex < allWeeklyCards.length - 1) {
        setCardIndex((idx) => idx + 1);
        setIsFlipped(false);
      } else {
        // Finished all cards in master deck!
        setIsSessionComplete(true);
      }
    }, 1200);
  };

  const handleNext = () => {
    if (cardIndex < allWeeklyCards.length - 1) {
      setCardIndex((idx) => idx + 1);
      setIsFlipped(false);
    } else {
      setIsSessionComplete(true);
    }
  };

  const handlePrev = () => {
    if (cardIndex > 0) {
      setCardIndex((idx) => idx - 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCardIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIsSessionComplete(false);
    setQuorraAnim(null);
    if (allWeeklyCards.length > 0) {
      setSelectedCategoryId(allWeeklyCards[0].category.id);
      prevCategoryIdRef.current = allWeeklyCards[0].category.id;
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2.5 overflow-hidden select-none relative">
      {/* Category Selector Tabs with Right-Aligned Reset Button */}
      <div className="w-full flex items-center gap-2 overflow-hidden shrink-0">
        <div className="flex-1 min-w-0 overflow-hidden">
          <CategorySelector
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Reset Button */}
        <DebouncedTouchable
          onPress={handleRestart}
          debounceMs={200}
          minTouchSize="sm"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap border-2 bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-40 transition-all shadow-sm shrink-0"
          aria-label="Reset Deck"
          title="Reset Deck"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>Reset</span>
        </DebouncedTouchable>
      </div>

      {/* Main Flashcard Practice Area (Invisible Seamless Container) */}
      <div className="flex-1 min-h-0 bg-transparent border-0 p-0 flex flex-col items-center justify-between relative overflow-hidden">
        {/* Quorra the Golden Retriever Therapy Companion Mascot */}
        <QuorraCompanion
          animationType={quorraAnim}
          animationKey={quorraAnimKey}
          onComplete={handleCompleteAnimation}
          categoryName={quorraCategory.name}
          categoryNameZh={quorraCategory.nameZh}
        />

        {/* Celebration Overlay on Got It Right */}
        {celebrationActive && (
          <div className="absolute inset-0 bg-yellow-400/20 backdrop-blur-xs flex items-center justify-center z-30 pointer-events-none animate-bounce">
            <div className="bg-yellow-400 text-slate-950 px-6 py-3 rounded-2xl font-black text-xl sm:text-2xl shadow-2xl flex items-center gap-2 border-4 border-white">
              <Award className="w-8 h-8" />
              <span>Great Job!</span>
            </div>
          </div>
        )}

        {/* Active Card or Completed State or Empty State */}
        <div className="flex-1 w-full flex flex-col items-center justify-center my-auto min-h-0 py-0.5 sm:py-1">
          {isSessionComplete ? (
            /* Rewarding Therapy Complete Summary Card */
            <div className="w-full max-w-lg bg-slate-900 border-2 border-yellow-400/60 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                🏆
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                  Therapy Session Complete!
                </h2>
                <p className="text-base sm:text-lg font-extrabold text-yellow-300">
                  復健練習全部完成！
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-6 py-3.5 flex items-center gap-3 shadow-inner">
                <Trophy className="w-6 h-6 text-yellow-400 shrink-0" />
                <span className="text-sm sm:text-base md:text-lg font-black text-slate-100">
                  You got <span className="text-yellow-400 text-xl sm:text-2xl">{correctCount}</span> right out of <span className="text-emerald-400 text-xl sm:text-2xl">{allWeeklyCards.length}</span> cards!
                </span>
              </div>

              <DebouncedTouchable
                onPress={handleRestart}
                minTouchSize="lg"
                className="w-full max-w-xs py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white rounded-2xl text-base sm:text-lg font-black shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 border-2 border-emerald-400 cursor-pointer hover:scale-[1.02] transition-all"
              >
                <RotateCcw className="w-5 h-5 stroke-[2.5]" />
                <span>Practice Again · 再練習一次</span>
              </DebouncedTouchable>
            </div>
          ) : currentCard ? (
            <div className="w-full max-w-lg flex flex-col gap-1.5 sm:gap-2">
              {/* Practice Stats Bar: Score (Left) | Full Session Progress Counter (Right) */}
              <div className="w-full flex items-center justify-between px-2 shrink-0">
                <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-xs sm:text-sm">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>{correctCount}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs sm:text-sm">
                  <span>Card {allWeeklyCards.length > 0 ? cardIndex + 1 : 0} of {allWeeklyCards.length}</span>
                </div>
              </div>

              <FlashcardDeck
                card={currentCard}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped((f) => !f)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2 text-center p-4">
              <span className="text-4xl">📭</span>
              <p className="text-base font-semibold text-white">No cards available for practice.</p>
            </div>
          )}
        </div>

        {/* Practice Control Actions */}
        {!isSessionComplete && (
          <div className="w-full max-w-lg flex flex-col gap-2 shrink-0 pb-0.5">
            {/* Row 1: Full-Width Prominent Speak Button */}
            <DebouncedTouchable
              onPress={handleSpeak}
              disabled={!currentCard}
              minTouchSize="md"
              className={`
                w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg disabled:opacity-40 transition-all border-2
                ${
                  isFlipped
                    ? "bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-yellow-950 border-yellow-300 shadow-yellow-500/20"
                    : "bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white border-purple-400 shadow-purple-900/40"
                }
              `}
              aria-label="Speak clue or answer"
            >
              <Volume2 className="w-5 h-5 stroke-[2.5]" />
              <span>Speak</span>
            </DebouncedTouchable>

            {/* Row 2: Previous | Got It Right! | Next */}
            <div className="flex items-center justify-between gap-2.5 w-full">
              <DebouncedTouchable
                onPress={handlePrev}
                disabled={cardIndex === 0 || !currentCard}
                minTouchSize="md"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold disabled:opacity-40 shadow-xs"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </DebouncedTouchable>

              <DebouncedTouchable
                onPress={handleCorrect}
                disabled={!currentCard}
                minTouchSize="md"
                className="flex-[1.4] bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-1.5 text-sm sm:text-base shadow-lg shadow-emerald-950/40 disabled:opacity-40 border-2 border-emerald-400"
                aria-label="Got it right!"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Got It Right!</span>
              </DebouncedTouchable>

              <DebouncedTouchable
                onPress={handleNext}
                disabled={!currentCard}
                minTouchSize="md"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold disabled:opacity-40 shadow-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </DebouncedTouchable>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
