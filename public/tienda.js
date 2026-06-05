// 1. Inicializar EmailJS
emailjs.init("TU_PUBLIC_KEY");

function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const direccion = document.getElementById('input-direccion-final').value;
    const emailCliente = document.getElementById('input-email-cliente').value;
    const total = document.getElementById('total-final').innerText;
    const metodo = document.getElementById('metodo-envio').options[document.getElementById('metodo-envio').selectedIndex].text;

    if (!emailCliente) {
        alert("Por favor, ingresa un correo electrónico.");
        return;
    }

    // 2. Preparar datos para EmailJS
    const templateParams = {
        nombre: "Cliente RDMARKET",
        id_pedido: Date.now().toString().slice(-6),
        total: total,
        direccion: direccion,
        metodo_envio: metodo,
        email_destino: emailCliente
    };

    // 3. Enviar correo
    emailjs.send("SERVICE_ID", "TEMPLATE_ID", templateParams)
        .then(function(response) {
            alert("¡Pedido realizado con éxito! Revisa tu correo.");
            
            // Guardar orden localmente para tu control administrativo
            const ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
            ordenes.push({ ...templateParams, fecha: new Date().toLocaleString() });
            localStorage.setItem('ordenes', JSON.stringify(ordenes));

            localStorage.removeItem('carrito');
            location.reload();
        }, function(error) {
            alert("Error al enviar el correo: " + JSON.stringify(error));
        });
}