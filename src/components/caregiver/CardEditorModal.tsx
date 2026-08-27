import React, { useState } from 'react';
import { AACCard, AACCategory, FitzgeraldCategory } from '../../types';
import { formatWithMiddleDot } from '../../services/syllables/syllableSplitter';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { useDatabase } from '../../hooks/useDatabase';
import { Sparkles, X, Check, Star } from 'lucide-react';

interface CardEditorModalProps {
  initialCard?: AACCard | null;
  categories: AACCategory[];
  onSave: (card: AACCard) => void;
  onCancel: () => void;
}

export const CardEditorModal: React.FC<CardEditorModalProps> = ({
  initialCard,
  categories,
  onSave,
  onCancel,
}) => {
  const [label, setLabel] = useState(initialCard?.label || '');
  const [labelZh, setLabelZh] = useState(initialCard?.labelZh || '');
  const [spokenText, setSpokenText] = useState(initialCard?.spokenText || '');
  const [spokenTextZh, setSpokenTextZh] = useState(initialCard?.spokenTextZh || '');
  const [clue, setClue] = useState(initialCard?.clue || '');
  const [clueZh, setClueZh] = useState(initialCard?.clueZh || '');
  const [categoryId, setCategoryId] = useState(initialCard?.categoryId || categories[0]?.id || 'cat-needs');
  const [fitzgeraldCategory, setFitzgeraldCategory] = useState<FitzgeraldCategory>(
    initialCard?.fitzgeraldCategory || 'nouns'
  );
  const [icon, setIcon] = useState(initialCard?.icon || '💬');
  const [phoneticSyllables, setPhoneticSyllables] = useState(initialCard?.phoneticSyllables || '');
  const [isFavorite, setIsFavorite] = useState(initialCard?.isFavorite || false);

  const { saveCard } = useDatabase();

  const handleAutoSyllables = () => {
    if (label.trim()) {
      setPhoneticSyllables(formatWithMiddleDot(label.trim()));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const cardToSave: AACCard = {
      id: initialCard?.id || `card-${Date.now()}`,
      categoryId,
      label: label.trim(),
      labelZh: labelZh.trim() || undefined,
      spokenText: spokenText.trim() || label.trim(),
      spokenTextZh: spokenTextZh.trim() || undefined,
      phoneticSyllables: phoneticSyllables.trim() || formatWithMiddleDot(label.trim()),
      clue: clue.trim() || undefined,
      clueZh: clueZh.trim() || undefined,
      fitzgeraldCategory,
      icon: icon.trim() || '💬',
      audioBlobId: initialCard?.audioBlobId,
      order: initialCard?.order || Date.now(),
      isFavorite,
      createdAt: initialCard?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await saveCard(cardToSave);
    onSave(cardToSave);
  };

  const fitzgeraldRoles: { role: FitzgeraldCategory; label: string; color: string }[] = [
    { role: 'people', label: 'People / Pronouns (Yellow)', color: 'bg-yellow-400 text-yellow-950' },
    { role: 'verbs', label: 'Verbs / Actions (Green)', color: 'bg-green-400 text-green-950' },
    { role: 'nouns', label: 'Nouns / Objects (Orange)', color: 'bg-orange-400 text-orange-950' },
    { role: 'adjectives', label: 'Adjectives / Feelings (Blue)', color: 'bg-blue-400 text-blue-950' },
    { role: 'social', label: 'Social / Courtesy (Pink)', color: 'bg-pink-400 text-pink-950' },
    { role: 'questions', label: 'Questions (Purple)', color: 'bg-purple-400 text-purple-950' },
    { role: 'places', label: 'Places (Rose)', color: 'bg-rose-400 text-rose-950' },
    { role: 'emergency', label: 'Emergency / Urgent (Red)', color: 'bg-red-600 text-white' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
        <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-none">
          {/* Header */}
          <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-black text-white">
                {initialCard ? 'Edit AAC Card' : 'Create New AAC Card'}
              </h2>
              <p className="text-xs text-slate-400">Configure visual card, spoken text, and colors</p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-3.5">
            {/* Label & Icon */}
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-3 flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Card Label *</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Water, Blanket, Napkin"
                  className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="col-span-1 flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Emoji / Icon</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="💧"
                  className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-center font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Traditional Chinese Label */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300">Traditional Chinese Name (繁體中文)</label>
              <input
                type="text"
                value={labelZh}
                onChange={(e) => setLabelZh(e.target.value)}
                placeholder="e.g. 水, 喝水, 毛毯"
                className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Spoken Text (English & Chinese) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">English Speech Phrase</label>
                <input
                  type="text"
                  value={spokenText}
                  onChange={(e) => setSpokenText(e.target.value)}
                  placeholder={label ? `I would like ${label.toLowerCase()}, please.` : 'English sentence'}
                  className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Chinese Speech Phrase (繁體中文)</label>
                <input
                  type="text"
                  value={spokenTextZh}
                  onChange={(e) => setSpokenTextZh(e.target.value)}
                  placeholder={labelZh ? `我想${labelZh}。` : '中文完整語音句子'}
                  className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Clue / Prompt (English & Chinese) for Word Finding Therapy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">English Clue / Hint</label>
                <input
                  type="text"
                  value={clue}
                  onChange={(e) => setClue(e.target.value)}
                  placeholder="e.g. What do you drink when you are thirsty?"
                  className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Chinese Clue / Hint (繁體中文提示)</label>
                <input
                  type="text"
                  value={clueZh}
                  onChange={(e) => setClueZh(e.target.value)}
                  placeholder="e.g. 口渴時想喝的透明液體"
                  className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Color Role */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300">Card Color & Role</label>
              <div className="grid grid-cols-2 gap-1.5">
                {fitzgeraldRoles.map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setFitzgeraldCategory(item.role)}
                    className={`
                      px-2.5 py-1.5 rounded-xl text-xs font-bold text-left border-2 transition-all flex items-center justify-between
                      ${
                        fitzgeraldCategory === item.role
                          ? 'border-white shadow-md brightness-110 scale-[1.02]'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }
                      ${item.color}
                    `}
                  >
                    <span>{item.role.toUpperCase()}</span>
                    {fitzgeraldCategory === item.role && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Syllables Breakdown */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Phonetic Syllables (Middle Dot)</label>
                <button
                  type="button"
                  onClick={handleAutoSyllables}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Split</span>
                </button>
              </div>
              <input
                type="text"
                value={phoneticSyllables}
                onChange={(e) => setPhoneticSyllables(e.target.value)}
                placeholder="Wa · ter"
                className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Favorite Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Favorite Card</span>
                <span className="text-[11px] text-slate-500">Show in quick access favorites</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFavorite((f) => !f)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors
                  ${
                    isFavorite
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                  }
                `}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold border border-slate-700"
              >
                Cancel
              </button>

              <DebouncedTouchable
                type="submit"
                minTouchSize="md"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-sm font-black shadow-md shadow-blue-900/40"
              >
                Save Card
              </DebouncedTouchable>
            </div>
          </form>
        </div>
      </div>
  );
};
