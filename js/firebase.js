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

// Guarda contacto en la colección 'respuestas'
export const saveContact = async (nombre, motivo, mensaje) => {
  try {
    const respuestasRef = ref(db, "respuestas");
    const nuevaRespuestaRef = push(respuestasRef);

    await set(nuevaRespuestaRef, {
      nombre,
      motivo,
      mensaje,
      fecha: new Date().toISOString()
    });

    return { success: true, message: "Datos guardados correctamente." };
  } catch (error) {
    return { success: false, message: `Error al guardar los datos: ${error.message}` };
  }
};

// Obtener contactos desde la colección 'respuestas'
export const getContact = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "respuestas"));

    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: false, message: "No se encontraron datos." };
    }
  } catch (error) {
    return { success: false, message: `Error al obtener los datos: ${error.message}` };
  }
};
