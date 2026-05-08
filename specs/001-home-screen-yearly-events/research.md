# Research: ホーム画面 — 今年のイベント一覧

**Phase**: 0 | **Feature**: 001-home-screen-yearly-events | **Date**: 2026-05-09

## 調査項目と結論

---

### 1. `buildAllEvents` の出力構造と年フィルタリング可能性

**Decision**: `buildAllEvents(birthDate, sex): LifeEvent[]` の各エントリは `year: number`（イベントが発生する西暦年）を持つ。これをそのまま `e.year === displayYear` でフィルタリングすれば対象年のイベントのみ取得できる。

**Rationale**: `events.ts` を直接確認した結果、全イベントに `year` プロパティが存在し追加計算不要。`buildAllEvents` の結果をメモ化または都度呼び出しする際のコストも、登録人数×イベント数（最大 100件/人程度）で十分許容範囲。

**Alternatives considered**: `year` を含まない専用 API の作成 → 不要（既存 API で足りる）

---

### 2. 誕生日の扱い

**Decision**: `buildAllEvents` に毎年繰り返す「誕生日」イベントは含まれない（初年度の「1歳誕生日（一升餅）」のみ存在）。そのため、ホーム画面では各 Person の `dob` から `displayYear-MM-DD` として誕生日を別途生成する。

**Rationale**: `dob: string` は `"YYYY-MM-DD"` 形式で月・日が確定しているため、表示年の誕生日日付を `new Date(displayYear, dob月-1, dob日)` で正確に生成できる。

**Alternatives considered**: `buildAllEvents` に誕生日を追加 → 既存 UI（個人タイムライン）に影響が出るため却下

---

### 3. イベントのソート戦略

**Decision**: 誕生日は `new Date(displayYear, month-1, day)` で実際の日付を sortKey に使う。ライフイベントは特定の月日を持たない（`year` のみ）ため `new Date(displayYear, 0, 1)`（1月1日）を sortKey とし、年の先頭に配置する。同 sortKey 内は `buildAllEvents` の出力順（chronological order）を維持する。

**Rationale**: ユーザーは「その年に何があるか」を見たいため、年全体のイベント（学校入学など）を先に並べ、次に誕生日（具体的な日付）を見せる UX が自然。

**Alternatives considered**: 全イベントを月日不明として日付ソートしない → 誕生日の日付情報が活用できず残念

---

### 4. ホームビューとタブバーの統合方法

**Decision**: `homeMode: boolean` の state を追加し、`true` の場合はホーム画面を表示する。タブバー左端に「🏠」ボタン（固定、ScrollView 外）を追加し、タップで `homeMode = true`。メンバータブをタップすると `homeMode = false, activeId = p.id`。

**Rationale**: 既存の `activeId` state の意味を壊さず、最小限の変更で新 UI を追加できる。`activeId = 'home'` のようなセンチネル値は型安全性が低いため却下。

**Alternatives considered**:
- Expo Router の別画面にする → 全面的なルーティング変更が必要で過剰
- `viewMode: 'home' | 'person' | 'add'` のユニオン型 → state が3つに増えるが変更は少ない（こちらでも可）

---

### 5. 年切り替えの状態管理

**Decision**: `viewYear: number` state を `useState(new Date().getFullYear())` で初期化する。`useEffect` などでの永続化はしない（アプリ再起動で今年に戻る、FR-001d の要件通り）。

**Rationale**: AsyncStorage への保存は不要（spec の明示的な要件）。セッション中の state のみで管理する。

**Alternatives considered**: `useRef` → state 変更時に再レンダリングが必要なため不適

---

### 6. HomeScreen のコンポーネント分割

**Decision**: `src/screens/HomeScreen.tsx` として独立した関数コンポーネントを作成する。イベント集計ロジック（全人物 × 表示年）は `src/utils/yearlyEvents.ts` に分離する。

**Rationale**: `app/index.tsx` はすでに 180 行を超えており、ホーム画面ロジックを追加するとメンテナンスが困難になる。ユーティリティ分離により TypeScript 単体での検証も容易になる。

**Alternatives considered**: `index.tsx` への直接追記 → 可能だが行数が 300 行超になり可読性が落ちる

---

### 7. 既存コードへの影響範囲

**変更が必要なファイル:**

| ファイル | 変更種別 | 理由 |
|----------|----------|------|
| `app/index.tsx` | 編集 | `homeMode` / `viewYear` state 追加、タブバーにホームボタン追加、ルーティング分岐追加 |
| `src/screens/HomeScreen.tsx` | 新規作成 | ホーム画面 UI コンポーネント |
| `src/utils/yearlyEvents.ts` | 新規作成 | `YearlyEventItem` 型定義 + 集計ロジック |

**変更不要なファイル:**

| ファイル | 理由 |
|----------|------|
| `src/utils/events.ts` | `buildAllEvents` をそのまま利用、変更なし |
| `src/utils/storage.ts` | `Person` 型・永続化ロジックに変更なし |
| `src/utils/calendar.ts` | 変更なし |
| `src/screens/EventsScreen.tsx` | 個人タイムライン表示、変更なし |
| `src/screens/AddPersonScreen.tsx` | 変更なし |

---

## 未解決事項

なし。すべての NEEDS CLARIFICATION が解消済み。
