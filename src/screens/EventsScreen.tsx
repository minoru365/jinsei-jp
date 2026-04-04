// src/screens/EventsScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { C, FILTER_COLOR } from '../utils/colors';
import { LifeEvent } from '../utils/events';
import { toWarekiYear } from '../utils/calendar';
import TimelineRow from '../components/TimelineRow';

const FILTERS = [
  { key: 'all',       label: 'すべて',  emoji: '📋' },
  { key: 'kids',      label: '子ども',  emoji: '🍼' },
  { key: 'school',    label: '学校',    emoji: '🏫' },
  { key: 'adult',     label: '成人',    emoji: '🎓' },
  { key: 'longevity', label: '長寿',    emoji: '🎊' },
];

interface Props {
  dob: string;
  events: LifeEvent[];
  age: number;
}

export default function EventsScreen({ dob, events, age }: Props) {
  const [activeFilter, setActiveFilter] = useState('all');
  const currentYear = new Date().getFullYear();

  const filtered = activeFilter === 'all'
    ? events
    : events.filter(e => e.filter === activeFilter);

  return (
    <View style={styles.container}>
      {/* フィルターバー（固定） */}
      <View style={styles.filterBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          const col = FILTER_COLOR[f.key];
          const count = f.key !== 'all' ? events.filter(e => e.filter === f.key).length : null;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterBtn, active && { borderColor: col, backgroundColor: `${col}22` }]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[styles.filterLabel, active && { color: col, fontWeight: '700' }]}>
                {f.emoji} {f.label}{count !== null ? ` ${count}` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* タイムライン */}
      <View style={styles.card}>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>該当するイベントがありません</Text>
        ) : (
          filtered.map((ev, i) => (
            <View key={`${ev.label}${ev.year}`}>
              {(i === 0 || filtered[i - 1].year !== ev.year) && (
                <View style={styles.divider}>
                  <Text style={styles.dividerYear}>{ev.year}年</Text>
                  <Text style={styles.dividerWareki}>{toWarekiYear(ev.year)}</Text>
                </View>
              )}
              <TimelineRow ev={ev} currentYear={currentYear} />
            </View>
          ))
        )}
      </View>

      <Text style={styles.hint}>
        💡 緑のドットは過去のイベント。七五三は3歳が男女とも、5歳は男の子、7歳は女の子が一般的です。
      </Text>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 40 },
  filterBar: { height: 40, borderBottomWidth: 1, borderBottomColor: C.border, justifyContent: 'center' },
  filterContent: { paddingHorizontal: 14, gap: 6, alignItems: 'center' },
  filterBtn: {
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
  },
  filterLabel: { fontSize: 11, color: C.muted },
  card: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 10 },
  divider: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: C.border,
    paddingTop: 6, paddingBottom: 8, marginTop: 4, marginBottom: 4,
  },
  dividerYear:   { fontSize: 11, fontWeight: '700', color: C.yellow, letterSpacing: 1 },
  dividerWareki: { fontSize: 10, color: C.muted },
  empty: { textAlign: 'center', color: C.muted, paddingVertical: 20, fontSize: 13 },
  hint: { fontSize: 11, color: C.muted, backgroundColor: C.pill, borderRadius: 10, padding: 10, marginBottom: 20 },
});
