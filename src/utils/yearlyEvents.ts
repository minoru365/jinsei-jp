// src/utils/yearlyEvents.ts
import { Person } from './storage';
import { buildAllEvents, Sex } from './events';

export type EventKind = 'birthday' | 'lifeEvent';

export interface YearlyEventItem {
  personId:   string;
  personName: string;
  personSex:  Sex;
  label:      string;
  kind:       EventKind;
  sortDate:   Date;
  tag:        string;
  color:      string;
}

export function buildYearlyEvents(people: Person[], year: number): YearlyEventItem[] {
  const items: YearlyEventItem[] = [];

  for (const p of people) {
    const [y, m, d] = p.dob.split('-').map(Number);
    const dob = new Date(y, m - 1, d);

    // 誕生日（毎年）
    items.push({
      personId:   p.id,
      personName: p.name,
      personSex:  p.sex,
      label:      '誕生日',
      kind:       'birthday',
      sortDate:   new Date(year, m - 1, d),
      tag:        '🎂',
      color:      '#f472b6',
    });

    // ライフイベント（その年が発生年のもの）
    const events = buildAllEvents(dob, p.sex).filter(e => e.year === year);
    for (const e of events) {
      items.push({
        personId:   p.id,
        personName: p.name,
        personSex:  p.sex,
        label:      e.label,
        kind:       'lifeEvent',
        sortDate:   new Date(year, 0, 1), // 月日不明 → 年頭
        tag:        e.tag,
        color:      e.color,
      });
    }
  }

  return items.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
}
