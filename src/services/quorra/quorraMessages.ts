/**
 * TalkWithDad AAC - Quorra Companion Greetings & Postcard Service
 * 
 * Provides dynamic, time-of-day and weekday-aware bilingual cheer messages
 * and companion poses for Quorra the Golden Retriever.
 */

export type QuorraDayPeriod = 'morning' | 'afternoon' | 'evening' | 'night';
export type QuorraCouchPose = 'morning-sun' | 'afternoon-nap' | 'evening-blanket';

export interface QuorraDailyGreeting {
  weekdayIndex: number; // 0 = Sun, ..., 6 = Sat
  weekdayName: string;
  weekdayNameZh: string;
  period: QuorraDayPeriod;
  pose: QuorraCouchPose;
  titleEn: string;
  titleZh: string;
  messageEn: string;
  messageZh: string;
  spokenEn: string;
  spokenZh: string;
  moodEmoji: string;
  stampLabel: string;
}

const WEEKDAY_NAMES_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WEEKDAY_NAMES_ZH = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];

/**
 * Resolves the 4-period diurnal cycle for Quorra.
 */
export function getQuorraPeriod(hours: number): QuorraDayPeriod {
  if (hours >= 5 && hours < 12) {
    return 'morning';
  } else if (hours >= 12 && hours < 17) {
    return 'afternoon';
  } else if (hours >= 17 && hours < 21) {
    return 'evening';
  } else {
    return 'night';
  }
}

/**
 * Resolves Quorra's resting pose on the living room couch based on the clock.
 */
export function getQuorraCouchPose(dateInput?: Date | number | string): QuorraCouchPose {
  const date = dateInput ? new Date(dateInput) : new Date();
  const hours = isNaN(date.getTime()) ? new Date().getHours() : date.getHours();

  if (hours >= 5 && hours < 12) {
    return 'morning-sun';
  } else if (hours >= 12 && hours < 18) {
    return 'afternoon-nap';
  } else {
    return 'evening-blanket';
  }
}

/**
 * Matrix of personalized bilingual messages across 7 weekdays x 4 time periods (28 unique variations).
 */
const PERIOD_GREETINGS: Record<
  QuorraDayPeriod,
  {
    prefixEn: string;
    prefixZh: string;
    suffixEn: string;
    suffixZh: string;
    moodEmoji: string;
    stampLabel: string;
    weekdayMessagesEn: Record<number, string>;
    weekdayMessagesZh: Record<number, string>;
  }
