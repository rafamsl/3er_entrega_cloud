const socket = io.connect();

function enviarMensaje() {
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");

  if (!email.value || !mensaje.value) {
    alert("Debe completar los campos");
    return false;
  }

  socket.emit("mensajeNuevo", { author: email.value, text: mensaje.value });
  mensaje.value = "";
  return false;
}

socket.on("mensajes", (mensajes) => {
  console.log("socket in mensajes")
  let mensajesHtml = mensajes
    .map(
      (mensaje) =>
        `<span>${mensaje.timestamp}<b> ${mensaje.email}: </b>${mensaje.text}</span>`
    )
    .join("<br>");

  document.getElementById("listaMensajes").innerHTML = mensajesHtml;
});
