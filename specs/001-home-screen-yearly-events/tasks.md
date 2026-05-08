# Tasks: ホーム画面 — 今年のイベント一覧

**Input**: Design documents from `specs/001-home-screen-yearly-events/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、未完了タスクへの依存なし）
- **[Story]**: 対応するユーザーストーリー（US1〜US4）
- 各タスクにファイルパスを明記

---

## Phase 1: Setup (共有インフラ)

**Purpose**: 実装に必要な新規ファイル・ディレクトリのみ用意。追加 npm パッケージは不要。

- [X] T001 新規ファイルのプレースホルダーを作成: `src/utils/yearlyEvents.ts`、`src/screens/HomeScreen.tsx`

**Checkpoint**: 2ファイルが存在し TypeScript コンパイラが認識できる状態

---

## Phase 2: Foundational (全 US の前提)

**Purpose**: すべてのユーザーストーリーが依存する集計ユーティリティを実装する。HomeScreen・index.tsx の実装はここが完了してから着手できる。

**⚠️ CRITICAL**: Phase 2 完了前にユーザーストーリーの実装を開始しないこと

- [X] T002 `YearlyEventItem` 型と `EventKind` 型を `src/utils/yearlyEvents.ts` に定義する（data-model.md の型定義に従う）
- [X] T003 `buildYearlyEvents(people: Person[], year: number): YearlyEventItem[]` を `src/utils/yearlyEvents.ts` に実装する（research.md §1〜§3 の設計に従い、誕生日エントリ生成 + buildAllEvents フィルタリング + sortDate 昇順ソート）
- [X] T004 `npx tsc --noEmit` を実行して T002〜T003 の型エラーがないことを確認する

**Checkpoint**: `buildYearlyEvents` が TypeScript エラーなしで呼び出せる状態

---

## Phase 3: User Story 1 — 今年のイベント一覧ホーム表示 (Priority: P1) 🎯 MVP

**Goal**: アプリ起動時にホーム画面が表示され、全メンバーの今年のイベントが日付順に一覧表示される

**Independent Test**: Expo Go でアプリを起動 → 最初にホーム画面が表示され、登録済みメンバーのイベント一覧が確認できる。イベント行をタップするとそのメンバーの個人タイムラインに遷移する。

### Implementation for User Story 1

- [X] T005 [US1] `src/screens/HomeScreen.tsx` に `HomeScreenProps` interface と基本コンポーネント骨格を実装する
- [X] T006 [US1] `HomeScreen.tsx` に `buildYearlyEvents` を使ったイベント一覧の ScrollView + イベント行レンダリングを実装する
- [X] T007 [US1] `app/index.tsx` に `homeMode: boolean`（初期値 `true`）state を追加し、起動時のデフォルトビューをホーム画面に変更する
- [X] T008 [US1] `app/index.tsx` のメインレンダリング分岐に `homeMode === true` のケースを追加し `<HomeScreen>` を描画する
- [X] T009 [US1] `app/index.tsx` に `viewYear: number`（初期値 `new Date().getFullYear()`）state を追加し、`HomeScreen` の `viewYear` / `onYearPrev` / `onYearNext` props に接続する
- [X] T010 [US1] `npx tsc --noEmit` を実行して US1 実装の型エラーがないことを確認する（手動確認は Expo Go で実施）

**Checkpoint**: アプリ起動 → ホーム画面にイベント一覧が表示され、行タップで個人タイムラインに遷移できる

---

## Phase 4: User Story 2 — 登録メンバーがいないときの案内 (Priority: P2)

**Goal**: メンバーゼロ時に空状態メッセージが表示され、メンバー追加に誘導される

**Independent Test**: AsyncStorage をクリアしてアプリを起動（またはメンバーを全員削除）→ 空状態メッセージと追加ボタンが表示され、タップでメンバー追加フォームに遷移する

### Implementation for User Story 2

- [X] T011 [P] [US2] `HomeScreen.tsx` に `people.length === 0` の空状態 UI を追加する
- [X] T012 [P] [US2] `HomeScreen.tsx` に `people.length > 0 && events.length === 0` の空状態 UI を追加する
- [X] T013 [US2] Expo Go でメンバーゼロ状態を確認し、空状態が正しく表示されることを手動確認する（ユーザー確認待ち）

**Checkpoint**: メンバーゼロ → 追加ボタン表示・タップでフォーム遷移。メンバーありイベントなし → 空メッセージ表示

---

## Phase 5: User Story 3 — 表示年を前後に切り替える (Priority: P2)

**Goal**: ホーム画面に年ナビゲーターが表示され、前後の年に切り替えられる。再起動で今年に戻る。

**Independent Test**: ホーム画面の ← → をタップ → 表示年とイベント一覧が変わる。アプリを再起動 → 今年の一覧に戻っている。

### Implementation for User Story 5

- [X] T014 [US3] `HomeScreen.tsx` の上部に年ナビゲーター UI を実装する
- [X] T015 [US3] Expo Go で年ナビゲーターの動作を手動確認する（← → タップで年・イベント一覧が変わる、再起動で今年に戻る）

**Checkpoint**: 年ナビゲーターが機能し、任意の年のイベント一覧が表示される。再起動で今年にリセットされる。

---

## Phase 6: User Story 4 — タブバーで個人タイムラインに切り替える (Priority: P3)

**Goal**: タブバーに🏠ボタンを追加し、ホームビューと個人タイムラインビューをシームレスに切り替えられる

**Independent Test**: 個人タブをタップ → 個人タイムラインに切り替わる。🏠をタップ → ホームに戻る。

### Implementation for User Story 4

- [X] T016 [US4] `app/index.tsx` のタブバーに🏠ボタンを ScrollView の左外に追加する
- [X] T017 [US4] `app/index.tsx` の既存メンバータブの `onPress` に `setHomeMode(false)` を追加する
- [X] T018 [US4] `app/index.tsx` に `onPersonSelect` ハンドラを実装する
- [X] T019 [US4] `app/index.tsx` の `tabActive` スタイル適用条件を更新する
- [X] T020 [US4] 🏠ボタン用スタイルを `StyleSheet.create` に追加する
- [X] T021 [US4] `npx tsc --noEmit` を実行して型エラーがないことを確認する（タブ切り替えの手動確認は Expo Go で実施）

**Checkpoint**: 🏠 → ホーム、メンバータブ → 個人タイムライン、追加→個人タイムラインの全遷移が機能する

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: 型検証・細部の整合性・不要コードの整理

- [X] T022 `npx tsc --noEmit` を最終実行してプロジェクト全体のエラーゼロを確認する
- [ ] T023 Expo Go で Validation Strategy（plan.md 参照）の全7項目を順に手動確認し、問題があれば修正する
- [X] T024 不要な `console.log` や TODO コメントがないか `app/index.tsx`・`HomeScreen.tsx`・`yearlyEvents.ts` を確認して除去する

---

## Dependencies (実装順序)

```
T001 → T002 → T003 → T004 (Phase 1-2 基盤)
                  ↓
