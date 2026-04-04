// src/utils/calendar.ts

// ── 和暦 ─────────────────────────────────────────────────────

const GENGO = [
  { name: '令和', start: new Date(2019, 4, 1) },
  { name: '平成', start: new Date(1989, 0, 8) },
  { name: '昭和', start: new Date(1926, 11, 25) },
  { name: '大正', start: new Date(1912, 6, 30) },
  { name: '明治', start: new Date(1868, 0, 25) },
];

export function toWarekiYear(year: number): string {
  const d = new Date(year, 6, 1);
  for (const g of GENGO) {
    if (d >= g.start) {
      const y = year - g.start.getFullYear() + 1;
      return `${g.name}${y === 1 ? '元' : y}年`;
    }
  }
  return `${year}年`;
}

export function toWarekiFromDate(date: Date): string {
  for (const g of GENGO) {
    if (date >= g.start) {
      const y = date.getFullYear() - g.start.getFullYear() + 1;
      return `${g.name}${y === 1 ? '元' : y}年`;
    }
  }
  return `${date.getFullYear()}年`;
}

// ── 干支 ─────────────────────────────────────────────────────

const ETO_JP     = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ETO_ANIMAL = ['ねずみ🐭','うし🐮','とら🐯','うさぎ🐰','たつ🐲','へび🐍','うま🐴','ひつじ🐑','さる🐵','とり🐓','いぬ🐶','いのしし🐗'];

export function getEto(year: number) {
  const i = (year - 4) % 12;
  return { kanji: ETO_JP[i], animal: ETO_ANIMAL[i] };
}

// ── 星座 ─────────────────────────────────────────────────────

const ZODIAC = [
  { jp: '山羊座', emoji: '♑', cutoff: 20 }, { jp: '水瓶座', emoji: '♒', cutoff: 19 },
  { jp: '魚座',   emoji: '♓', cutoff: 21 }, { jp: '牡羊座', emoji: '♈', cutoff: 20 },
  { jp: '牡牛座', emoji: '♉', cutoff: 21 }, { jp: '双子座', emoji: '♊', cutoff: 22 },
  { jp: '蟹座',   emoji: '♋', cutoff: 23 }, { jp: '獅子座', emoji: '♌', cutoff: 23 },
  { jp: '乙女座', emoji: '♍', cutoff: 23 }, { jp: '天秤座', emoji: '♎', cutoff: 24 },
  { jp: '蠍座',   emoji: '♏', cutoff: 23 }, { jp: '射手座', emoji: '♐', cutoff: 22 },
];

export function getZodiac(month: number, day: number) {
  const m = month - 1;
  const i = day < ZODIAC[m].cutoff ? m : (m + 1) % 12;
  return ZODIAC[i];
}
