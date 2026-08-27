import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  X,
  Printer,
  ExternalLink,
  Lock,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { PRIVACY_POLICY, TERMS_OF_SERVICE, LegalDocument } from '../../services/legal/legalContent';
import { DebouncedTouchable } from '../common/DebouncedTouchable';

interface LegalModalProps {
  initialDoc?: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  initialDoc = 'privacy',
  onClose,
}) => {
  const [activeDocKey, setActiveDocKey] = useState<'privacy' | 'terms'>(initialDoc);

  const activeDoc: LegalDocument =
    activeDocKey === 'privacy' ? PRIVACY_POLICY : TERMS_OF_SERVICE;

  const handlePrint = () => {
    window.print();
  };

  const handleOpenExternal = () => {
    const url = activeDocKey === 'privacy' ? './privacy.html' : './terms.html';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-slate-900 border-2 border-pink-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Top Header */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-400 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
              {activeDocKey === 'privacy' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2
                id="legal-modal-title"
                className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight"
              >
                {activeDoc.title}{' '}
                <span className="text-pink-600 dark:text-pink-400 font-bold text-xs sm:text-sm">
                  ({activeDoc.titleZh})
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                TalkWithDad AAC · Effective: {activeDoc.effectiveDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Print Document"
              aria-label="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Standalone Page Link */}
            <button
              type="button"
              onClick={handleOpenExternal}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Open Standalone Page"
              aria-label="Open Standalone Page"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Close Modal Button */}
            <DebouncedTouchable
              onPress={onClose}
              minTouchSize="sm"
              className="p-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              aria-label="Close Legal Modal"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </DebouncedTouchable>
          </div>
        </div>

        {/* Document Selector Tabs */}
        <div className="flex items-center gap-2 p-2 sm:px-4 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveDocKey('privacy')}
            className={`
              flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer
              ${
                activeDocKey === 'privacy'
                  ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-900/30 font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }
            `}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy (隱私權政策)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDocKey('terms')}
            className={`
              flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer
              ${
                activeDocKey === 'terms'
                  ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-900/30 font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }
            `}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service (服務條款)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          {/* Document Banner */}
          <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/50 flex flex-col gap-1">
            <h3 className="text-sm sm:text-base font-black text-pink-700 dark:text-pink-300">
              {activeDoc.subtitle}
            </h3>
            <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold">
              {activeDoc.subtitleZh}
            </p>
          </div>

          {/* Key Summary Highlights */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Key Highlights · 重點摘要</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {activeDoc.summaryPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-1 text-xs"
                >
                  <p className="font-bold text-slate-800 dark:text-slate-200">{pt.en}</p>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{pt.zh}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-5">
            {activeDoc.sections.map((section) => (
              <div
                key={section.id}
                className={`
                  p-4 rounded-2xl border flex flex-col gap-3
                  ${
                    section.isImportant
                      ? 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }
                `}
              >
                {/* Section Title */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {section.isImportant ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : activeDocKey === 'privacy' ? (
                    <Lock className="w-4 h-4 text-pink-500 shrink-0" />
                  ) : (
                    <HeartHandshake className="w-4 h-4 text-blue-500 shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {section.title}
                    </h4>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">
                      {section.titleZh}
                    </span>
                  </div>
                </div>

                {/* English Content */}
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {section.contentEn.map((para, pIdx) => (
                    <p key={`en-${pIdx}`}>{para}</p>
                  ))}
                </div>

                {/* Traditional Chinese Translation */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {section.contentZh.map((para, pIdx) => (
                    <p key={`zh-${pIdx}`}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center gap-1">
            <p className="font-bold">
              TalkWithDad AAC · Open Source Offline Assistive Communication
            </p>
            <p className="text-[11px]">
              Hosted on GitHub Pages · Client-Side Execution · Zero Data Collection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
