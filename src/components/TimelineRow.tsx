// src/components/TimelineRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../utils/colors';
import { LifeEvent } from '../utils/events';

interface Props {
  ev: LifeEvent;
  currentYear: number;
}

export default function TimelineRow({ ev, currentYear }: Props) {
  const past = ev.year <= currentYear;
  return (
    <View style={styles.row}>
      <Text style={styles.tag}>{ev.tag}</Text>
      <View style={[styles.dot, { backgroundColor: past ? C.green : ev.color }]} />
      <View style={styles.body}>
        <Text style={styles.label}>{ev.label}</Text>
        <Text style={styles.note}>{ev.note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 10,
  },
  tag: {
    width: 22,
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  body: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  note: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },
});
