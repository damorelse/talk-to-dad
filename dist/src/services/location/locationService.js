/**
 * TalkWithDad AAC - Location & Daily Orientation Service
 * Handles browser geolocation, timezone-based offline fallback,
 * and clinical bilingual speech sentence construction.
 */
// Timezone to City, State, Country dictionary for instant offline fallback
export const TIMEZONE_LOCATION_MAP = {
    'America/Los_Angeles': { city: 'Los Angeles', state: 'California', country: 'United States', cityZh: '洛杉磯', stateZh: '加州', countryZh: '美國', lat: 34.05, lon: -118.24 },
    'America/San_Francisco': { city: 'San Francisco', state: 'California', country: 'United States', cityZh: '舊金山', stateZh: '加州', countryZh: '美國', lat: 37.77, lon: -122.42 },
    'America/Seattle': { city: 'Seattle', state: 'Washington', country: 'United States', cityZh: '西雅圖', stateZh: '華盛頓州', countryZh: '美國', lat: 47.61, lon: -122.33 },
    'America/New_York': { city: 'New York', state: 'New York', country: 'United States', cityZh: '紐約', stateZh: '紐約州', countryZh: '美國', lat: 40.71, lon: -74.01 },
    'America/Chicago': { city: 'Chicago', state: 'Illinois', country: 'United States', cityZh: '芝加哥', stateZh: '伊利諾州', countryZh: '美國', lat: 41.88, lon: -87.63 },
    'America/Denver': { city: 'Denver', state: 'Colorado', country: 'United States', cityZh: '丹佛', stateZh: '科羅拉多州', countryZh: '美國', lat: 39.74, lon: -104.99 },
    'America/Phoenix': { city: 'Phoenix', state: 'Arizona', country: 'United States', cityZh: '鳳凰城', stateZh: '亞利桑那州', countryZh: '美國', lat: 33.45, lon: -112.07 },
    'America/Houston': { city: 'Houston', state: 'Texas', country: 'United States', cityZh: '休士頓', stateZh: '德州', countryZh: '美國', lat: 29.76, lon: -95.37 },
    'America/Toronto': { city: 'Toronto', state: 'Ontario', country: 'Canada', cityZh: '多倫多', stateZh: '安大略省', countryZh: '加拿大', lat: 43.65, lon: -79.38 },
    'America/Vancouver': { city: 'Vancouver', state: 'British Columbia', country: 'Canada', cityZh: '溫哥華', stateZh: '卑詩省', countryZh: '加拿大', lat: 49.28, lon: -123.12 },
    'Asia/Taipei': { city: 'Taipei', country: 'Taiwan', cityZh: '台北', countryZh: '台灣', lat: 25.03, lon: 121.56 },
    'Asia/Hong_Kong': { city: 'Hong Kong', country: 'Hong Kong', cityZh: '香港', countryZh: '香港', lat: 22.32, lon: 114.17 },
    'Asia/Tokyo': { city: 'Tokyo', country: 'Japan', cityZh: '東京', countryZh: '日本', lat: 35.68, lon: 139.69 },
    'Asia/Singapore': { city: 'Singapore', country: 'Singapore', cityZh: '新加坡', countryZh: '新加坡', lat: 1.35, lon: 103.82 },
    'Asia/Shanghai': { city: 'Shanghai', country: 'China', cityZh: '上海', countryZh: '中國', lat: 31.23, lon: 121.47 },
    'Europe/London': { city: 'London', country: 'United Kingdom', cityZh: '倫敦', countryZh: '英國', lat: 51.51, lon: -0.13 },
    'Europe/Paris': { city: 'Paris', country: 'France', cityZh: '巴黎', countryZh: '法國', lat: 48.86, lon: 2.35 },
    'Australia/Sydney': { city: 'Sydney', state: 'New South Wales', country: 'Australia', cityZh: '雪梨', stateZh: '新南威爾斯州', countryZh: '澳洲', lat: -33.87, lon: 151.21 },
};
/**
 * Get instant fallback location based on the browser's timezone
 */