> = {
  morning: {
    prefixEn: 'Good morning, Dad!',
    prefixZh: '早安，爸爸！',
    suffixEn: "Let's have a wonderful, cozy day together! 🐾",
    suffixZh: '今天我們一起開開心心、舒舒服服地過！🐾',
    moodEmoji: '🌅',
    stampLabel: 'MORNING SUN',
    weekdayMessagesEn: {
      0: 'Happy peaceful Sunday! The sun is shining warm and bright.',
      1: 'Happy fresh Monday! Ready for a brand new week with you.',
      2: 'Happy bright Tuesday! Hope you slept so peacefully.',
      3: 'Happy cheerful Wednesday! We are halfway through the week.',
      4: 'Happy sunny Thursday! Sending you warm golden retriever hugs.',
      5: 'Happy joyful Friday! The weekend is almost here.',
      6: 'Happy cozy Saturday! Time for gentle smiles and warm tea.',
    },
    weekdayMessagesZh: {
      0: '星期日平安！今天陽光溫暖又明亮。',
      1: '星期一早安！很開心陪您迎接新的一週。',
      2: '星期二順心！希望您昨晚睡得很好、很安穩。',
      3: '星期三愉快！不知不覺這週已經過了一半囉。',
      4: '星期四安康！送給您暖呼呼的黃金獵犬大抱抱。',
      5: '星期五開心！美好的週末馬上就要到了。',
      6: '星期六舒心！今天可以喝杯熱茶，好好放鬆。',
    },
  },
  afternoon: {
    prefixEn: 'Good afternoon, Dad!',
    prefixZh: '午安，爸爸！',
    suffixEn: 'Remember to drink some warm water and rest well! 💧',
    suffixZh: '記得多喝幾口溫水，好好休息放鬆一下喔！💧',
    moodEmoji: '☀️',
    stampLabel: 'AFTERNOON TEA',
    weekdayMessagesEn: {
      0: 'Enjoying a quiet Sunday afternoon nap by your side.',
      1: 'You are doing amazing this Monday afternoon.',
      2: 'Tuesday afternoon breeze feels so pleasant and gentle.',
      3: 'Wednesday afternoon rest time is the best time.',
      4: 'Thursday afternoon is perfect for a cup of warm tea.',
      5: 'Friday afternoon sunshine is warm on the couch.',
      6: 'Saturday afternoon relaxing with you is my favorite.',
    },
    weekdayMessagesZh: {
      0: '在您身邊享受寧靜的星期日下午小睡最舒服了。',
      1: '星期一下午，您今天練習得非常棒喔。',
      2: '星期二下午的微風吹起來特別舒適溫柔。',
      3: '星期三下午小歇一下，感覺整個人都放鬆了。',
      4: '星期四下午最適合喝杯暖暖的熱茶休息一下。',
      5: '星期五下午的陽光灑在沙發上好溫暖。',
      6: '星期六下午和您一起放鬆是我最喜歡的時光。',
    },
  },
  evening: {
    prefixEn: 'Good evening, Dad!',
    prefixZh: '傍晚好，爸爸！',
    suffixEn: 'You did so well today. I am so proud of you! 💖',
    suffixZh: '您今天真的好棒、好努力，為您感到驕傲！💖',
    moodEmoji: '🌇',
    stampLabel: 'GOLDEN HOUR',
    weekdayMessagesEn: {
      0: 'Sunday evening dinner is ready. Rest your hands and feet.',
      1: 'Monday evening is here. You worked so hard today.',
      2: 'Tuesday evening sunset looks beautiful outside.',
      3: 'Wednesday evening peace is here. Time to wind down comfortably.',
      4: 'Thursday evening comfort. Tomorrow is Friday already.',
      5: 'Friday evening celebration! Have a cozy, relaxing night.',
      6: 'Saturday evening family time. Love being right here with you.',
    },
    weekdayMessagesZh: {
      0: '星期日晚餐時間到了，讓手腳好好放鬆休息。',
      1: '星期一傍晚好，您今天一天真的好用心。',
      2: '星期二傍晚窗外的夕陽顏色真漂亮。',
      3: '星期三傍晚寧靜安詳，慢慢準備放鬆下來。',
      4: '星期四傍晚好舒適，明天就是星期五了呢。',
      5: '星期五晚上來慶祝一下，今晚好好放鬆。',
      6: '星期六溫馨家庭時光，最喜歡陪在您身邊。',
    },
  },
  night: {
    prefixEn: 'Good night, Dad!',
    prefixZh: '晚安，爸爸！',
    suffixEn: 'Sleep tight and have sweet dreams. I will guard you all night! 🌙',
    suffixZh: '祝您一夜好眠、做個甜甜的美夢，我會整夜守護您！🌙',
    moodEmoji: '🌙',
    stampLabel: 'SWEET DREAMS',
    weekdayMessagesEn: {
      0: 'Tucking in for Sunday night. Rest deeply and peacefully.',
      1: 'Monday night quietness. Let your body relax fully.',
      2: 'Tuesday night stars are shining softly for you.',
      3: 'Wednesday night slumber under the warm blanket.',
      4: 'Thursday night sweet rest before the weekend.',
      5: 'Friday night tranquility. Sleep as long as you like.',
      6: 'Saturday night peaceful sleep. See you in the morning sunshine.',
    },
    weekdayMessagesZh: {
      0: '星期日晚上蓋好被子，安安穩穩地睡個好覺。',
      1: '星期一夜晚安靜祥和，讓身體全部放鬆下來。',
      2: '星期二晚上的星光溫柔地照耀著您。',
      3: '星期三晚上蓋著溫暖的被子，安心入眠。',
      4: '星期四夜晚甜甜安歇，迎接即將到來的週末。',
      5: '星期五夜晚靜謐舒適，今晚可以好好多睡一會兒。',
      6: '星期六夜晚寧靜好眠，明天早晨陽光下見喔。',
    },
  },
};

/**
 * Returns complete bilingual greeting object for Quorra's Daily Postcard.
 */
export function getQuorraDailyGreeting(dateInput?: Date | number | string): QuorraDailyGreeting {
  let date: Date;
  if (!dateInput && dateInput !== 0) {
    date = new Date();
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else {
    date = new Date(dateInput.getTime());
  }

  if (isNaN(date.getTime())) {
    date = new Date();
  }

  const hours = date.getHours();
  const weekdayIndex = date.getDay(); // 0 = Sun .. 6 = Sat
  const weekdayName = WEEKDAY_NAMES_EN[weekdayIndex] || 'Today';
  const weekdayNameZh = WEEKDAY_NAMES_ZH[weekdayIndex] || '今天';

  const period = getQuorraPeriod(hours);
  const pose = getQuorraCouchPose(date);
  const config = PERIOD_GREETINGS[period];

  const specificMsgEn = config.weekdayMessagesEn[weekdayIndex] || 'Thinking of you today.';
  const specificMsgZh = config.weekdayMessagesZh[weekdayIndex] || '今天心裡一直想著您。';

  const fullMsgEn = `${config.prefixEn} ${specificMsgEn} ${config.suffixEn}`;
  const fullMsgZh = `${config.prefixZh} ${specificMsgZh} ${config.suffixZh}`;

  const spokenEn = `${config.prefixEn} Today is ${weekdayName}. ${specificMsgEn} ${config.suffixEn}`;
  const spokenZh = `${config.prefixZh} 今天是${weekdayNameZh}。${specificMsgZh} ${config.suffixZh}`;

  return {
    weekdayIndex,
    weekdayName,
    weekdayNameZh,
    period,
    pose,
    titleEn: `Quorra's Daily Postcard`,
    titleZh: `Quorra 今日問候明信片`,
    messageEn: fullMsgEn,
    messageZh: fullMsgZh,
    spokenEn,
    spokenZh,
    moodEmoji: config.moodEmoji,
    stampLabel: config.stampLabel,
  };
}
