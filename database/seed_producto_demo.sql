-- ============================================================
-- Producto Demo — Prueba de Pago Real ($990; con cupón PAGOREAL10 = $10)
-- Para que el profe/cualquiera haga una compra REAL y se vea el cobro.
-- Va aparte para que NO lo pise el re-seed del catálogo. Idempotente por slug.
-- ============================================================
INSERT INTO productos
  (id_categoria, nombre, slug, descripcion, precio, stock, stock_minimo, marca, imagen_url, activo, meta_descripcion)
VALUES
  (1, 'Producto Demo — Prueba de Pago Real', 'producto-demo-pago-real',
   'Producto de demostración para probar el pago real con MercadoPago. Vale $990; usando el cupón PAGOREAL10 el total queda en $10. Compra de verdad, monto simbólico.',
   990, 9999, 0, 'QuadCore', 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600', 1,
   'Producto demo para probar el pago real.')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre), descripcion = VALUES(descripcion), precio = VALUES(precio),
  stock = VALUES(stock), marca = VALUES(marca), imagen_url = VALUES(imagen_url),
  activo = VALUES(activo), meta_descripcion = VALUES(meta_descripcion);

-- Cupón que deja el producto demo ($990) en $10. monto_fijo = 980, sin mínimo, sin tope de usos.
INSERT INTO cupones
  (codigo, tipo_descuento, valor, monto_minimo, usos_maximos, usos_actuales, fecha_inicio, fecha_fin, activo)
VALUES
  ('PAGOREAL10', 'monto_fijo', 980, NULL, NULL, 0, '2025-01-01 00:00:00', '2027-12-31 23:59:59', 1)
ON DUPLICATE KEY UPDATE
  tipo_descuento = VALUES(tipo_descuento), valor = VALUES(valor), monto_minimo = VALUES(monto_minimo),
  usos_maximos = VALUES(usos_maximos), fecha_inicio = VALUES(fecha_inicio),
  fecha_fin = VALUES(fecha_fin), activo = VALUES(activo);
