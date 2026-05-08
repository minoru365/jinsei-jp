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
import AddPersonScreen from '../src/screens/AddPersonScreen';
import HomeScreen from '../src/screens/HomeScreen';

function parseDob(dob: string): Date {
  const [y, m, d] = dob.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function computeAge(dob: string): number {
  const d = parseDob(dob);
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
  const [loaded,   setLoaded]   = useState(false);
  const [homeMode, setHomeMode] = useState(true);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

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
    setHomeMode(false);
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
  const events = active ? buildAllEvents(parseDob(active.dob), active.sex) : [];
  const age    = active ? computeAge(active.dob) : 0;
  const info   = active ? (() => {
    const d = parseDob(active.dob);
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

      {/* 人物タブバー */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.homeTabBtn} onPress={() => { setHomeMode(true); setAdding(false); }}>
          <Text style={styles.homeTabBtnText}>🏠</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabContent}>
          {people.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.tab, p.id === activeId && !homeMode && !adding && styles.tabActive]}
              onPress={() => { setActiveId(p.id); setHomeMode(false); setAdding(false); }}
            >
              <Text style={[styles.tabText, p.id === activeId && !homeMode && !adding && styles.tabTextActive]}>
                {sexIcon(p.sex)} {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addTabBtn} onPress={() => setAdding(true)}>
          <Text style={styles.addTabBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      {adding ? (
        <AddPersonScreen onAdd={handleAdd} onCancel={() => setAdding(false)} />
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
          {/* ヒーローカード */}
          <View style={styles.heroBox}>
            <View style={styles.heroTopRow}>
              <Text style={styles.heroName}>{sexIcon(active.sex)} {active.name}</Text>
              <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(active.id)}>
                <Text style={styles.delBtnText}>🗑 削除</Text>
              </TouchableOpacity>
            </View>
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
          </View>

          {/* コンテンツ */}
          <EventsScreen dob={active.dob} events={events} age={age} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  flex:    { flex: 1 },
  tabRow:    { flexDirection: 'row', alignItems: 'center', maxHeight: 50 },
  tabBar:    { flex: 1 },
  tabContent: { alignItems: 'center', paddingLeft: 14, gap: 8, paddingTop: 8, paddingBottom: 6 },
  tab:         { paddingHorizontal: 15, paddingVertical: 7, borderRadius: 20, backgroundColor: C.pill },
  tabActive:   { backgroundColor: C.yellow },
  tabText:     { fontSize: 13, color: C.muted, fontWeight: '500' },
  tabTextActive: { color: '#0f0e17', fontWeight: '700' },
  homeTabBtn:   { marginLeft: 14, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border },
  homeTabBtnText: { fontSize: 18, lineHeight: 22 },
  addTabBtn:   { marginRight: 14, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border },
  addTabBtnText: { fontSize: 18, color: C.muted, lineHeight: 22 },
  heroBox: { marginHorizontal: 14, marginTop: 8, marginBottom: 0, backgroundColor: '#1e1c35', borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 16 },
  heroTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 },
  heroName: { flex: 1, fontSize: 22, fontWeight: '900', color: C.text, letterSpacing: -0.5 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  badge:    { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:{ fontSize: 11, fontWeight: '700', color: '#0f0e17' },
  pillRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill:     { backgroundColor: C.pill, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  pillText: { fontSize: 12, color: C.text },
  delBtn:   { borderWidth: 1, borderColor: '#3d3b55', borderRadius: 8, paddingHorizontal: 11, paddingVertical: 5 },
  delBtnText: { fontSize: 11, color: C.muted },
});
