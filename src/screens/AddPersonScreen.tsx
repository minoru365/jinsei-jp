// src/screens/AddPersonScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { C } from '../utils/colors';
import { Person } from '../utils/storage';
import { Sex } from '../utils/events';

interface Props {
  onAdd:    (p: Person) => void;
  onCancel: () => void;
}

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male',    label: '男の子 👦' },
  { value: 'female',  label: '女の子 👧' },
  { value: 'unknown', label: '未設定' },
];

export default function AddPersonScreen({ onAdd, onCancel }: Props) {
  const [name, setName] = useState('');
  const [dob,  setDob]  = useState(new Date());
  const [sex,  setSex]  = useState<Sex>('unknown');
  const [showPicker, setShowPicker] = useState(false);

  const dobStr = `${dob.getFullYear()}年${dob.getMonth() + 1}月${dob.getDate()}日`;

  const handleAdd = () => {
    if (!name.trim()) return;
    const iso = dob.toISOString().split('T')[0];
    onAdd({ id: Date.now().toString(), name: name.trim(), dob: iso, sex });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>✨ 新しい人を追加</Text>

        <Text style={styles.label}>お名前</Text>
        <TextInput
          style={styles.input}
          placeholder="例：田中 みのる"
          placeholderTextColor={C.muted}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>生年月日</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateBtnText}>{dobStr}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, d) => { setShowPicker(false); if (d) setDob(d); }}
            locale="ja"
          />
        )}

        <Text style={styles.label}>性別</Text>
        <View style={styles.segRow}>
          {SEX_OPTIONS.map(o => (
            <TouchableOpacity
              key={o.value}
              style={[styles.seg, sex === o.value && styles.segActive]}
              onPress={() => setSex(o.value)}
            >
              <Text style={[styles.segText, sex === o.value && styles.segTextActive]}>{o.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.mainBtn, !name.trim() && styles.mainBtnDisabled]} onPress={handleAdd} disabled={!name.trim()}>
          <Text style={styles.mainBtnText}>追加する</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subBtn} onPress={onCancel}>
          <Text style={styles.subBtnText}>キャンセル</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14 },
  card: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 18 },
  title: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase', marginBottom: 18 },
  label: { fontSize: 12, color: C.muted, marginBottom: 6 },
  input: {
    backgroundColor: C.pill, borderWidth: 1, borderColor: C.border, borderRadius: 12,
    padding: 13, fontSize: 16, color: C.text, marginBottom: 14,
  },
  dateBtn: {
    backgroundColor: C.pill, borderWidth: 1, borderColor: C.border, borderRadius: 12,
    padding: 13, marginBottom: 14,
  },
  dateBtnText: { fontSize: 16, color: C.text },
  segRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  seg: {
    flex: 1, paddingVertical: 11, borderRadius: 12,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.pill, alignItems: 'center',
  },
  segActive: { borderColor: C.yellow, backgroundColor: 'rgba(232,197,71,0.15)' },
  segText:       { fontSize: 13, color: C.muted, fontWeight: '500' },
  segTextActive: { fontSize: 13, color: C.yellow, fontWeight: '700' },
  mainBtn: { backgroundColor: C.yellow, borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 8 },
  mainBtnDisabled: { opacity: 0.5 },
  mainBtnText: { fontSize: 15, fontWeight: '800', color: '#0f0e17' },
  subBtn: { backgroundColor: C.pill, borderRadius: 12, padding: 14, alignItems: 'center' },
  subBtnText: { fontSize: 15, fontWeight: '700', color: C.muted },
});
