// src/storageService.ts
import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (filePath: string, file: File) => {
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
