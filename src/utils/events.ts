// src/utils/events.ts

export type Sex = 'male' | 'female' | 'unknown';
export type FilterKey = 'kids' | 'school' | 'adult' | 'longevity';

export interface LifeEvent {
  label:  string;
  year:   number;
  note:   string;
  filter: FilterKey;
  tag:    string;
  color:  string;
}

export function buildAllEvents(birthDate: Date, sex: Sex): LifeEvent[] {
  const y = birthDate.getFullYear();
  const m = birthDate.getMonth() + 1;
  const d = birthDate.getDate();
  const sb       = (m > 4 || (m === 4 && d >= 2)) ? y + 1 : y;
  const lateNov  = m > 11 || (m === 11 && d > 15);
  const isMale   = sex === 'male';
  const isFemale = sex === 'female';
  const both     = sex === 'unknown';

  const ev: LifeEvent[] = [];

  // ── 子ども ──────────────────────────────────────────────────
  ev.push({ label:'お七夜',                 year:y,   note:'誕生から7日目・命名のお祝い',                          filter:'kids', tag:'🍼', color:'#f472b6' });
  ev.push({ label:'お宮参り',               year:y,   note:isMale?'男の子: 生後31〜32日目':isFemale?'女の子: 生後32〜33日目':'男31〜32日・女32〜33日目', filter:'kids', tag:'⛩', color:'#f472b6' });
  ev.push({ label:'お食い初め（百日祝い）', year:y,   note:'生後100〜120日頃、一生食べ物に困らないよう願う',      filter:'kids', tag:'🍚', color:'#f472b6' });
  ev.push({ label:'ハーフバースデー',       year:y,   note:'生後6ヶ月のお祝い',                                   filter:'kids', tag:'🎀', color:'#f472b6' });
  ev.push({ label:'初節句',  year:m<=(isMale?4:isFemale?2:3)?y:y+1, note:isMale?'端午の節句（5月5日）':isFemale?'桃の節句（3月3日）':'男: 端午5/5 / 女: 桃の節句3/3', filter:'kids', tag:'🎎', color:'#f472b6' });
  ev.push({ label:'1歳誕生日（一升餅）',   year:y+1, note:'一升餅を背負わせて健やかな成長を願う',                filter:'kids', tag:'🎂', color:'#f472b6' });

  if (isMale || both) {
    ev.push({ label:'七五三 3歳（男）', year:y+3+(lateNov?1:0), note:'髪置きの儀 11/15ごろ', filter:'kids', tag:'🎎', color:'#fb923c' });
    ev.push({ label:'七五三 5歳（男）', year:y+5+(lateNov?1:0), note:'袴着の儀 11/15ごろ',   filter:'kids', tag:'👘', color:'#fb923c' });
  }
  if (isFemale || both) {
    ev.push({ label:'七五三 3歳（女）', year:y+3+(lateNov?1:0), note:'髪置きの儀 11/15ごろ', filter:'kids', tag:'🎎', color:'#fb923c' });
    ev.push({ label:'七五三 7歳（女）', year:y+7+(lateNov?1:0), note:'帯解きの儀 11/15ごろ',  filter:'kids', tag:'👗', color:'#fb923c' });
  }

  // ── 学校 ────────────────────────────────────────────────────
  ev.push({ label:'保育園・幼稚園 入園', year:sb+3,  note:'3歳（年少）', filter:'school', tag:'🏫', color:'#a78bfa' });
  ev.push({ label:'小学校 入学',         year:sb+6,  note:'6歳',         filter:'school', tag:'📖', color:'#a78bfa' });
  ev.push({ label:'中学校 入学',         year:sb+12, note:'12歳',        filter:'school', tag:'📖', color:'#a78bfa' });
  ev.push({ label:'高校 入学',           year:sb+15, note:'15歳',        filter:'school', tag:'🎒', color:'#a78bfa' });
  ev.push({ label:'大学 入学（目安）',   year:sb+18, note:'18歳',        filter:'school', tag:'🎓', color:'#a78bfa' });
  ev.push({ label:'大学 卒業（目安）',   year:sb+22, note:'22歳',        filter:'school', tag:'🎓', color:'#a78bfa' });

  // ── 成人・節目 ───────────────────────────────────────────────
  ev.push({ label:'原付免許取得可能（16歳）',       year:y+16, note:'原動機付自転車（50cc以下）',              filter:'adult', tag:'🛵', color:'#60a5fa' });
  ev.push({ label:'普通自動車免許取得可能（18歳）', year:y+18, note:'AT・MT限定含む。合宿・通学で取得可能',    filter:'adult', tag:'🚗', color:'#60a5fa' });
  ev.push({ label:'選挙権（18歳）',                 year:y+18, note:'衆議院・参議院・地方選挙の投票権',         filter:'adult', tag:'🗳', color:'#60a5fa' });
  ev.push({ label:'成人（18歳）',                   year:y+18, note:'2022年より18歳成人',                       filter:'adult', tag:'🎊', color:'#60a5fa' });
  ev.push({ label:'成人式（20歳）',                 year:y+20, note:'式典は多くの自治体で20歳を対象',           filter:'adult', tag:'👘', color:'#60a5fa' });
  ev.push({ label:'中型自動車免許取得可能（20歳）', year:y+20, note:'車両総重量11t未満。普通免許取得後2年以上', filter:'adult', tag:'🚛', color:'#60a5fa' });
  ev.push({ label:'大型自動車免許取得可能（21歳）', year:y+21, note:'トラック・バス等。普通免許取得後3年以上',  filter:'adult', tag:'🚌', color:'#60a5fa' });
  ev.push({ label:'被選挙権 地方議会・衆議院・市区町村長（25歳）', year:y+25, note:'地方議会議員・衆議院議員・市区町村長への立候補が可能', filter:'adult', tag:'🏛', color:'#60a5fa' });
  ev.push({ label:'被選挙権 参議院・都道府県知事（30歳）',         year:y+30, note:'参議院議員・都道府県知事への立候補が可能',             filter:'adult', tag:'🏛', color:'#60a5fa' });

  if (isMale || both) {
    ev.push({ label:'厄年 前厄（男・25歳）', year:y+24, note:'男性 25歳前厄', filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 本厄（男・25歳）', year:y+25, note:'男性 25歳本厄', filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 後厄（男・26歳）', year:y+26, note:'男性 26歳後厄', filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 前厄（男・42歳）', year:y+41, note:'男性 大厄前厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 本厄（男・42歳）', year:y+42, note:'男性 大厄本厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 後厄（男・43歳）', year:y+43, note:'男性 大厄後厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
  }
  if (isFemale || both) {
    ev.push({ label:'厄年 前厄（女・19歳）', year:y+18, note:'女性 19歳前厄', filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 本厄（女・19歳）', year:y+19, note:'女性 19歳本厄', filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 後厄（女・20歳）', year:y+20, note:'女性 20歳後厄', filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 前厄（女・33歳）', year:y+32, note:'女性 大厄前厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 本厄（女・33歳）', year:y+33, note:'女性 大厄本厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 後厄（女・34歳）', year:y+34, note:'女性 大厄後厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 前厄（女・37歳）', year:y+36, note:'女性 37歳前厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 本厄（女・37歳）', year:y+37, note:'女性 37歳本厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
    ev.push({ label:'厄年 後厄（女・38歳）', year:y+38, note:'女性 37歳後厄',  filter:'adult', tag:'⚠️', color:'#60a5fa' });
  }
  ev.push({ label:'年金受給開始（目安）', year:y+65, note:'65歳（繰上・繰下により変動）', filter:'adult', tag:'💴', color:'#60a5fa' });

  // ── 長寿 ────────────────────────────────────────────────────
  const longevity: Array<{ label: string; year: number; note: string }> = [
    { label:'還暦', year:y+60,  note:'60歳・赤いちゃんちゃんこ 🔴' },
    { label:'古希', year:y+70,  note:'70歳 🟣' },
    { label:'喜寿', year:y+77,  note:'77歳 🟣' },
    { label:'傘寿', year:y+80,  note:'80歳 🟡' },
    { label:'米寿', year:y+88,  note:'88歳 🟡' },
    { label:'卒寿', year:y+90,  note:'90歳 🟡' },
    { label:'白寿', year:y+99,  note:'99歳 ⚪' },
    { label:'百寿', year:y+100, note:'100歳 🎉' },
    { label:'茶寿', year:y+108, note:'108歳' },
    { label:'皇寿', year:y+111, note:'111歳' },
  ];
  longevity.forEach(e => ev.push({ ...e, filter:'longevity', tag:'🎊', color:'#e8c547' }));

  // 重複除去 → 年順ソート
  const seen = new Set<string>();
  return ev
    .filter(e => { const k = `${e.label}${e.year}`; if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => a.year - b.year);
}
