'use strict';

import { fetchFakerData } from './functions.js';
import { saveVote, getVotes, saveContact } from './firebase.js'; // ✅ Importar también getVotes

// cargar datos desde Faker API
const loadData = async () => {
    const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

    try {
        const result = await fetchFakerData(url);

        if (result.success) {
            console.log('Datos obtenidos con éxito:', result.body);
            // Aquí podrías usar renderCards(result.body.data); si la tienes definida
        } else {
            console.error('Error al obtener los datos:', result.error);
        }

    } catch (error) {
        console.error('Ocurrió un error inesperado:', error);
    }
};


// función para manejar el formulario de contacto
const enableContactForm = () => {
    const form = document.getElementById('formulario-contacto');

    if (!form) {
        console.warn("No se encontró el formulario con id 'formulario-contacto'.");
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = form.nombre.value.trim();
        const motivo = form.motivo.value;
        const mensaje = form.mensaje.value.trim();

        console.log("Datos que se enviarán:", { nombre, motivo, mensaje }); 

        if (!nombre || !motivo || !mensaje) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const result = await saveContact(nombre, motivo, mensaje);

        if (result.success) {
            // Si tienes un modal, puedes usar esto para mostrarlo:
            document.getElementById("abrir-modal-exito").click();
            form.reset();
        } else {
            alert("Error al enviar el mensaje: " + result.message);
        }
    });
};


// Función de autoejecución
(() => {
    loadData();
    enableContactForm(); // activas el formulario de contacto
})();

