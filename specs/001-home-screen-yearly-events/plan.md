# Implementation Plan: ホーム画面 — 今年のイベント一覧

**Branch**: `001-home-screen-yearly-events` | **Date**: 2026-05-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-home-screen-yearly-events/spec.md`

## Summary

アプリ起動時のデフォルトビューを「登録メンバー全員の指定年のライフイベント・誕生日一覧」に変更する。既存の `buildAllEvents` ユーティリティを活用し、`YearlyEventItem` 集計型を新設。`app/index.tsx` に `homeMode` / `viewYear` state を追加し、新コンポーネント `HomeScreen` へ委譲する。タブバーに「🏠」ホームボタンを左端固定で追加し、既存のメンバータブと共存させる。

## Technical Context

**Language/Version**: TypeScript ~5.9.2 / React 19.1.0 / React Native 0.81.5  
**Primary Dependencies**: Expo ~54.0.0 / expo-router ~6.0.23 / @react-native-async-storage/async-storage 2.2.0（追加ライブラリなし）  
**Storage**: AsyncStorage（既存。本機能は追加の永続化を行わない）  
**Testing**: `npx tsc --noEmit` + Expo Go での手動検証（既存方針）  
**Target Platform**: iOS 優先 / Expo Go または EAS Build  
**Project Type**: モバイルアプリ（Expo / React Native）  
**Performance Goals**: 起動から一覧表示まで体感遅延なし（AsyncStorage の loadPeople は既に起動時に実行済み）  
**Constraints**: 追加ライブラリなし、AsyncStorage のみ、UI は日本語  
**Scale/Scope**: メンバー数〜数十人、イベント数〜100件/人、年切り替えは無制限

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 判定 | 根拠 |
|------|------|------|
| I. Calendar Accuracy First | ✅ PASS | 既存の `buildAllEvents` をそのまま使用。誕生日は `dob` から正確な月日で算出。新規の日付計算ロジックなし |
| II. Privacy by Default | ✅ PASS | 全データは AsyncStorage のままオンデバイス。新規のデータ収集・外部通信なし |
| III. Expo-Compatible Simplicity | ✅ PASS | 追加ライブラリなし。既存 util を拡張する最小限の変更 |
| IV. Verifiable Changes | ✅ PASS | `npx tsc --noEmit` + Expo Go でのホーム画面手動確認を検証手順に明記 |
| V. Incremental Spec-Driven Delivery | ✅ PASS | spec/plan/tasks を経由している |

**ゲート結果**: 全原則パス。違反なし。実装に進んでよい。

## Project Structure

### Documentation (this feature)

```text
specs/001-home-screen-yearly-events/
├── plan.md              # このファイル
├── research.md          # Phase 0 完了
├── data-model.md        # Phase 1 完了
└── tasks.md             # /speckit.tasks で生成（未作成）
```

### Source Code — 変更対象ファイル

```text
app/
└── index.tsx              # 編集: homeMode/viewYear state追加、🏠タブ追加、ルーティング分岐追加

src/
├── screens/
│   ├── HomeScreen.tsx     # 新規: 全員イベント一覧UI
│   └── EventsScreen.tsx   # 変更なし
└── utils/
    ├── yearlyEvents.ts    # 新規: YearlyEventItem型 + buildYearlyEvents()
    ├── events.ts          # 変更なし
    ├── storage.ts         # 変更なし
    ├── calendar.ts        # 変更なし
    └── colors.ts          # 変更なし
