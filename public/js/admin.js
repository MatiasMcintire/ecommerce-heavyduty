/**
 * admin.js - Panel de administración
 * Dashboard, CRUD productos, gestión de pedidos y reportes
 */

const Admin = {
    currentSection: 'dashboard',

    /**
     * Abre el panel admin como página de la SPA (#/admin).
     * Inyecta el shell (sidebar + contenido) en view-generic y gatea por rol.
     */
    openPage() {
        const view = document.getElementById('view-generic');
        if (!view) return;
        if (!App.user || App.user.rol !== 'admin') {
            view.innerHTML = `<div class="empty-state"><i class="bi bi-shield-lock"></i>
                <h5>Acceso restringido</h5><p class="text-muted">Esta sección es solo para administradores.</p>
                <a href="#/" class="btn btn-outline-uct btn-sm mt-2">Volver al inicio</a></div>`;
            return;
        }
        view.innerHTML = `
            <div class="admin-layout">
                <aside class="admin-sidebar">
                    <h6 class="admin-sidebar-title">Panel admin</h6>
                    <a class="admin-nav-link active" data-section="dashboard"><i class="bi bi-speedometer2"></i> Dashboard</a>
                    <a class="admin-nav-link" data-section="productos"><i class="bi bi-box-seam"></i> Productos</a>
                    <a class="admin-nav-link" data-section="pedidos"><i class="bi bi-bag"></i> Pedidos</a>
                    <a class="admin-nav-link" data-section="usuarios"><i class="bi bi-people"></i> Usuarios</a>
                    <a class="admin-nav-link" data-section="reportes"><i class="bi bi-graph-up"></i> Reportes</a>
                </aside>
                <div class="admin-main" id="admin-content"></div>
            </div>`;
        this.currentSection = 'dashboard';
        this.initNavigation();
        this.loadDashboard();
    },

    /**
     * Configura navegación del sidebar
     */
    initNavigation() {
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.loadSection(section);

                // Actualizar clase active
                document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    },

    /**
     * Carga una sección del panel
     */
    async loadSection(section) {
        this.currentSection = section;
        const container = document.getElementById('admin-content');
        if (!container) return;

        App.showLoading();

        switch (section) {
            case 'dashboard': await this.loadDashboard(); break;
            case 'productos': await this.loadProductos(); break;
            case 'pedidos': await this.loadPedidos(); break;
            case 'usuarios': await this.loadUsuarios(); break;
            case 'reportes': await this.loadReportes(); break;
            default: await this.loadDashboard();
        }

        App.hideLoading();
    },

    /**
     * Carga el dashboard con métricas
     */
    async loadDashboard() {
        const container = document.getElementById('admin-content');
        if (!container) return;

        try {
            const resp = await App.fetchAuth(`${App.apiBase}/admin/dashboard`);
            const data = await resp.json();

            if (!data.success) throw new Error('Error');

            const d = data.data;

            // Tarjeta de métrica (estilo Mantis adaptado a QuadCore). Sin % de
            // tendencia: no tenemos histórico, así que el subtexto es un dato real.
            const stat = (label, value, sub, icon, variant = '') => `
                <div class="qc-stat ${variant}">
                    <div class="qc-stat-top">
                        <span class="qc-stat-label">${label}</span>
                        <span class="qc-stat-icon"><i class="bi ${icon}"></i></span>
                    </div>
                    <div class="qc-stat-value">${value}</div>
                    <div class="qc-stat-sub">${sub}</div>
                </div>`;

            const agotados = d.productos_agotados || 0;
            const rows = (d.ultimos_pedidos || []).map(p => `
                <tr>
                    <td class="fw-bold">${ordenNumero(p.id, p.created_at)}</td>
                    <td>${this.escapeHtml(p.cliente_nombre)} ${this.escapeHtml(p.apellido || '')}</td>
                    <td class="text-primary fw-bold">${p.total_formateado}</td>
                    <td>${badgeEstado(p.estado)}</td>
                </tr>`).join('');

            const stock = (d.alertas_stock && d.alertas_stock.length)
                ? d.alertas_stock.map(a => `
                    <div class="admin-stock-item">
                        <span class="text-truncate">${this.escapeHtml(a.nombre)}</span>
                        <span class="pedido-badge danger"><span class="pedido-dot"></span>${a.stock} u.</span>
                    </div>`).join('')
                : '<p class="text-success mb-0"><i class="bi bi-check-circle"></i> Stock al día.</p>';

            container.innerHTML = `
                <h1 class="admin-page-title">Dashboard</h1>
                <div class="qc-stats-grid">
                    ${stat('Ventas del mes', d.total_ventas_mes?.total_ventas_formateado || '$0', `${d.total_ventas_mes?.total_pedidos || 0} pedidos pagados`, 'bi-graph-up-arrow', 'accent')}
                    ${stat('Pedidos totales', d.total_pedidos, `${d.pedidos_pendientes || 0} pendiente${d.pedidos_pendientes === 1 ? '' : 's'}`, 'bi-bag-check', '')}
                    ${stat('Productos', d.total_productos, agotados > 0 ? `${agotados} agotado${agotados === 1 ? '' : 's'}` : 'Catálogo activo', 'bi-box-seam', agotados > 0 ? 'warn' : '')}
                    ${stat('Usuarios', d.total_usuarios, 'Registrados', 'bi-people', '')}
                </div>

                <div class="row g-4 mt-1">
                    <div class="col-lg-8">
                        <div class="cart-table-card">
                            <div class="admin-card-head">
                                <h6>Pedidos recientes</h6>
                                <a href="#" class="pedido-ver admin-goto">Ver todos <i class="bi bi-chevron-right"></i></a>
                            </div>
                            <table class="cart-table">
                                <thead><tr><th>Orden</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
                                <tbody>${rows || '<tr><td colspan="4" class="text-center text-muted py-4">Sin pedidos.</td></tr>'}</tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="cart-summary-card" style="position:static">
                            <h6 class="cart-summary-title">Alertas de stock</h6>
                            ${stock}
                        </div>
                    </div>
                </div>`;

            // "Ver todos" → dispara la sección de pedidos reusando la nav del sidebar
            container.querySelector('.admin-goto')?.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.admin-nav-link[data-section="pedidos"]')?.click();
            });
        } catch (e) {
            container.innerHTML = '<div class="alert alert-danger">Error al cargar dashboard.</div>';
        }
    },

    /**
     * Carga gestión de productos (CRUD)
     */
    async loadProductos(page = 1) {
        const container = document.getElementById('admin-content');
        if (!container) return;

        try {
            const resp = await App.fetchAuth(`${App.apiBase}/admin/productos?pagina=${page}&por_pagina=15`);
            const data = await resp.json();

            if (!data.success) throw new Error('Error');

            const productos = data.data;
            const pag = data.meta?.pagination;

            let html = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4>Gestión de Productos</h4>
                    <button class="btn btn-accent" id="btn-new-product" onclick="Admin.showProductForm()">
                        <i class="bi bi-plus-lg"></i> Nuevo Producto
                    </button>
                </div>`;

            if (productos && productos.length > 0) {
                html += `<div class="table-responsive">
                    <table class="table table-admin table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productos.map(p => `
                                <tr>
                                    <td>${p.id}</td>
                                    <td><img src="${p.imagen_url || 'https://via.placeholder.com/40'}" width="40" height="40" style="object-fit:cover;border-radius:4px" onerror="this.src='https://via.placeholder.com/40'"></td>
                                    <td>${this.escapeHtml(p.nombre)}</td>
                                    <td>${this.escapeHtml(p.categoria_nombre || '-')}</td>
                                    <td>${p.precio_formateado || App.formatPrice(p.precio)}</td>
                                    <td>
                                        <span class="badge ${p.stock <= 0 ? 'bg-danger' : p.stock <= (p.stock_minimo || 5) ? 'bg-warning text-dark' : 'bg-success'}">
                                            ${p.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge ${p.activo == 1 ? 'bg-success' : 'bg-secondary'}">
                                            ${p.activo == 1 ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary btn-action me-1" onclick="Admin.showProductForm(${p.id})" title="Editar">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger btn-action" onclick="Admin.deleteProduct(${p.id})" title="Eliminar">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`;

                // Paginación
                if (pag && pag.total_pages > 1) {
                    html += `<nav><ul class="pagination justify-content-center">`;
                    for (let i = 1; i <= pag.total_pages; i++) {
                        html += `<li class="page-item ${i === page ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="Admin.loadProductos(${i});return false">${i}</a></li>`;
                    }
                    html += `</ul></nav>`;
                }
            } else {
                html += '<p class="text-muted">No hay productos registrados.</p>';
            }

            container.innerHTML = html;
        } catch (e) {
            container.innerHTML = '<div class="alert alert-danger">Error al cargar productos.</div>';
        }
    },

    /**
     * Carga gestión de pedidos
     */
    async loadPedidos(page = 1) {
        const container = document.getElementById('admin-content');
        if (!container) return;

        try {
            const resp = await App.fetchAuth(`${App.apiBase}/admin/pedidos?pagina=${page}&por_pagina=15`);
            const data = await resp.json();

            if (!data.success) throw new Error('Error');

            const pedidos = data.data;
            const pag = data.meta?.pagination;

            let html = `<h4 class="mb-4">Gestión de Pedidos</h4>`;

            if (pedidos && pedidos.length > 0) {
                html += `<div class="table-responsive">
                    <table class="table table-admin table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pedidos.map(p => `
                                <tr>
                                    <td>#${p.id}</td>
                                    <td>${this.escapeHtml(p.cliente_nombre)} ${this.escapeHtml(p.apellido || '')}</td>
                                    <td>${p.total_items}</td>
                                    <td>${p.total_formateado}</td>
                                    <td><span class="badge-estado ${p.estado}">${p.estado}</span></td>
                                    <td>${new Date(p.created_at).toLocaleDateString('es-CL')}</td>
                                    <td>
                                        <select class="form-select form-select-sm" onchange="Admin.changeOrderStatus(${p.id}, this.value)" style="width:150px">
                                            <option value="">Cambiar estado</option>
                                            <option value="pagado">Pagado</option>
                                            <option value="en_preparacion">En Preparación</option>
                                            <option value="enviado">Enviado</option>
                                            <option value="entregado">Entregado</option>
                                            <option value="cancelado">Cancelado</option>
                                        </select>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`;
            } else {
                html += '<p class="text-muted">No hay pedidos registrados.</p>';
            }

            container.innerHTML = html;
        } catch (e) {
            container.innerHTML = '<div class="alert alert-danger">Error al cargar pedidos.</div>';
        }
    },

    /**
     * Carga gestión de usuarios
     */
    async loadUsuarios(page = 1) {
        const container = document.getElementById('admin-content');
        if (!container) return;

        try {
            const resp = await App.fetchAuth(`${App.apiBase}/admin/usuarios?pagina=${page}&por_pagina=20`);
            const data = await resp.json();

            if (!data.success) throw new Error('Error');

            const usuarios = data.data;
            let html = `<h4 class="mb-4">Gestión de Usuarios</h4>`;

            if (usuarios && usuarios.length > 0) {
                html += `<div class="table-responsive">
                    <table class="table table-admin table-hover">
                        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Último Login</th><th>Acciones</th></tr></thead>
                        <tbody>
                            ${usuarios.map(u => `
                                <tr>
                                    <td>${u.id}</td>
                                    <td>${this.escapeHtml(u.nombre)} ${this.escapeHtml(u.apellido)}</td>
                                    <td>${this.escapeHtml(u.email)}</td>
                                    <td><span class="badge bg-info">${u.rol}</span></td>
                                    <td><span class="badge ${u.activo == 1 ? 'bg-success' : 'bg-danger'}">${u.activo == 1 ? 'Activo' : 'Deshabilitado'}</span></td>
                                    <td>${u.ultimo_login ? new Date(u.ultimo_login).toLocaleString('es-CL') : 'Nunca'}</td>
                                    <td>
                                        <button class="btn btn-sm ${u.activo == 1 ? 'btn-outline-danger' : 'btn-outline-success'} btn-action"
                                                onclick="Admin.toggleUser(${u.id}, ${u.activo == 1 ? 0 : 1})">
                                            ${u.activo == 1 ? 'Deshabilitar' : 'Activar'}
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`;
            } else {
                html += '<p class="text-muted">No hay usuarios registrados.</p>';
            }

            container.innerHTML = html;
        } catch (e) {
            container.innerHTML = '<div class="alert alert-danger">Error al cargar usuarios.</div>';
        }
    },

    /**
     * Carga reportes
     */
    async loadReportes() {
        const container = document.getElementById('admin-content');
        if (!container) return;

        try {
            const [ventasResp, topResp] = await Promise.all([
                App.fetchAuth(`${App.apiBase}/admin/reportes/ventas?periodo=mes`),
                App.fetchAuth(`${App.apiBase}/admin/reportes/productos-mas-vendidos`)
            ]);

            const ventas = await ventasResp.json();
            const top = await topResp.json();

            let html = `<h4 class="mb-4">Reportes</h4>`;

            // Productos más vendidos
            html += `<div class="card mb-4"><div class="card-header bg-primary text-white">
                <i class="bi bi-star me-2"></i>Productos Más Vendidos</div><div class="card-body">`;

            if (top.success && top.data && top.data.length > 0) {
                html += `<table class="table table-hover">
                    <thead><tr><th>#</th><th>Producto</th><th>Unidades Vendidas</th><th>Recaudación</th></tr></thead>
                    <tbody>${top.data.map((p, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${this.escapeHtml(p.nombre_producto)}</td>
                            <td><strong>${p.total_vendido}</strong></td>
                            <td>$ ${new Intl.NumberFormat('es-CL').format(Math.round(p.total_recaudado))}</td>
                        </tr>`).join('')}</tbody></table>`;
            } else {
                html += '<p class="text-muted">No hay datos de ventas aún.</p>';
            }
            html += '</div></div>';

            // Ventas por día
            html += `<div class="card"><div class="card-header bg-primary text-white">
                <i class="bi bi-graph-up me-2"></i>Ventas Últimos 30 Días</div><div class="card-body">
                <canvas id="sales-chart" height="200"></canvas>
            </div></div>`;

            container.innerHTML = html;

            // Renderizar gráfico si hay datos
            if (ventas.success && ventas.data && ventas.data.length > 0) {
                this.renderSalesChart(ventas.data);
            }
        } catch (e) {
            container.innerHTML = '<div class="alert alert-danger">Error al cargar reportes.</div>';
        }
    },

    /**
     * Renderiza gráfico de ventas simple
     */
    renderSalesChart(ventasData) {
        const ctx = document.getElementById('sales-chart');
        if (!ctx) return;

        const labels = ventasData.map(v => v.fecha);
        const values = ventasData.map(v => Math.round(v.total_ventas));

        // Crear barras simples con HTML/CSS
        const maxVal = Math.max(...values, 1);
        let html = '<div class="d-flex align-items-end" style="height:200px;gap:2px">';
        ventasData.forEach((v, i) => {
            const height = Math.max(4, (values[i] / maxVal) * 180);
            html += `<div class="flex-fill bg-primary" style="height:${height}px;min-width:6px;border-radius:2px 2px 0 0"
                        title="${v.fecha}: $${new Intl.NumberFormat('es-CL').format(values[i])}"></div>`;
        });
        html += '</div>';
        html += '<div class="d-flex mt-2" style="gap:2px;font-size:0.6rem">';
        // Mostrar algunas fechas
        const step = Math.max(1, Math.floor(ventasData.length / 10));
        ventasData.forEach((v, i) => {
            if (i % step === 0 || i === ventasData.length - 1) {
                const fecha = new Date(v.fecha);
                html += `<div class="flex-fill text-muted" style="min-width:6px;transform:rotate(-45deg);transform-origin:top left">${fecha.getDate()}/${fecha.getMonth()+1}</div>`;
            } else {
                html += '<div class="flex-fill" style="min-width:6px"></div>';
            }
        });
        html += '</div>';
        ctx.outerHTML = html;
    },

    /**
     * Muestra formulario de crear/editar producto (modal)
     */
    async showProductForm(id = null) {
        let product = null;
        let title = 'Nuevo Producto';

        if (id) {
            title = 'Editar Producto';
            try {
                const resp = await fetch(`${App.apiBase}/catalogo/${id}`);
                const data = await resp.json();
                if (data.success) product = data.data;
            } catch (e) { /* fallback */ }
        }

        // Cargar categorías
        let catOptions = '';
        try {
            const resp = await fetch(`${App.apiBase}/catalogo/categorias`);
            const data = await resp.json();
            if (data.success) {
                catOptions = data.data.map(c => `
                    <option value="${c.id}" ${product && product.id_categoria == c.id ? 'selected' : ''}>
                        ${Catalogo.escapeHtml(c.nombre)}
                    </option>`).join('');
            }
        } catch (e) { }

        const modalHtml = `
        <div class="modal fade" id="productModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header modal-header-uct">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="product-form">
                            <input type="hidden" id="prod-id" value="${product ? product.id : ''}">
                            <div class="row">
                                <div class="col-md-8 mb-3">
                                    <label class="form-label">Nombre *</label>
                                    <input type="text" class="form-control" id="prod-nombre" value="${product ? Catalogo.escapeHtml(product.nombre) : ''}" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Categoría *</label>
                                    <select class="form-select" id="prod-categoria" required>
                                        <option value="">Seleccionar...</option>
                                        ${catOptions}
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Descripción</label>
                                <textarea class="form-control" id="prod-descripcion" rows="3">${product ? Catalogo.escapeHtml(product.descripcion || '') : ''}</textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Precio ($) *</label>
                                    <input type="number" class="form-control" id="prod-precio" value="${product ? Math.round(product.precio) : ''}" required min="0">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Stock</label>
                                    <input type="number" class="form-control" id="prod-stock" value="${product ? product.stock : 0}" min="0">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Stock Mínimo</label>
                                    <input type="number" class="form-control" id="prod-stock-min" value="${product ? (product.stock_minimo || 5) : 5}" min="0">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">URL Imagen</label>
                                <input type="url" class="form-control" id="prod-imagen" value="${product ? (product.imagen_url || '') : ''}">
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="prod-activo" ${product && product.activo == 1 ? 'checked' : ''} ${product ? '' : 'checked'}>
                                    <label class="form-check-label">Producto Activo</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-accent" id="btn-save-product" onclick="Admin.saveProduct()">
                            ${product ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        // Remover modal anterior si existe
        const oldModal = document.getElementById('productModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    },

    /**
     * Guarda producto (crear/actualizar)
     */
    async saveProduct() {
        const id = document.getElementById('prod-id').value;
        const nombre = document.getElementById('prod-nombre').value.trim();
        const categoria = document.getElementById('prod-categoria').value;
        const descripcion = document.getElementById('prod-descripcion').value.trim();
        const precio = parseInt(document.getElementById('prod-precio').value);
        const stock = parseInt(document.getElementById('prod-stock').value) || 0;
        const stockMin = parseInt(document.getElementById('prod-stock-min').value) || 5;
        const imagen = document.getElementById('prod-imagen').value.trim();
        const activo = document.getElementById('prod-activo').checked ? 1 : 0;

        if (!nombre || !categoria || isNaN(precio)) {
            App.showToast('Completa los campos requeridos', 'error');
            return;
        }

        const body = { nombre, id_categoria: parseInt(categoria), descripcion, precio, stock, stock_minimo: stockMin, imagen_url: imagen, activo };
        const url = id ? `${App.apiBase}/admin/productos/${id}` : `${App.apiBase}/admin/productos`;
        const method = id ? 'PUT' : 'POST';

        try {
            const resp = await App.fetchAuth(url, { method, body: JSON.stringify(body) });
            const data = await resp.json();

            if (data.success) {
                App.showToast(id ? 'Producto actualizado' : 'Producto creado', 'success');
                bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
                this.loadProductos();
            } else {
                App.showToast(data.error?.message || 'Error', 'error');
            }
        } catch (e) {
            App.showToast('Error de conexión', 'error');
        }
    },

    /**
     * Elimina un producto
     */
    async deleteProduct(id) {
        if (!confirm('¿Eliminar este producto? Esta acción es reversible.')) return;

        try {
            const resp = await App.fetchAuth(`${App.apiBase}/admin/productos/${id}`, { method: 'DELETE' });
            const data = await resp.json();
            if (data.success) {
                App.showToast('Producto eliminado', 'success');
                this.loadProductos();
            }
        } catch (e) {
            App.showToast('Error al eliminar', 'error');
        }
    },

    /**
     * Cambia estado de un pedido
     */
    async changeOrderStatus(orderId, newStatus) {
        if (!newStatus) return;

        if (!confirm(`¿Cambiar pedido #${orderId} a estado "${newStatus}"?`)) {
            // Resetear select
            this.loadPedidos();
            return;
        }

        try {
            const resp = await App.fetchAuth(`${App.apiBase}/admin/pedidos/${orderId}/estado`, {
                method: 'PATCH',
                body: JSON.stringify({ estado: newStatus, comentario: 'Cambio manual por administrador' })
            });
            const data = await resp.json();

            if (data.success) {
                App.showToast('Estado actualizado', 'success');
                this.loadPedidos();
            } else {
                App.showToast(data.error?.message || 'Error al cambiar estado', 'error');
                this.loadPedidos();
            }
        } catch (e) {
            App.showToast('Error de conexión', 'error');
        }
    },

    /**
     * Activa/desactiva usuario
     */
    async toggleUser(userId, activo) {
        try {
            const resp = await App.fetchAuth(`${App.apiBase}/admin/usuarios/${userId}/estado`, {
                method: 'PATCH',
                body: JSON.stringify({ activo })
            });
            const data = await resp.json();
            if (data.success) {
                App.showToast('Estado de usuario actualizado', 'success');
                this.loadUsuarios();
            }
        } catch (e) {
            App.showToast('Error', 'error');
        }
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }
};
