// ============================================
// 🔥 CONFIGURACIÓN DE FIREBASE
// ============================================
// Este archivo conecta tu HTML con Firebase
// Solo necesitas configurarlo UNA VEZ

// 1️⃣ Importar las funciones de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// 2️⃣ Tu configuración de Firebase (obtenida desde Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBKsyCZ373L7p5aApwq1S8jT7t0loY31CU",
  authDomain: "fir-f7d83.firebaseapp.com",
  projectId: "fir-f7d83",
  storageBucket: "fir-f7d83.firebasestorage.app",
  messagingSenderId: "626511316609",
  appId: "1:626511316609:web:cbab33323127a7d7522f80",
  measurementId: "G-3RCSZ392S4"
};

// 3️⃣ Inicializar Firebase con tu configuración
const app = initializeApp(firebaseConfig);

// 4️⃣ Obtener servicios de Firebase
const analytics = getAnalytics(app); // Para estadísticas (opcional)
const db = getFirestore(app); // Para la base de datos Firestore

// 5️⃣ Exportar para usar en otros archivos JavaScript
export { app, analytics, db };