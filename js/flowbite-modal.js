// Script para mostrar un modal de confirmación antes de enviar el formulario de contacto

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario-contacto');
  const datosConfirmacion = document.getElementById('datos-confirmacion');
  const btnConfirmar = document.getElementById('btn-confirmar-envio');
  const btnAbrirConfirm = document.getElementById('abrir-modal-confirmacion');
  const btnAbrirExito = document.getElementById('abrir-modal-exito');

  if (!form || !datosConfirmacion || !btnConfirmar || !btnAbrirConfirm || !btnAbrirExito) return;

  // Al enviar el formulario, muestra el modal de confirmación
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtén los datos del formulario
    const datosForm = {
      nombre: document.getElementById('nombre').value,
      motivo: document.getElementById('motivo').options[document.getElementById('motivo').selectedIndex].text,
      mensaje: document.getElementById('mensaje').value
    };

    // Muestra los datos en el modal
    datosConfirmacion.innerHTML = `
      <div class="mb-2"><span class="font-bold">Nombre:</span> ${datosForm.nombre}</div>
      <div class="mb-2"><span class="font-bold">Motivo:</span> ${datosForm.motivo}</div>
      <div class="mb-2"><span class="font-bold">Mensaje:</span> ${datosForm.mensaje}</div>
    `;

    // Abre el modal de confirmación usando el botón oculto
    btnAbrirConfirm.click();
  });

  // Al confirmar, cierra el modal (Flowbite lo hace por el atributo) y muestra el de éxito
  btnConfirmar.addEventListener('click', function () {
    btnAbrirExito.click();
    form.reset();
  });
});