```

**Structure Decision**: 単一 Expo モバイルアプリ。新規ファイルは既存の `src/screens/` と `src/utils/` の慣例に従う。

## Implementation Design

### 新規: `src/utils/yearlyEvents.ts`

```ts
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

    // 誕生日（毎年あり）
    items.push({
      personId: p.id, personName: p.name, personSex: p.sex,
      label: '誕生日', kind: 'birthday',
      sortDate: new Date(year, m - 1, d),
      tag: '🎂', color: '#f472b6',
    });

    // ライフイベント（その年が発生年のもの）
    const events = buildAllEvents(dob, p.sex).filter(e => e.year === year);
    for (const e of events) {
      items.push({
        personId: p.id, personName: p.name, personSex: p.sex,
        label: e.label, kind: 'lifeEvent',
        sortDate: new Date(year, 0, 1),   // 月日不明 → 年頭
        tag: e.tag, color: e.color,
      });
    }
  }

  return items.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
}
```

---

### 新規: `src/screens/HomeScreen.tsx`

**Props:**
```ts
interface HomeScreenProps {
  people:         Person[];
  viewYear:       number;
  onYearPrev:     () => void;
  onYearNext:     () => void;
  onPersonSelect: (personId: string) => void;
  onAddPerson:    () => void;
}
```

**UI 構成:**

```
┌─────────────────────────────────────┐
│  ← 2025年  →                        │  ← 年ナビゲーター (View, 年表示付き)
├─────────────────────────────────────┤
│  [空状態] メンバーがいません         │  ← people.length === 0 のとき
│  ＋ メンバーを追加                   │
├─────────────────────────────────────┤
│  [空状態] 今年のイベントはありません  │  ← events.length === 0 のとき（人はいる）
├─────────────────────────────────────┤
│  [1月1日] 🎒 田中 花子 - 小学校入学  │  ← lifeEvent 行（日付表示: M月D日 or 年頭）
│  [3月15日] 🎂 山田 太郎 - 誕生日     │  ← birthday 行
│  ...                                 │
└─────────────────────────────────────┘
```

**レンダリングロジック（条件分岐）:**

1. `people.length === 0` → 空状態（メンバーなし）+ 追加ボタン
2. `events.length === 0` → 空状態（イベントなし）
3. それ以外 → `FlatList` または `ScrollView` でイベント行を表示

**イベント行の表示項目:**
- 日付: `kind === 'birthday'` は `M月D日`, `kind === 'lifeEvent'` は年頭のため非表示またはラベルで代替
- 絵文字タグ + メンバー名 + ラベル（イベント名）

---

### 編集: `app/index.tsx`

**追加 state:**
```ts
const [homeMode, setHomeMode] = useState<boolean>(true);
const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
```

**タブバーへの追加（🏠ボタンを ScrollView 左外に固定）:**
```tsx
<View style={styles.tabRow}>
  <TouchableOpacity style={styles.homeTabBtn} onPress={() => { setHomeMode(true); setAdding(false); }}>
    <Text style={styles.homeTabBtnText}>🏠</Text>
  </TouchableOpacity>
  <ScrollView ...>
    {/* 既存のメンバータブ */}
  </ScrollView>
  <TouchableOpacity style={styles.addTabBtn} ...>
    <Text>＋</Text>
  </TouchableOpacity>
</View>
```

**ルーティング分岐:**
```tsx
{adding ? (
  <AddPersonScreen ... />
) : homeMode ? (
  <HomeScreen
    people={people}
    viewYear={viewYear}
    onYearPrev={() => setViewYear(y => y - 1)}
    onYearNext={() => setViewYear(y => y + 1)}
    onPersonSelect={(id) => { setActiveId(id); setHomeMode(false); }}
    onAddPerson={() => setAdding(true)}
  />
) : active && info ? (
  <View style={styles.flex}>
    {/* 既存のヒーローカード + EventsScreen */}
  </View>
) : null}
```

---

## Validation Strategy

| 検証項目 | 方法 |
|----------|------|
| TypeScript 型エラーなし | `npx tsc --noEmit` exit code 0 |
| 起動時にホーム画面が表示される | Expo Go で起動、最初にホーム画面が見える |
| 年ナビゲーターで年切り替えが動く | ← → をタップして表示年と一覧が変わることを確認 |
| メンバータブタップで個人画面に遷移 | タブをタップして従来のヒーローカード + タイムラインが表示される |
| 🏠ボタンでホームに戻る | 個人画面から🏠をタップしてホームに戻る |
| メンバーゼロで空状態表示 | AsyncStorage をクリアした状態で起動、空状態メッセージが表示される |
| 再起動で今年に戻る | 来年に切り替え → アプリ再起動 → 今年の一覧に戻っている |

## 設計後の Constitution Check（再確認）

Phase 1 設計完了後に再確認:

| 原則 | 判定 | 根拠 |
|------|------|------|
| I. Calendar Accuracy First | ✅ PASS | 誕生日は `dob` から直接算出。`buildAllEvents` を変更しない |
| II. Privacy by Default | ✅ PASS | `viewYear` state はオンメモリのみ。新規データ収集なし |
| III. Expo-Compatible Simplicity | ✅ PASS | 新ファイル 2 つ + 既存ファイル 1 つの編集のみ |
| IV. Verifiable Changes | ✅ PASS | 全検証項目を上表に定義済み |
| V. Incremental Spec-Driven Delivery | ✅ PASS | spec/plan を完了し tasks で段階実行 |

