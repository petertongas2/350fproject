// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 使用你的 Firebase 專案配置值替換這些字段
const firebaseConfig = {
  apiKey: "AIzaSyBodR2udW8SFcQY3agswpZ5VxPh7X05bnk",
  authDomain: "comp350f-group-project.firebaseapp.com",
  projectId: "comp350f-group-project",
  storageBucket: "comp350f-group-project.firebasestorage.app",
  messagingSenderId: "879760921424",
  appId: "1:879760921424:web:6e8ee60e1e26c94ad75255",
  measurementId: "G-STKCG9KDDF"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出 Firebase 服務
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
