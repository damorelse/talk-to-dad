import React from "react";
import { AACCard, FITZGERALD_COLOR_MAP } from "../../types";
import { X, Volume2, BookOpen, MessageSquareQuote, HelpCircle } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import { DebouncedTouchable } from "../common/DebouncedTouchable";

interface CardDetailModalProps {
  card: AACCard | null;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  const { speakBilingual } = useAudio();

  if (!card) return null;

  const fitzgerald = FITZGERALD_COLOR_MAP[card.fitzgeraldCategory] || FITZGERALD_COLOR_MAP.nouns;

  const handleSpeakPhrase = () => {
    speakBilingual(card.spokenText || card.label, card.spokenTextZh || card.labelZh);
  };

  const handleSpeakExample = () => {
    if (card.exampleSentence || card.exampleSentenceZh) {
      speakBilingual(card.exampleSentence || card.spokenText, card.exampleSentenceZh || card.spokenTextZh);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-detail-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border-2 border-yellow-400 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className={"text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full " + fitzgerald.badgeBg}>
              {card.fitzgeraldCategory}
            </span>
            <span className="text-xs text-slate-400 font-bold">Card Details · 圖卡詳情</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700"
            aria-label="Close card details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Anchor & Primary Labels */}
        <div className="flex flex-col items-center justify-center text-center gap-1.5 py-1">
          <div className="text-5xl sm:text-6xl drop-shadow-md mb-1">
            {card.icon || "💬"}
          </div>
          <h2 id="card-detail-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {card.label}
          </h2>
          {card.labelZh && (
            <h3 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide drop-shadow">
              {card.labelZh}
            </h3>
          )}
          {card.phoneticSyllables && (
            <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-0.5 rounded-full border border-slate-700 mt-0.5">
              🗣️ {card.phoneticSyllables}
            </span>
          )}
        </div>

        {/* Action: Tap to Speak Primary Utterance */}
        <DebouncedTouchable
          onPress={handleSpeakPhrase}
          minTouchSize="md"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 active:from-blue-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg border border-blue-400/50"
        >
          <Volume2 className="w-5 h-5 stroke-[2.5]" />
          <span>Speak: "{card.spokenText}"</span>
        </DebouncedTouchable>

        {/* Definition Section */}
        {(card.definition || card.definitionZh) && (
          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-300">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Simple Definition · 概念釋義</span>
            </div>
            {card.definition && (
              <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                {card.definition}
              </p>
            )}
            {card.definitionZh && (
              <p className="text-xs sm:text-sm font-medium text-purple-200 leading-snug">
                {card.definitionZh}
              </p>
            )}
          </div>
        )}

        {/* Daily Life Example Sentence Section */}
        {(card.exampleSentence || card.exampleSentenceZh) && (
          <div className="w-full bg-amber-950/30 border border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
                <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
                <span>Daily Use Example · 日常生活例句</span>
              </div>
              {card.exampleSentence && (
                <p className="text-sm font-medium text-amber-100 leading-snug">
                  "{card.exampleSentence}"
                </p>
              )}
              {card.exampleSentenceZh && (
                <p className="text-xs font-normal text-amber-200/90 leading-snug">
                  {card.exampleSentenceZh}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleSpeakExample}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 shadow-md shrink-0"
              aria-label="Listen to example sentence"
              title="Listen to example sentence"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Clue Section */}
        {(card.clue || card.clueZh) && (
          <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <span>Therapy Clue · 復健線索</span>
            </div>
            {card.clue && (
              <p className="text-xs sm:text-sm font-medium text-slate-300 leading-snug">
                {card.clue}
              </p>
            )}
            {card.clueZh && (
              <p className="text-[11px] sm:text-xs font-normal text-slate-400 leading-snug">
                {card.clueZh}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};