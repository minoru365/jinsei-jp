// app/index.tsx  (Expo Router エントリ)
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { C } from '../src/utils/colors';
import { buildAllEvents } from '../src/utils/events';
import { toWarekiFromDate, getZodiac, getEto } from '../src/utils/calendar';
import { Person, loadPeople, savePeople } from '../src/utils/storage';
import EventsScreen  from '../src/screens/EventsScreen';
import FortuneScreen from '../src/screens/FortuneScreen';
import AddPersonScreen from '../src/screens/AddPersonScreen';

function computeAge(dob: string): number {
  const d = new Date(dob);
  const today = new Date();
  const m = d.getMonth(), day = d.getDate();
  return today.getFullYear() - d.getFullYear() -
    (today < new Date(today.getFullYear(), m, day) ? 1 : 0);
}

function sexIcon(sex: string) { return sex === 'male' ? '👦' : sex === 'female' ? '👧' : ''; }

export default function App() {
  const [people,   setPeople]   = useState<Person[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [adding,   setAdding]   = useState(false);
  const [viewMode, setViewMode] = useState<'events' | 'fortune'>('events');
  const [loaded,   setLoaded]   = useState(false);

  // 起動時にAsyncStorageから読み込む
  useEffect(() => {
    loadPeople().then(ps => {
      setPeople(ps);
      if (ps.length) setActiveId(ps[0].id);
      setLoaded(true);
    });
  }, []);

  // 変更時に保存
  useEffect(() => {
    if (loaded) savePeople(people);
  }, [people, loaded]);

  const handleAdd = useCallback((p: Person) => {
    setPeople(prev => [...prev, p]);
    setActiveId(p.id);
    setAdding(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('削除', 'この人を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除', style: 'destructive', onPress: () => {
          setPeople(prev => {
            const next = prev.filter(p => p.id !== id);
            if (next.length) setActiveId(next[0].id);
            else setActiveId(null);
            return next;
          });
        }
      },
    ]);
  }, []);

  const active = people.find(p => p.id === activeId) ?? null;
  const events = active ? buildAllEvents(new Date(active.dob), active.sex) : [];
  const age    = active ? computeAge(active.dob) : 0;
  const info   = active ? (() => {
    const d = new Date(active.dob);
    return {
      wareki: toWarekiFromDate(d),
      zodiac: getZodiac(d.getMonth() + 1, d.getDate()),
      eto:    getEto(d.getFullYear()),
      y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate(),
    };
  })() : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.htitle}>🗾 人生.jp</Text>
        <Text style={styles.hsub}>生まれた日から、あなたの人生を見渡す</Text>
      </View>

      {/* 人物タブバー */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabContent}>
        {people.map(p => (
          <TouchableOpacity
            key={p.id}
            style={[styles.tab, p.id === activeId && !adding && styles.tabActive]}
            onPress={() => { setActiveId(p.id); setAdding(false); }}
          >
            <Text style={[styles.tabText, p.id === activeId && !adding && styles.tabTextActive]}>
              {sexIcon(p.sex)} {p.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addTabBtn} onPress={() => setAdding(true)}>
          <Text style={styles.addTabBtnText}>＋</Text>
        </TouchableOpacity>
      </ScrollView>

      {adding ? (
        <AddPersonScreen onAdd={handleAdd} onCancel={() => setAdding(false)} />
      ) : active && info ? (
        <View style={styles.flex}>
          {/* ビュー切替 */}
          <View style={styles.viewTab}>
            <TouchableOpacity style={[styles.vt, viewMode === 'events' && styles.vtActive]} onPress={() => setViewMode('events')}>
              <Text style={[styles.vtText, viewMode === 'events' && styles.vtTextActive]}>📅 ライフイベント</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.vt, styles.vtLast, viewMode === 'fortune' && styles.vtActive]} onPress={() => setViewMode('fortune')}>
              <Text style={[styles.vtText, viewMode === 'fortune' && styles.vtTextActive]}>🔮 今日の運勢</Text>
            </TouchableOpacity>
          </View>

          {/* ヒーローカード */}
          <View style={styles.heroBox}>
            <Text style={styles.heroName}>{sexIcon(active.sex)} {active.name}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: C.yellow }]}><Text style={styles.badgeText}>{age}歳</Text></View>
              <View style={[styles.badge, { backgroundColor: C.purple }]}><Text style={styles.badgeText}>{info.wareki}</Text></View>
              {active.sex !== 'unknown' && (
                <View style={[styles.badge, { backgroundColor: active.sex === 'male' ? C.blue : C.pink }]}>
                  <Text style={styles.badgeText}>{active.sex === 'male' ? '男性' : '女性'}</Text>
                </View>
              )}
            </View>
            <View style={styles.pillRow}>
              {[`${info.zodiac.emoji} ${info.zodiac.jp}`, info.eto.animal, `${info.y}年${info.m}月${info.day}日`].map(t => (
                <View key={t} style={styles.pill}><Text style={styles.pillText}>{t}</Text></View>
              ))}
            </View>
            <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(active.id)}>
              <Text style={styles.delBtnText}>🗑 削除</Text>
            </TouchableOpacity>
          </View>

          {/* コンテンツ */}
          {viewMode === 'events'
            ? <EventsScreen dob={active.dob} events={events} age={age} />
            : <FortuneScreen dob={active.dob} />
          }
        </View>
      ) : !adding && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>＋ ボタンから人を追加してください</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  flex:    { flex: 1 },
  header:  { backgroundColor: '#1a1829', borderBottomWidth: 1, borderBottomColor: C.border, padding: 16, paddingBottom: 12 },
  htitle:  { fontSize: 19, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  hsub:    { fontSize: 11, color: C.muted, marginTop: 2 },
  tabBar:  { maxHeight: 50 },
  tabContent: { alignItems: 'center', paddingHorizontal: 14, gap: 8, paddingVertical: 8 },
  tab:         { paddingHorizontal: 15, paddingVertical: 7, borderRadius: 20, backgroundColor: C.pill },
  tabActive:   { backgroundColor: C.yellow },
  tabText:     { fontSize: 13, color: C.muted, fontWeight: '500' },
  tabTextActive: { color: '#0f0e17', fontWeight: '700' },
  addTabBtn:   { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border },
  addTabBtnText: { fontSize: 18, color: C.muted, lineHeight: 22 },
  viewTab: { flexDirection: 'row', marginHorizontal: 14, marginTop: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  vt:      { flex: 1, paddingVertical: 10, alignItems: 'center', borderRightWidth: 1, borderRightColor: C.border },
  vtLast:  { borderRightWidth: 0 },
  vtActive:    { backgroundColor: C.pill },
  vtText:      { fontSize: 13, color: C.muted },
  vtTextActive:{ fontWeight: '700', color: C.text },
  heroBox: { margin: 14, marginBottom: 0, backgroundColor: '#1e1c35', borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 20 },
  heroName: { fontSize: 24, fontWeight: '900', color: C.text, letterSpacing: -0.5, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  badge:    { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:{ fontSize: 11, fontWeight: '700', color: '#0f0e17' },
  pillRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill:     { backgroundColor: C.pill, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  pillText: { fontSize: 12, color: C.text },
  delBtn:   { marginTop: 10, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#3d3b55', borderRadius: 8, paddingHorizontal: 11, paddingVertical: 5 },
  delBtnText: { fontSize: 11, color: C.muted },
  empty:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText:{ fontSize: 14, color: C.muted },
});
