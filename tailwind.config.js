/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fitzgerald: {
          people: '#FDE047',      // Yellow - People / Pronouns
          verbs: '#86EFAC',       // Green - Verbs / Actions
          nouns: '#FDBA74',       // Orange - Nouns / Objects
          adjectives: '#93C5FD',  // Blue - Adjectives / Descriptors
          social: '#F9A8D4',      // Pink - Social / Courtesy words
          questions: '#C4B5FD',   // Purple - Questions
          places: '#FCA5A5',      // Red/Coral - Places & Locations
          emergency: '#EF4444',   // Deep Red - Urgent / Medical
        }
      },
      minHeight: {
        'touch': '48px',
        'touch-lg': '64px',
      },
      minWidth: {
        'touch': '48px',
        'touch-lg': '64px',
      }
    },
  },
  plugins: [],
}