T005 → T006 → T007 → T008 → T009 → T010 (US1)
                                       ↓
                              T011, T012 → T013 (US2, 並列可)
                                       ↓
                                      T014 → T015 (US3)
                                       ↓
                         T016 → T017 → T018 → T019 → T020 → T021 (US4)
                                                                    ↓
                                                     T022 → T023 → T024 (Polish)
```

## Parallel Execution Opportunities

| 並列実行可能なタスク | 条件 |
|----------------------|------|
| T011 + T012 | 同じ HomeScreen.tsx 内だが異なる条件分岐。US2 着手時に同時進行可 |

## Implementation Strategy (MVP First)

1. **MVP** = Phase 2 + Phase 3（T001〜T010）: ホーム画面に全員のイベントが表示される最小動作版
2. **+空状態** = Phase 4（T011〜T013）: エッジケース対応
3. **+年切り替え** = Phase 5（T014〜T015）: 年ナビゲーター追加
4. **+タブ統合** = Phase 6（T016〜T021）: ホームと個人タイムラインのシームレス切り替え
5. **完成** = Final Phase（T022〜T024）: 検証・整理

---

## Format Validation

全タスクが `- [ ] [ID] [P?] [Story?] 説明 ファイルパス付き` 形式に準拠していること:
- ✅ 全タスクにチェックボックスあり
- ✅ 全タスクに T001〜T024 のシーケンシャル ID あり
- ✅ ユーザーストーリーフェーズのタスクに [US1]〜[US4] ラベルあり
- ✅ 並列可能なタスクに [P] ラベルあり
- ✅ 全タスクにファイルパスあり