export function getFallbackLocationFromTimezone() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles';
        const match = TIMEZONE_LOCATION_MAP[tz];
        if (match) {
            return {
                city: match.city,
                state: match.state,
                country: match.country,
                cityZh: match.cityZh,
                stateZh: match.stateZh,
                countryZh: match.countryZh,
                latitude: match.lat,
                longitude: match.lon,
                source: 'timezone',
            };
        }
        // Attempt to parse city from "Continent/City" string
        const parts = tz.split('/');
        if (parts.length >= 2) {
            const rawCity = parts[parts.length - 1].replace(/_/g, ' ');
            const continent = parts[0];
            const isUS = continent === 'America' && !rawCity.includes('Toronto') && !rawCity.includes('Vancouver');
            return {
                city: rawCity,
                country: isUS ? 'United States' : continent,
                countryZh: isUS ? '美國' : continent,
                latitude: 37.77,
                longitude: -122.42,
                source: 'timezone',
            };
        }
    }
    catch (e) {
        console.warn('Timezone resolution failed, using default location:', e);
    }
    return {
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        cityZh: '舊金山',
        stateZh: '加州',
        countryZh: '美國',
        latitude: 37.77,
        longitude: -122.42,
        source: 'default',
    };
}
/**
 * Fetch reverse geocoded address using free public Nominatim service with timeout
 */
async function reverseGeocodeCoords(lat, lon) {
    if (typeof AbortController === 'undefined' || typeof fetch === 'undefined') {
        return null;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'TalkWithDad-AAC-App/1.0',
            },
        });
        if (!response.ok)
            return null;
        const data = await response.json();
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.municipality || address.county || 'Local Area';
        const state = address.state || undefined;
        const country = address.country || 'United States';
        return {
            city,
            state,
            country,
            latitude: lat,
            longitude: lon,
        };
    }
    catch (err) {
        console.warn('Reverse geocoding request failed or timed out:', err);
        return null;
    }
    finally {
        clearTimeout(timeoutId);
    }
}
/**
 * Request real user location from browser Geolocation API
 */
export async function detectUserLocation() {
    const fallback = getFallbackLocationFromTimezone();
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return fallback;
    }
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const geocoded = await reverseGeocodeCoords(latitude, longitude);
            if (geocoded && geocoded.city) {
                resolve({
                    city: geocoded.city,
                    state: geocoded.state,
                    country: geocoded.country || fallback.country,
                    cityZh: fallback.cityZh,
                    stateZh: fallback.stateZh,
                    countryZh: fallback.countryZh,
                    latitude,
                    longitude,
                    source: 'geolocation',
                });
            }
            else {
                resolve({
                    ...fallback,
                    latitude,
                    longitude,
                    source: 'geolocation',
                });
            }
        }, (err) => {
            console.warn('Geolocation error / permission denied, using timezone fallback:', err.message);
            resolve(fallback);
        }, {
            timeout: 5000,
            maximumAge: 60000,
            enableHighAccuracy: false,
        });
    });
}
export const WEEKDAYS = [
    { index: 0, name: 'Sunday', nameShort: 'Sun', nameZh: '星期日', nameZhShort: '週日' },
    { index: 1, name: 'Monday', nameShort: 'Mon', nameZh: '星期一', nameZhShort: '週一' },
    { index: 2, name: 'Tuesday', nameShort: 'Tue', nameZh: '星期二', nameZhShort: '週二' },
    { index: 3, name: 'Wednesday', nameShort: 'Wed', nameZh: '星期三', nameZhShort: '週三' },
    { index: 4, name: 'Thursday', nameShort: 'Thu', nameZh: '星期四', nameZhShort: '週四' },
    { index: 5, name: 'Friday', nameShort: 'Fri', nameZh: '星期五', nameZhShort: '週五' },
    { index: 6, name: 'Saturday', nameShort: 'Sat', nameZh: '星期六', nameZhShort: '週六' },
];
export function getDayPeriod(hours) {
    if (hours >= 5 && hours < 12) {
        return { en: 'morning', zh: '早上', icon: '🌅' };
    }
    else if (hours >= 12 && hours < 17) {
        return { en: 'afternoon', zh: '下午', icon: '☀️' };
    }
    else if (hours >= 17 && hours < 21) {
        return { en: 'evening', zh: '傍晚', icon: '🌇' };
    }
    else {
        return { en: 'night', zh: '晚上', icon: '🌙' };
    }
}
export function getGreeting(hours) {
    if (hours >= 5 && hours < 12) {
        return { en: 'Good Morning, Dad!', zh: '早安！', icon: '🌅' };
    }
    else if (hours >= 12 && hours < 17) {
        return { en: 'Good Afternoon, Dad!', zh: '午安！', icon: '☀️' };
    }
    else if (hours >= 17 && hours < 21) {
        return { en: 'Good Evening, Dad!', zh: '傍晚好！', icon: '🌇' };
    }
    else {
        return { en: 'Good Night, Dad!', zh: '晚安！', icon: '🌙' };
    }
}
/**
 * Get country flag emoji from country string
 */
