'use strict';

import { fetchFakerData } from './functions.js';
import { saveContact, getContact } from './firebase.js';

// Cargar datos desde Faker API
const loadData = async () => {
  const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

  try {
    const result = await fetchFakerData(url);
    if (result.success) {
      console.log('Datos obtenidos con éxito:', result.body);
    } else {
      console.error('Error al obtener los datos:', result.error);
    }
  } catch (error) {
    console.error('Ocurrió un error inesperado:', error);
  }
};

// Mostrar tabla de motivos guardados
const displayContact = async () => {
  const container = document.getElementById("results");
  if (!container) return;

  const result = await getContact();

  if (!result.success) {
    container.innerHTML = `<p class="text-red-500">${result.message}</p>`;
    return;
  }

  const data = result.data;
  const entries = Object.values(data);

  if (entries.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No hay contactos registrados.</p>`;
    return;
  }

  // Crear tabla
  const table = document.createElement("table");
    table.className = "w-full border-b-2 border-yellow-950 rounded-lg overflow-hidden bg-white";

    table.innerHTML = `
    <thead>
        <tr>
        <th class="py-2 px-4 text-left font-bold text-amber-900 border border--400">Persona</th>
        <th class="py-2 px-4 text-left font-bold text-amber-900 border border-orange-400">Motivo</th>
        </tr>
    </thead>
    <tbody>
      ${entries.map((item, index) => `
        <tr>
          <td class="py-2 px-4 border border-orange-400 text-amber-900">Persona ${index + 1}</td>
          <td class="py-2 px-4 capitalize border border-orange-400 text-amber-900"">${item.motivo}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  container.innerHTML = ""; // limpiar
  container.appendChild(table);
};

// Manejar el formulario de contacto
const enableForm = () => {
  const form = document.getElementById('formulario-contacto');

  if (!form) {
    console.warn("No se encontró el formulario con id 'formulario-contacto'.");
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = form.nombre.value.trim();
    const motivo = form.motivo.value.trim();
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !motivo || !mensaje) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const result = await saveContact(nombre, motivo, mensaje);

    if (result.success) {
      alert("Mensaje enviado correctamente.");
      form.reset();
      await displayContact(); // 🔁 mostrar tabla actualizada
    } else {
      alert("Error al enviar el mensaje: " + result.message);
    }
  });
};

// Autoejecución
(() => {
  loadData();
  enableForm();
  displayContact(); // mostrar tabla al cargar
})();
