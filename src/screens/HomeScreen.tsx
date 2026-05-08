// src/screens/HomeScreen.tsx
import React, { useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { C } from '../utils/colors';
import { Person } from '../utils/storage';
import { Sex } from '../utils/events';
import { buildYearlyEvents, YearlyEventItem } from '../utils/yearlyEvents';

interface HomeScreenProps {
  people:         Person[];
  viewYear:       number;
  onYearPrev:     () => void;
  onYearNext:     () => void;
  onPersonSelect: (personId: string) => void;
  onAddPerson:    () => void;
}

function sexIcon(sex: Sex) {
  return sex === 'male' ? '👦' : sex === 'female' ? '👧' : '';
}

function formatSortDate(item: YearlyEventItem): string {
  if (item.kind === 'birthday') {
    const m = item.sortDate.getMonth() + 1;
    const d = item.sortDate.getDate();
    return `${m}月${d}日`;
  }
  return '年内';
}

export default function HomeScreen({
  people, viewYear, onYearPrev, onYearNext, onPersonSelect, onAddPerson,
}: HomeScreenProps) {
  const events = useMemo(
    () => buildYearlyEvents(people, viewYear),
    [people, viewYear],
  );

  return (
    <View style={styles.container}>
      {/* 年ナビゲーター */}
      <View style={styles.yearNav}>
        <TouchableOpacity style={styles.yearBtn} onPress={onYearPrev}>
          <Text style={styles.yearBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.yearLabel}>{viewYear}年</Text>
        <TouchableOpacity style={styles.yearBtn} onPress={onYearNext}>
          <Text style={styles.yearBtnText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* 空状態: メンバーなし */}
      {people.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>メンバーがいません</Text>
          <Text style={styles.emptyDesc}>＋ボタンからメンバーを追加してください</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAddPerson}>
            <Text style={styles.addBtnText}>メンバーを追加</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 空状態: メンバーはいるがイベントなし */}
      {people.length > 0 && events.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{viewYear}年のイベントはありません</Text>
          <Text style={styles.emptyDesc}>← → で別の年を確認できます</Text>
        </View>
      )}

      {/* イベント一覧 */}
      {events.length > 0 && (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {events.map((item, i) => (
            <TouchableOpacity
              key={`${item.personId}-${item.label}-${i}`}
              style={styles.row}
              onPress={() => onPersonSelect(item.personId)}
            >
              <View style={[styles.dateBox, { borderColor: item.color }]}>
                <Text style={[styles.dateText, { color: item.color }]}>
                  {formatSortDate(item)}
                </Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTag}>{item.tag}</Text>
                <View style={styles.rowTextBlock}>
                  <Text style={styles.rowName}>
                    {sexIcon(item.personSex)} {item.personName}
                  </Text>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  yearNav:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 20 },
  yearBtn:     { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: C.pill },
  yearBtnText: { fontSize: 18, color: C.text },
  yearLabel:   { fontSize: 18, fontWeight: '700', color: C.text, minWidth: 80, textAlign: 'center' },
  empty:       { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyTitle:  { fontSize: 16, fontWeight: '700', color: C.text },
  emptyDesc:   { fontSize: 13, color: C.muted },
  addBtn:      { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: C.yellow },
  addBtnText:  { fontSize: 14, fontWeight: '700', color: '#0f0e17' },
  list:        { flex: 1 },
  listContent: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 20, gap: 8 },
  row:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1c35', borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 12, gap: 12 },
  dateBox:     { width: 54, alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingVertical: 4 },
  dateText:    { fontSize: 11, fontWeight: '700' },
  rowContent:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowTag:      { fontSize: 22 },
  rowTextBlock:{ flex: 1 },
  rowName:     { fontSize: 13, fontWeight: '700', color: C.text },
  rowLabel:    { fontSize: 12, color: C.muted, marginTop: 2 },
});
