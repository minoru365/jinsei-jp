# Data Model: ホーム画面 — 今年のイベント一覧

**Phase**: 1 | **Feature**: 001-home-screen-yearly-events | **Date**: 2026-05-09

## 既存エンティティ（変更なし）

### Person (`src/utils/storage.ts`)

```ts
interface Person {
  id:   string;          // nanoid など一意ID
  name: string;          // 表示名
  dob:  string;          // ISO 8601: "YYYY-MM-DD"
  sex:  'male' | 'female' | 'unknown';
}
```

### LifeEvent (`src/utils/events.ts`)

```ts
interface LifeEvent {
  label:  string;        // イベント名（例: "小学校 入学"）
  year:   number;        // 発生する西暦年（整数）
  note:   string;        // 補足説明
  filter: FilterKey;     // 'kids' | 'school' | 'adult' | 'longevity'
  tag:    string;        // 絵文字タグ
  color:  string;        // 表示カラー (HEX)
}
```

---

## 新規エンティティ

### YearlyEventItem (`src/utils/yearlyEvents.ts`)

ホーム画面の一覧表示に使う集計エンティティ。AsyncStorage への保存は行わない（導出データ）。

```ts
export type EventKind = 'birthday' | 'lifeEvent';

export interface YearlyEventItem {
  personId:   string;      // 元 Person の id（タップ時の遷移先特定に使用）
  personName: string;      // 表示用の名前
  personSex:  Sex;         // アイコン表示用
  label:      string;      // "誕生日" または LifeEvent.label
  kind:       EventKind;   // 種別
  sortDate:   Date;        // ソート用日付
                           //   birthday   → new Date(displayYear, month-1, day)
                           //   lifeEvent  → new Date(displayYear, 0, 1)（月日不明なので1月1日）
  tag:        string;      // 絵文字タグ
  color:      string;      // 表示カラー (HEX)
}
```

**バリデーションルール:**
- `personId` は登録済み `Person.id` と一致すること（参照整合性は実行時に保証）
- `sortDate.getFullYear() === displayYear` であること
- `kind === 'birthday'` のとき `label === '誕生日'` かつ `sortDate` の月日が元の dob と一致すること

**状態遷移・導出:**

```
Person[] + displayYear
       │
       ▼
buildYearlyEvents(people, year): YearlyEventItem[]
       │
       ├─ 各 Person につき
       │    ├─ 誕生日エントリを1件生成 (kind: 'birthday')
       │    └─ buildAllEvents(dob, sex).filter(e => e.year === year) → lifeEvent エントリを0〜N件生成
       │
       └─ sortDate 昇順でソート
              ↓
       HomeScreen へ渡す
```

---

## UI 状態モデル (`app/index.tsx`)

追加する state のみ記載：

```ts
const [homeMode, setHomeMode] = useState<boolean>(true);
// true:  ホーム画面（全員一覧）を表示
// false: 個人タイムライン詳細を表示
// セッション中のみ保持（永続化なし）

const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
// 現在ホーム画面に表示している年
// セッション中のみ保持（永続化なし・再起動で今年に戻る）
```

**状態遷移:**

```
起動
  └─ homeMode=true, viewYear=currentYear

🏠ボタンタップ
  └─ homeMode=true, adding=false

人物タブタップ
  └─ homeMode=false, activeId=p.id, adding=false

「＋」タップ
  └─ adding=true (homeMode は変化しない)

AddPersonScreen で保存完了
  └─ homeMode=false, activeId=newPerson.id, adding=false

← / → 年送りボタンタップ
  └─ viewYear ± 1 （homeMode=true のときのみ表示）
```

---

## コンポーネントインターフェース

### HomeScreen props

```ts
interface HomeScreenProps {
  people:    Person[];
  viewYear:  number;
  onYearPrev: () => void;
  onYearNext: () => void;
  onPersonSelect: (personId: string) => void;  // タイムライン詳細への遷移
  onAddPerson:    () => void;                  // 空状態からメンバー追加への誘導
}
```
