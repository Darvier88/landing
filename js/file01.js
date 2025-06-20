'use strict';

import { fetchFakerData } from './functions.js';
import { saveContact, getContact } from './firebase.js';

// Elementos del DOM
const formularioContacto = document.getElementById('formulario-contacto');
const tablaContactos = document.getElementById('tabla-contactos');
const btnModalExito = document.getElementById('abrir-modal-exito');

// Generar datos de ejemplo
const loadData = async () => {
  const ejemplos = {
    "-N1": {
      nombre: "Juan Pérez",
      motivo: "cotizacion",
      mensaje: "Necesito precios para tablas de encofrado",
      telefono: "099 234 5678",
      fecha: "2025-06-18T10:30:00.000Z"
    },
    "-N2": {
      nombre: "María López",
      motivo: "pedido",
      mensaje: "Requiero 100 tablones SD para un proyecto",
      telefono: "098 765 4321",
      fecha: "2025-06-19T09:15:00.000Z"
    },
    "-N3": {
      nombre: "Carlos González",
      motivo: "consulta",
      mensaje: "¿Tienen disponibilidad de vigas de 6 metros?",
      telefono: "097 123 4567",
      fecha: "2025-06-19T11:45:00.000Z"
    },
    "-N4": {
      nombre: "Ana Martínez",
      motivo: "cotizacion",
      mensaje: "Precio por mayor para cuartones D 5x5",
      telefono: "096 987 6543",
      fecha: "2025-06-19T14:20:00.000Z"
    },
    "-N5": {
      nombre: "Roberto Silva",
      motivo: "pedido",
      mensaje: "Necesito tablas duras para un proyecto urgente",
      telefono: "095 345 6789",
      fecha: "2025-06-19T15:30:00.000Z"
    }
  };

  return {
    success: true,
    data: ejemplos
  };
};

// Mostrar tabla de contactos
const displayContact = async () => {
  // Primero intentamos obtener datos reales de Firebase
  const resultado = await getContact();
    
  if (resultado.success && resultado.data) {
      mostrarContactos(resultado.data);
  } else {
      // Si no hay datos reales, usamos datos de ejemplo
      const datosEjemplo = await loadData();
      if (datosEjemplo.success) {
          mostrarContactos(datosEjemplo.data);
      }
  }
};

// Función para mostrar los contactos en la tabla (sin paginación)
function mostrarContactos(datos) {
    const tbody = document.getElementById('tabla-contactos');
    if (!tbody) return;
    tbody.innerHTML = '';
    Object.keys(datos).forEach((key, index) => {
        const contacto = datos[key];
        const fila = document.createElement('tr');
        fila.className = 'hover:bg-yellow-50 transition-colors group border-b border-yellow-100';
        fila.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                    <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span class="font-heading text-yellow-900 group-hover:text-amber-600 transition-colors">Persona ${index + 1}</span>
                </div>
            </td>
            <td class="py-4 px-6 font-heading text-yellow-900 group-hover:text-amber-600 transition-colors capitalize">${contacto.motivo}</td>
        `;
        tbody.appendChild(fila);
    });
}

// Manejar el formulario de contacto
const enableForm = () => {
  const form = document.getElementById('formulario-contacto');
  const btnModalExito = document.getElementById('abrir-modal-exito');

  if (!form) {
    console.warn("No se encontró el formulario con id 'formulario-contacto'.");
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const contactoData = {
        nombre: formData.get('nombre'),
        motivo: formData.get('motivo'),
        mensaje: formData.get('mensaje'),
        telefono: formData.get('telefono') || 'No proporcionado'
    };
    const phone = contactoData.telefono;

    if (!contactoData.nombre || !contactoData.motivo || !contactoData.mensaje || !contactoData.telefono) {
        alert("Por favor completa todos los campos requeridos, incluyendo el teléfono.");
        return;
    }

    const cleanedPhone = phone.replace(/[\s-]/g, '');

// Verifica que el número tenga exactamente 10 dígitos numéricos
if (cleanedPhone.length !== 10 || isNaN(cleanedPhone)) {
    alert("Por favor ingresa un número de teléfono válido (Ej: 099 999 9999)");
    return;
}

// Verifica que el número empieza con un valor adecuado (Ej: 099, 098, etc.)
const validStartingDigits = ['099', '098', '097', '096']; // Puedes añadir más prefijos válidos si lo deseas
const startsWithValidPrefix = validStartingDigits.some(prefix => cleanedPhone.startsWith(prefix));

if (!startsWithValidPrefix) {
    alert("Por favor ingresa un número de teléfono válido (Ej: 099 999 9999)");
    return;
}
    const resultado = await saveContact(
        contactoData.nombre,
        contactoData.motivo,
        contactoData.mensaje,
        contactoData.telefono
    );

    if (resultado.success) {
        // Mostrar modal de éxito
        btnModalExito.click();
        
        // Limpiar formulario
        form.reset();
        
        // Recargar contactos
        await displayContact();
    } else {
        alert('Error al enviar el mensaje: ' + resultado.message);
    }
  });
};

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
    enableForm();
    displayContact();
});
(() => {
  loadData();
  enableForm();
  displayContact(); // mostrar tabla al cargar
})();
