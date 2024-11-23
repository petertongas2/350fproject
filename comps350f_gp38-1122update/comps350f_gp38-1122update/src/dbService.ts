// src/dbService.ts
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

export const addData = async (collectionName: string, data: any) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

export const getData = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateData = async (collectionName: string, docId: string, data: any) => {
  const docRef = doc(db, collectionName, docId);
  return await setDoc(docRef, data, { merge: true });
};
