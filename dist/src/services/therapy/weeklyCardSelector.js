/**
 * TalkWithDad AAC Progressive Web App
 * Deterministic Weekly 5-Card Selection Engine
 * Uses ISO 8601 Calendar Week (YYYY-Www) and Category ID to generate deterministic card sets.
 */
/**
 * Calculates the ISO 8601 calendar week key (YYYY-Www) for a given date.
 * ISO weeks start on Monday (Day 1) and end on Sunday (Day 7).
 * Week 1 is the week containing the first Thursday of the year (nearest-Thursday rule).
 * Operates in UTC to ensure timezone invariance across all clients.
 */
export function getISOWeekKey(dateInput) {
    let date;
    if (!dateInput && dateInput !== 0) {
        date = new Date();
    }
    else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
        date = new Date(dateInput);
    }
    else {
        date = new Date(dateInput.getTime());
    }
    if (isNaN(date.getTime())) {
        date = new Date();
    }
    // Work in UTC to prevent local timezone boundary jitter
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = d.getUTCDay() || 7; // Sunday is 7 in ISO 8601
    // Set to nearest Thursday: current date + 4 - current ISO day number
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const isoYear = d.getUTCFullYear();
    const yearStart = new Date(Date.UTC(isoYear, 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const weekStr = weekNo < 10 ? `0${weekNo}` : `${weekNo}`;
    return `${isoYear}-W${weekStr}`;
}
/**
 * 32-bit FNV-1a string hash function.
 * Computes a deterministic 32-bit unsigned integer hash from a string.
 */
export function hashString(str) {
    let h = 0x811c9dc5; // 2166136261
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193); // 16777619
    }
    return h >>> 0;
}
/**
 * Mulberry32 seeded pseudo-random number generator.
 * Returns a generator function yielding deterministic floats in [0, 1).
 */
export function createMulberry32(seed) {
    let s = seed >>> 0;
    return function next() {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
/**
 * Deterministically selects up to `count` cards (preset default 2) for a given category
 * and calendar week using a seeded PRNG and Fisher-Yates shuffle.
 *
 * - Categories with `count` or fewer cards (or 0 cards) return all available cards directly.
 * - Cards are pre-sorted by `card.id` before shuffling to guarantee input-order invariance.
 */
export function getWeeklyCardsForCategory(allCards, categoryId, weekKeyOrDate, count = 2) {
    // 1. Filter cards for category or favorites
    const categoryCards = categoryId === 'favorites'
        ? allCards.filter((c) => c.isFavorite)
        : allCards.filter((c) => c.categoryId === categoryId);
    // 2. If count or fewer cards, return all cards directly
    if (categoryCards.length <= count) {
        return [...categoryCards];
    }
    // 3. Resolve ISO 8601 Week Key
    let weekKey;
    if (typeof weekKeyOrDate === 'string' && /^\d{4}-W\d{2}$/.test(weekKeyOrDate)) {
        weekKey = weekKeyOrDate;
    }
    else {
        weekKey = getISOWeekKey(weekKeyOrDate);
    }
    // 4. Stable pre-sort by ID to guarantee identical starting permutation across all query orders
    const pool = [...categoryCards].sort((a, b) => a.id.localeCompare(b.id));
    // 5. Seed PRNG with combined seed string (weekKey:categoryId)
    const seed = hashString(`${weekKey}:${categoryId}`);
    const rng = createMulberry32(seed);
    // 6. Fisher-Yates shuffle with seeded PRNG
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
    }
    // 7. Return top `count` cards
    return pool.slice(0, count);
}
// Convenient alias matching requirement terminology
export const selectWeeklyCards = getWeeklyCardsForCategory;
