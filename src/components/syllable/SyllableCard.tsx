import React from 'react';
import { SyllablePhonemeData } from '../../types';
import { Star } from 'lucide-react';
import { getSyllableBreakdownWithIpa } from '../../services/syllables/syllableSplitter';

export interface SyllableCardProps {
  word: string;
  activeSyllableIndex?: number | null;
  syllableData?: SyllablePhonemeData[];
  onSyllableClick?: (syllableText: string, index: number, data?: SyllablePhonemeData) => void;
  onPhonemeClick?: (phoneme: string, syllableIndex: number) => void;
  showIpa?: boolean;
  showStress?: boolean;
}

export const SyllableCard: React.FC<SyllableCardProps> = ({
  word,
  activeSyllableIndex = null,
  syllableData,
  onSyllableClick,
  onPhonemeClick,
  showIpa = true,
  showStress = true,
}) => {
  const syllables = syllableData && syllableData.length > 0
    ? syllableData
    : getSyllableBreakdownWithIpa(word);

  return (
    <div
      role="region"
      aria-label={`Syllable breakdown for ${word}`}
      className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-4 p-1 select-none"
    >
      {syllables.map((syl, idx) => {
        const isActive = activeSyllableIndex === idx;
        const isPrimaryStress = syl.stress === 'primary';
        const isSecondaryStress = syl.stress === 'secondary';

        return (
          <React.Fragment key={`${syl.text}-${idx}`}>
            <button
              type="button"
              onClick={() => onSyllableClick?.(syl.text, idx, syl)}
              aria-label={`Syllable ${idx + 1}: ${syl.text}, IPA: ${syl.ipa}, Stress: ${syl.stress}`}
              aria-current={isActive ? 'true' : undefined}
              className={`
                group relative flex flex-col items-center justify-center px-4 sm:px-7 py-2.5 sm:py-4 rounded-2xl
                transition-all duration-200 cursor-pointer min-h-[70px] sm:min-h-[95px] md:min-h-[110px] min-w-[75px] sm:min-w-[95px] md:min-w-[110px]
                border-2 sm:border-3 shadow-md focus:outline-none focus:ring-4 focus:ring-amber-400
                ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-amber-200 scale-105 shadow-2xl shadow-amber-400/40 ring-4 ring-amber-400/60 z-10 font-black'
                    : isPrimaryStress
                    ? 'bg-slate-800 hover:bg-slate-700 text-blue-200 border-amber-500/80 hover:border-amber-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
                }
              `}
            >
              {/* Stress Indicator Badge */}
              {showStress && (
                <div className="absolute top-1 right-1.5 flex items-center gap-0.5">
                  {isPrimaryStress && (
                    <span
                      title="Primary Stress"
                      className={`
                        text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5
                        ${isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}
                      `}
                    >
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Stress</span>
                    </span>
                  )}
                  {isSecondaryStress && (
                    <span
                      title="Secondary Stress"
                      className={`
                        text-[9px] font-bold uppercase px-1 py-0.5 rounded-full
                        ${isActive ? 'bg-slate-950 text-slate-300' : 'bg-slate-800 text-slate-400'}
                      `}
                    >
                      2nd
                    </span>
                  )}
                </div>
              )}

              {/* Syllable Text */}
              <span
                className={`
                  font-black text-2xl sm:text-4xl md:text-5xl tracking-wide transition-transform py-0.5
                  ${isActive ? 'scale-105 text-slate-950' : 'text-white'}
                `}
              >
                {syl.text}
              </span>

              {/* Sub-label for BoPoMoFo (注音) or IPA with interactive Phoneme chips */}
              {showIpa && syl.ipa && (
                <div className="flex flex-col items-center gap-1 mt-0.5">
                  <span
                    className={`
                      text-xs sm:text-sm md:text-base font-bold tracking-widest leading-tight
                      ${isActive ? 'text-slate-950 font-black' : 'text-amber-300'}
                    `}
                  >
                    {syl.ipa}
                  </span>
                  {onPhonemeClick && syl.phonemes && syl.phonemes.length > 0 && (
                    <div
                      className="flex items-center gap-1 flex-wrap justify-center mt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {syl.phonemes.map((ph, phIdx) => (
                        <button
                          key={`${ph}-${phIdx}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPhonemeClick(ph, idx);
                          }}
                          title={`Pronounce phoneme /${ph}/`}
                          aria-label={`Pronounce phoneme ${ph}`}
                          className={`
                            px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer border
                            ${
                              isActive
                                ? 'bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 border-slate-950/30'
                                : 'bg-slate-900/90 hover:bg-amber-400 hover:text-slate-950 text-amber-200 border-amber-500/30 hover:border-amber-400 shadow-xs'
                            }
                          `}
                        >
                          /{ph}/
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
