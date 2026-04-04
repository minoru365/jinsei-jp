// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sex } from './events';

export interface Person {
  id:   string;
  name: string;
  dob:  string; // ISO date string "YYYY-MM-DD"
  sex:  Sex;
}

const KEY = 'jinsei_people';

export async function loadPeople(): Promise<Person[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function savePeople(people: Person[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(people));
  } catch {
    // ignore
  }
}
