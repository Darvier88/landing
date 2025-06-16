'use strict';

import { fetchFakerData } from './functions.js';
import { saveVote, getVotes } from './firebase.js'; // ✅ Importar también getVotes

// Función para cargar datos desde Faker API
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

// ✅ Función para obtener y mostrar los votos en una tabla
const displayVotes = async () => {
    const table = document.getElementById('votes_table');

    if (!table) {
        console.warn("No se encontró la tabla con id 'votes_table'.");
        return;
    }

    // Limpia todas las filas excepto el encabezado
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    try {
        const result = await getVotes();

        if (!result.success) {
            console.error("Error al obtener votos:", result.message);
            return;
        }

        const data = Object.values(result.data);

        // Agrupar votos por producto
        const resumen = {};

        data.forEach(vote => {
            const product = vote.productName || vote.productID || 'Desconocido';
            resumen[product] = (resumen[product] || 0) + 1;
        });

        // Insertar una fila por cada producto
        Object.entries(resumen).forEach(([product, total]) => {
            const row = table.insertRow();
            const productCell = row.insertCell(0);
            const totalCell = row.insertCell(1);

            productCell.textContent = product;
            totalCell.textContent = total;
        });

    } catch (error) {
        console.error("Error al obtener los votos:", error);
    }
};

// ✅ Nueva función: interacción con formulario
const enableForm = () => {
    const form = document.getElementById('form_voting');

    if (!form) {
        console.warn("No se encontró el formulario con id 'form_voting'.");
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene recarga

        const select = document.getElementById('select_product');
        const productID = select?.value;

        if (!productID) {
            alert("Selecciona un producto.");
            return;
        }

        const result = await saveVote(productID); // Llama a Firebase

        if (result.success) {
            alert(result.message);
            await displayVotes(); // 🔁 Actualiza la tabla después de guardar el voto
        } else {
            alert("Error al guardar el voto: " + result.message);
        }

        form.reset(); // Limpia el formulario
    });
};


// Función de autoejecución
(() => {
    loadData();
    enableForm();
    displayVotes(); // 🔁 Mostrar votos al iniciar
})();
