// src/screens/FortuneScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { C } from '../utils/colors';
import { getTodayFortune } from '../utils/fortune';

interface Props {
  dob: string;
}

export default function FortuneScreen({ dob }: Props) {
  const fortune = getTodayFortune(new Date(dob));
  const { level, message, item, color, number, luck, love, work, money } = fortune;

  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  const bars = [
    { label: '総合運', value: luck,  color: level.color },
    { label: '恋愛運', value: love,  color: C.pink },
    { label: '仕事運', value: work,  color: C.blue },
    { label: '金運',   value: money, color: C.yellow },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* ヒーロー */}
      <View style={[styles.hero, { borderColor: `${level.color}44`, backgroundColor: `${level.color}11` }]}>
        <Text style={styles.dateStr}>{dateStr}の運勢</Text>
        <Text style={styles.emoji}>{level.emoji}</Text>
        <Text style={[styles.levelText, { color: level.color }]}>{level.label}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      {/* 運勢バランス */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 運勢バランス</Text>
        {bars.map(b => (
          <View key={b.label} style={styles.barWrap}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>{b.label}</Text>
              <Text style={[styles.barValue, { color: b.color }]}>{b.value}</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${b.value}%`, backgroundColor: b.color }]} />
            </View>
          </View>
        ))}
      </View>

      {/* ラッキー */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🍀 ラッキー</Text>
        <View style={styles.luckyRow}>
          <Text style={styles.luckyIcon}>🎁</Text>
          <View>
            <Text style={styles.luckyKey}>ラッキーアイテム</Text>
            <Text style={styles.luckyVal}>{item}</Text>
          </View>
        </View>
        <View style={styles.luckyRow}>
          <View style={[styles.colorDot, { backgroundColor: color.hex }]} />
          <View>
            <Text style={styles.luckyKey}>ラッキーカラー</Text>
            <Text style={styles.luckyVal}>{color.name}</Text>
          </View>
        </View>
        <View style={styles.luckyRow}>
          <Text style={styles.luckyIcon}>🔢</Text>
          <View>
            <Text style={styles.luckyKey}>ラッキーナンバー</Text>
            <Text style={styles.luckyVal}>{number}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.hint}>💡 運勢は生年月日と今日の日付から算出。毎日0時にリセットされます。</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 40 },
  hero: { borderWidth: 1, borderRadius: 20, padding: 24, marginBottom: 10, alignItems: 'center' },
  dateStr:   { fontSize: 11, color: C.muted, marginBottom: 8 },
  emoji:     { fontSize: 52, lineHeight: 60, marginBottom: 8 },
  levelText: { fontSize: 28, fontWeight: '900', letterSpacing: -1, marginBottom: 4 },
  message:   { fontSize: 13, color: C.muted, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  card: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase', marginBottom: 12 },
  barWrap: { marginBottom: 10 },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barLabel: { fontSize: 12, color: C.muted },
  barValue: { fontSize: 12, fontWeight: '700' },
  barTrack: { backgroundColor: C.pill, borderRadius: 99, height: 8, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: 99 },
  luckyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  luckyIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  luckyKey:  { fontSize: 11, color: C.muted },
  luckyVal:  { fontSize: 15, fontWeight: '700', color: C.text },
  colorDot:  { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  hint: { fontSize: 11, color: C.muted, backgroundColor: C.pill, borderRadius: 10, padding: 10 },
});