export function getCountryFlag(country) {
    const c = country.toLowerCase();
    if (c.includes('united states') || c.includes('usa') || c.includes('us'))
        return '🇺🇸';
    if (c.includes('taiwan'))
        return '🇹🇼';
    if (c.includes('canada'))
        return '🇨🇦';
    if (c.includes('japan'))
        return '🇯🇵';
    if (c.includes('united kingdom') || c.includes('uk') || c.includes('britain'))
        return '🇬🇧';
    if (c.includes('france'))
        return '🇫🇷';
    if (c.includes('australia'))
        return '🇦🇺';
    if (c.includes('singapore'))
        return '🇸🇬';
    if (c.includes('hong kong'))
        return '🇭🇰';
    if (c.includes('china'))
        return '🇨🇳';
    return '📍';
}
/**
 * Generate full week calendar dates (Sunday to Saturday) around currentDate
 */
export function getWeekDates(currentDate) {
    const currentDayOfWeek = currentDate.getDay(); // 0 = Sun, ..., 6 = Sat
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDayOfMonth = currentDate.getDate();
    const days = [];
    for (let i = 0; i < 7; i++) {
        const diff = i - currentDayOfWeek;
        const dayDate = new Date(currentYear, currentMonth, currentDayOfMonth + diff);
        days.push({
            weekday: WEEKDAYS[i],
            dayOfMonth: dayDate.getDate(),
            month: dayDate.getMonth(),
            isToday: i === currentDayOfWeek,
            fullDate: dayDate,
        });
    }
    return days;
}
/**
 * Format English & Traditional Chinese speech for the Weekday
 */
export function formatWeekdaySpeech(date) {
    const day = WEEKDAYS[date.getDay()];
    return {
        en: `Today is ${day.name}.`,
        zh: `今天是${day.nameZh}。`,
    };
}
/**
 * Format English & Traditional Chinese speech for the Date
 */
export function formatDateSpeech(date) {
    const day = WEEKDAYS[date.getDay()];
    const monthsEn = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const monthEn = monthsEn[date.getMonth()];
    const monthNum = date.getMonth() + 1;
    const dayNum = date.getDate();
    const year = date.getFullYear();
    return {
        en: `Today is ${day.name}, ${monthEn} ${dayNum}, ${year}.`,
        zh: `今天是 ${year} 年 ${monthNum} 月 ${dayNum} 日，${day.nameZh}。`,
    };
}
/**
 * Format English & Traditional Chinese speech for the Time
 */
export function formatTimeSpeech(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = getDayPeriod(hours);
    const displayHours12 = hours % 12 === 0 ? 12 : hours % 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const minText = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const en = `The current time is ${displayHours12}:${minText} ${ampm} in the ${period.en}.`;
    const zh = `現在時間是${period.zh} ${displayHours12} 點 ${minutes === 0 ? '整' : `${minutes} 分`}。`;
    return { en, zh };
}
/**
 * Format English & Traditional Chinese speech for the Location
 */
export function formatLocationSpeech(loc) {
    const locationPartsEn = [];
    if (loc.city)
        locationPartsEn.push(loc.city);
    if (loc.state)
        locationPartsEn.push(loc.state);
    if (loc.country)
        locationPartsEn.push(loc.country);
    const enStr = locationPartsEn.join(', ');
    let zhStr = '';
    if (loc.countryZh || loc.country)
        zhStr += (loc.countryZh || loc.country);
    if (loc.stateZh || loc.state)
        zhStr += (loc.stateZh || loc.state);
    if (loc.cityZh || loc.city)
        zhStr += (loc.cityZh || loc.city);
    return {
        en: `We are currently in ${enStr}.`,
        zh: `我們現在在${zhStr || enStr}。`,
    };
}
/**
 * Format the Full Orientation Composite Speech
 */
export function formatFullOrientationSpeech(date, loc) {
    const dateSpeech = formatDateSpeech(date);
    const timeSpeech = formatTimeSpeech(date);
    const locSpeech = formatLocationSpeech(loc);
    const en = `${dateSpeech.en} ${timeSpeech.en} ${locSpeech.en}`;
    const zh = `${dateSpeech.zh} ${timeSpeech.zh} ${locSpeech.zh}`;
    return { en, zh };
}
