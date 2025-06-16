// Importa funciones necesarias de Firebase (v11.9.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Configuración desde variables de entorno (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Función para guardar votos
export const saveVote = async (productID) => {
  try {
    const votesRef = ref(db, "votes");
    const newVoteRef = push(votesRef);

    await set(newVoteRef, {
      productID: productID,
      date: new Date().toISOString()
    });

    return { success: true, message: "Voto registrado correctamente." };
  } catch (error) {
    return { success: false, message: `Error al guardar el voto: ${error.message}` };
  }
};

// ✅ Nueva función: obtener votos
export const getVotes = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "votes"));

    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: false, message: "No hay votos registrados." };
    }
  } catch (error) {
    return { success: false, message: `Error al obtener votos: ${error.message}` };
  }
};

