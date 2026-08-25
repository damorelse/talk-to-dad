import React from 'react';
import { Check, X, AlertTriangle, Flame, Clock } from 'lucide-react';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { useAudio } from '../../hooks/useAudio';

interface EmergencyButtonDef {
  id: string;
  label: string;
  labelZh: string;
  spokenText: string;
  spokenTextZh: string;
  isUrgent?: boolean;
  bgClass: string;
  textClass: string;
  icon: React.ReactNode;
}

export const EmergencyBar: React.FC = () => {
  const { speakBilingual, triggerEmergency } = useAudio();

  const emergencyButtons: EmergencyButtonDef[] = [
    {
      id: 'yes',
      label: 'YES',
      labelZh: '好 / 是',
      spokenText: 'Yes.',
      spokenTextZh: '好，是的。',
      bgClass: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-900/30',
      textClass: 'text-white',
      icon: <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />,
    },
    {
      id: 'no',
      label: 'NO',
      labelZh: '不要 / 不',
      spokenText: 'No.',
      spokenTextZh: '不要，不是。',
      bgClass: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-rose-900/30',
      textClass: 'text-white',
      icon: <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />,
    },
    {
      id: 'wait',
      label: 'WAIT',
      labelZh: '等等',
      spokenText: 'Please wait, I need a minute.',
      spokenTextZh: '請等一下。',
      bgClass: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-900/30',
      textClass: 'text-white font-bold',
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />,
    },
    {
      id: 'toilet',
      label: 'TOILET',
      labelZh: '廁所',
      spokenText: 'I need to use the toilet immediately.',
      spokenTextZh: '我想上廁所。',
      bgClass: 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white shadow-cyan-900/30',
      textClass: 'text-white font-bold',
      icon: <span className="text-lg sm:text-xl leading-none">🚻</span>,
    },
    {
      id: 'pain',
      label: 'PAIN',
      labelZh: '痛 / 難受',
      spokenText: 'I am in pain, please help me.',
      spokenTextZh: '我現在很痛，請幫幫我。',
      isUrgent: true,
      bgClass: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-amber-900/30',
      textClass: 'text-white font-bold',
      icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />,
    },
    {
      id: 'help',
      label: 'HELP',
      labelZh: '求助',
      spokenText: 'I need help right now!',
      spokenTextZh: '請幫幫我！',
      isUrgent: true,
      bgClass: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-red-900/40',
      textClass: 'text-white font-black',
      icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />,
    },
  ];

  const handlePress = (btn: EmergencyButtonDef) => {
    if (btn.isUrgent) {
      triggerEmergency(btn.spokenText, btn.spokenTextZh);
    } else {
      speakBilingual(btn.spokenText, btn.spokenTextZh);
    }
  };

  return (
    <header
      className="w-full bg-slate-100 dark:bg-slate-950 px-2 sm:px-3 pt-1.5 pb-0.5 shrink-0 z-40 transition-colors"
      role="region"
      aria-label="Permanent Emergency Quick Response Bar"
    >
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2 w-full max-w-7xl mx-auto">
        {emergencyButtons.map((btn) => (
          <DebouncedTouchable
            key={btn.id}
            onPress={() => handlePress(btn)}
            debounceMs={250}
            minTouchSize="md"
            className={`
              flex flex-col items-center justify-center py-1 px-1 rounded-xl shadow-md border-2 border-white/20
              ${btn.bgClass}
            `}
            aria-label={`Emergency quick response: ${btn.label} (${btn.labelZh})`}
          >
            <div className="flex items-center gap-0.5 sm:gap-1 leading-none">
              {btn.icon}
              <span className="text-xs sm:text-sm md:text-base font-black tracking-wider uppercase leading-none">
                {btn.label}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-black opacity-95 tracking-tight leading-tight mt-0.5">
              {btn.labelZh}
            </span>
          </DebouncedTouchable>
        ))}
      </div>
    </header>
  );
};
