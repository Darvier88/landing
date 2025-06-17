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

// guardar datos del formulario de contacto
export const saveContact = async (nombre, motivo, mensaje) => {
  try {
    console.log("Guardando contacto en Firebase:", { nombre, motivo, mensaje }); // 👈

    const contactosRef = ref(db, "contactos");
    const newContactRef = push(contactosRef);

    await set(newContactRef, {
      nombre,
      motivo,
      mensaje,
      fecha: new Date().toISOString()
    });

    return { success: true, message: "Mensaje enviado correctamente." };
  } catch (error) {
    return { success: false, message: `Error al enviar el mensaje: ${error.message}` };
  }
};




