/**
 * contacto.js — Vista de Contacto (#/contacto)  ·  TAREA LEONARDO #2
 * ----------------------------------------------------------------------
 * El router ya te llama solo: cuando alguien entra a #/contacto se ejecuta
 * Contacto.render(). Vos trabajás SOLO en este archivo (y estilos en css/leo.css).
 * No toques index.html, router.js ni catalogo.js.
 *
 * Esta es una versión mínima que ya funciona. Tu tarea: dejarla linda y completa
 * según el diseño QuadCore (rojo #F74F3C, fuentes Poppins/Inter, ver style.css).
 * Ideas: mapa, horarios, mejores íconos, validación, datos de la tienda.
 *
 * El form por ahora solo muestra un toast (no hay backend de contacto, está fuera
 * de alcance). Con eso alcanza para la entrega.
 */
const Contacto = {
    render() {
        const view = document.getElementById('view-generic');
        if (!view) return;
        view.innerHTML = `
            <div class="leo-contacto">
                <h2 class="qc-similares-title">Contáctanos</h2>
                <p class="text-muted">¿Tienes dudas sobre un producto o servicio técnico? Escríbenos.</p>

                <div class="row g-4">
                    <div class="col-md-6">
                        <form id="contacto-form" class="leo-contacto-form">
                            <input class="form-control mb-2" id="c-nombre" placeholder="Nombre" required>
                            <input class="form-control mb-2" id="c-email" type="email" placeholder="Email" required>
                            <textarea class="form-control mb-2" id="c-msg" rows="4" placeholder="Mensaje" required></textarea>
                            <button class="btn btn-accent" type="submit">Enviar mensaje</button>
                        </form>
                    </div>
                    <div class="col-md-6 leo-contacto-info">
                        <p><i class="bi bi-geo-alt"></i> Av. Providencia 1234, Santiago, Chile</p>
                        <p><i class="bi bi-telephone"></i> +56 2 2123 4567</p>
                        <p><i class="bi bi-envelope"></i> contacto@quadcore.cl</p>
                        <p><i class="bi bi-clock"></i> Lun a Vie 9–19h · Sáb 10–14h</p>
                    </div>
                </div>
            </div>`;

        document.getElementById('contacto-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            App.showToast('¡Gracias! Te responderemos pronto.', 'success');
            e.target.reset();
        });
    }
};
