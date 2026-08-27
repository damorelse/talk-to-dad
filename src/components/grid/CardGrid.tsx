import React, { useState, useMemo } from 'react';
import { AACCard, AACCategory, AppSettings } from '../../types';
import { GridCard } from './GridCard';
import { CategorySelector } from './CategorySelector';
import { useAudio } from '../../hooks/useAudio';
import { Search } from 'lucide-react';

interface CardGridProps {
  categories: AACCategory[];
  cards: AACCard[];
  settings: AppSettings;
}

export const CardGrid: React.FC<CardGridProps> = ({
  categories,
  cards,
  settings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'favorites'>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const { speakCard } = useAudio();

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Category filter
      if (selectedCategory === 'favorites') {
        if (!card.isFavorite) {
          return false;
        }
      } else if (card.categoryId !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLabel = card.label.toLowerCase().includes(q);
        const matchesSpoken = card.spokenText.toLowerCase().includes(q);
        const matchesSyllables = card.phoneticSyllables?.toLowerCase().includes(q);
        if (!matchesLabel && !matchesSpoken && !matchesSyllables) {
          return false;
        }
      }
      return true;
    });
  }, [cards, selectedCategory, searchQuery]);

  const handleCardSelect = (card: AACCard) => {
    speakCard(card);
  };

  // Dynamic grid style based on settings
  const cols = Math.max(3, Math.min(5, settings.gridCols || 4));

  // Dynamic row height bounds based on column density to preserve proportional card shapes
  const rowHeightMap: Record<number, { min: number; max: number }> = {
    3: { min: 160, max: 210 },
    4: { min: 150, max: 195 },
    5: { min: 135, max: 175 },
  };

  const currentDensity = rowHeightMap[cols] || rowHeightMap[4];

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridAutoRows: `minmax(${currentDensity.min}px, ${currentDensity.max}px)`,
    alignContent: 'start',
  };

  return (
    <div className="w-full h-full flex flex-col gap-2.5 overflow-hidden">
      {/* Category selector & Search bar */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-2 shrink-0">
        <div className="flex-1 w-full overflow-hidden">
          <CategorySelector
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Scaled Card Grid */}
      <div className="flex-1 w-full overflow-y-auto p-1 scrollbar-none">
        {filteredCards.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
            <span className="text-4xl mb-2">🔍</span>
            <p className="text-lg font-bold">No matching AAC cards found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Try selecting another category or clearing your search.</p>
          </div>
        ) : (
          <div
            className="grid gap-2.5 sm:gap-3.5 w-full"
            style={gridStyle}
          >
            {filteredCards.map((card) => (
              <GridCard
                key={card.id}
                card={card}
                onSelect={handleCardSelect}
                debounceMs={settings.tapDebounceMs}
                fontSize={settings.fontSize}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
