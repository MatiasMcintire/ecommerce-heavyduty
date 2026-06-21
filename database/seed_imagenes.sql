-- ============================================================
-- TAREA LEONARDO #1 — Imágenes de productos
-- ============================================================
-- Rellena la URL de cada producto entre las comillas.
-- Fuente recomendada: https://unsplash.com  (el CSP ya permite images.unsplash.com)
--   1. Buscá la imagen, click derecho → "Copiar dirección de la imagen".
--   2. Tiene que terminar en una imagen real (.jpg / .png / o un enlace de images.unsplash.com).
--   3. Pegala entre las comillas de su producto. NO cambies el slug ni el resto.
--
-- Para aplicar y ver el cambio:
--   mysql -h127.0.0.1 -u ecommerce_app -p uct_ecommerce < database/seed_imagenes.sql
--   (refrescá el navegador con Ctrl+Shift+R)
--
-- Si una URL queda vacía, el producto simplemente muestra el placeholder gris.
-- Es solo data: imposible romper la app con este archivo.
-- ============================================================

-- Componentes PC
UPDATE productos SET imagen_url = 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600' WHERE slug = 'procesador-intel-core-i5-13400f';  -- ejemplo ya puesto
UPDATE productos SET imagen_url = '' WHERE slug = 'procesador-amd-ryzen-5-7600x';
UPDATE productos SET imagen_url = '' WHERE slug = 'memoria-kingston-fury-beast-16gb-ddr5';
UPDATE productos SET imagen_url = '' WHERE slug = 'memoria-corsair-vengeance-32gb-ddr5';
UPDATE productos SET imagen_url = '' WHERE slug = 'fuente-evga-supernova-750w-gold';
UPDATE productos SET imagen_url = '' WHERE slug = 'placa-madre-asus-tuf-b650-plus';
UPDATE productos SET imagen_url = '' WHERE slug = 'ssd-kingston-nv2-1tb-nvme';
UPDATE productos SET imagen_url = '' WHERE slug = 'refrigeracion-corsair-icue-h100i';

-- Accesorios
UPDATE productos SET imagen_url = '' WHERE slug = 'ventilador-120mm-argb';
UPDATE productos SET imagen_url = '' WHERE slug = 'mouse-logitech-g502-hero';
UPDATE productos SET imagen_url = '' WHERE slug = 'teclado-redragon-kumara';
UPDATE productos SET imagen_url = '' WHERE slug = 'cable-hdmi-2-1-belkin-8k-2m';
UPDATE productos SET imagen_url = '' WHERE slug = 'cable-sata-iii-pack-x3';

-- Herramientas
UPDATE productos SET imagen_url = '' WHERE slug = 'kit-destornilladores-precision-32';
UPDATE productos SET imagen_url = '' WHERE slug = 'estacion-soldadura-60w';

-- Repuestos
UPDATE productos SET imagen_url = '' WHERE slug = 'pasta-termica-arctic-mx-4-4g';
UPDATE productos SET imagen_url = '' WHERE slug = 'kit-limpieza-aire-comprimido';
UPDATE productos SET imagen_url = '' WHERE slug = 'boton-power-reset-universal';
UPDATE productos SET imagen_url = '' WHERE slug = 'bisagras-plasticas-notebook';

-- Servicios Técnicos
UPDATE productos SET imagen_url = '' WHERE slug = 'diagnostico-tecnico-profesional';
