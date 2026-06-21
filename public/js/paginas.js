/**
 * paginas.js — Páginas informativas del footer  ·  TAREA LEONARDO #3
 * ----------------------------------------------------------------------
 * El router ya te llama solo: #/despacho, #/garantia, #/medios-pago y #/nosotros
 * ejecutan Paginas.render('despacho'|...). Vos trabajás SOLO en este archivo
 * (y estilos en css/leo.css). No toques index.html, router.js ni catalogo.js.
 *
 * Tu tarea: completar/mejorar el texto y el diseño de cada página con info real
 * de QuadCore (tienda de electrónica en Chile). Es HTML puro, sin lógica.
 * Para agregar una página nueva: sumá una entrada acá y avisanos para enlazarla.
 */
const Paginas = {
    contenido: {
        despacho: {
            titulo: 'Despacho y cobertura',
            html: `<p>Realizamos envíos a todo Chile.</p>
                   <ul>
                     <li>Despacho gratis en compras sobre $50.000.</li>
                     <li>Región Metropolitana: 2–3 días hábiles.</li>
                     <li>Regiones: 3–6 días hábiles según destino.</li>
                     <li>Retiro en tienda: Av. Providencia 1234, Santiago.</li>
                   </ul>`
        },
        garantia: {
            titulo: 'Garantía y devoluciones',
            html: `<p>Todos nuestros productos cuentan con garantía oficial de 12 meses.</p>
                   <ul>
                     <li>Cambios y devoluciones dentro de los primeros 10 días.</li>
                     <li>El producto debe estar en su empaque original.</li>
                     <li>La garantía no cubre daños por mal uso.</li>
                   </ul>`
        },
        'medios-pago': {
            titulo: 'Medios de pago',
            html: `<p>Aceptamos múltiples formas de pago:</p>
                   <ul>
                     <li>Tarjetas de crédito y débito (Webpay).</li>
                     <li>Transferencia bancaria.</li>
                     <li>Hasta 3 cuotas sin interés en compras seleccionadas.</li>
                   </ul>`
        },
        nosotros: {
            titulo: 'Quiénes somos',
            html: `<p>QuadCore SpA — <em>El Corazón de la Electrónica</em>.</p>
                   <p>Somos una tienda chilena especializada en componentes, accesorios,
                   herramientas y servicio técnico para PC. (Completar con la historia real.)</p>`
        }
    },

    render(slug) {
        const view = document.getElementById('view-generic');
        if (!view) return;
        const pag = this.contenido[slug];
        if (!pag) {
            view.innerHTML = '<div class="empty-state"><h5>Página no encontrada</h5></div>';
            return;
        }
        view.innerHTML = `
            <div class="leo-pagina">
                <h2 class="qc-similares-title">${pag.titulo}</h2>
                <div class="leo-pagina-body">${pag.html}</div>
            </div>`;
    }
};
