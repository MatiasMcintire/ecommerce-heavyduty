-- ============================================================
-- Seed de especificaciones — set demo curado (~16 productos)
-- Specs realistas por producto. Las categorías no curadas caen
-- al cuadro básico (marca, categoría, SKU, stock, garantía).
-- UPDATE por slug (único y estable). JSON_OBJECT evita escapar comillas.
-- Re-ejecutable: idempotente (vuelve a setear el mismo valor).
-- ============================================================

-- Procesadores (CPU)
UPDATE productos SET especificaciones = JSON_OBJECT(
  'Núcleos','10 (6P+4E)','Hilos','16','Frecuencia turbo','4.6 GHz','Socket','LGA1700','TDP','65W'
) WHERE slug = 'procesador-intel-core-i5-13400f';

UPDATE productos SET especificaciones = JSON_OBJECT(
  'Núcleos','6','Hilos','12','Frecuencia turbo','5.3 GHz','Socket','AM5','TDP','105W'
) WHERE slug = 'procesador-amd-ryzen-5-7600x';

-- Memorias RAM
UPDATE productos SET especificaciones = JSON_OBJECT(
  'Capacidad','16GB','Tipo','DDR5','Velocidad','5200 MHz','Latencia','CL40'
) WHERE slug = 'memoria-kingston-fury-beast-16gb-ddr5';

UPDATE productos SET especificaciones = JSON_OBJECT(
  'Capacidad','32GB (2x16)','Tipo','DDR5','Velocidad','6000 MHz','Latencia','CL36'
) WHERE slug = 'memoria-corsair-vengeance-32gb-ddr5';

-- Placa madre
UPDATE productos SET especificaciones = JSON_OBJECT(
  'Socket','AM5','Chipset','B650','Formato','ATX','RAM máx.','128GB DDR5'
) WHERE slug = 'placa-madre-asus-tuf-b650-plus';

-- Fuente de poder
UPDATE productos SET especificaciones = JSON_OBJECT(
  'Potencia','750W','Certificación','80+ Gold','Modular','Full modular','Ventilador','135mm'
) WHERE slug = 'fuente-evga-supernova-750w-gold';

-- Almacenamiento (SSD/HDD)
UPDATE productos SET especificaciones = JSON_OBJECT(
  'Capacidad','1TB','Interfaz','PCIe 4.0 NVMe','Lectura','3500 MB/s','Escritura','2100 MB/s'
) WHERE slug = 'ssd-kingston-nv2-1tb-nvme';

UPDATE productos SET especificaciones = JSON_OBJECT(
  'Capacidad','1TB','Interfaz','PCIe 4.0 NVMe','Lectura','7000 MB/s','Escritura','5000 MB/s'
) WHERE slug = 'ssd-samsung-980-pro-1tb';

UPDATE productos SET especificaciones = JSON_OBJECT(
  'Capacidad','2TB','Interfaz','SATA III','Lectura','560 MB/s','Escritura','510 MB/s'
) WHERE slug = 'ssd-crucial-mx500-2tb';

-- Tarjetas de video (GPU)
UPDATE productos SET especificaciones = JSON_OBJECT(
  'Memoria','12GB GDDR7','Bus','192-bit','Boost clock','2512 MHz','Consumo','250W'
) WHERE slug = 'gpu-msi-rtx-5070-shadow-2x-oc';

UPDATE productos SET especificaciones = JSON_OBJECT(
  'Memoria','16GB GDDR7','Bus','256-bit','Boost clock','2497 MHz','Consumo','300W'
) WHERE slug = 'gpu-asus-prime-rtx-5070-ti-oc';

-- Celulares
UPDATE productos SET especificaciones = JSON_OBJECT(
  'Pantalla','6.1” OLED','Procesador','A16 Bionic','RAM','6GB','Almacenamiento','128GB','Cámara','48MP + 12MP','Batería','3349 mAh'
) WHERE slug = 'iphone-15-128gb';

UPDATE productos SET especificaciones = JSON_OBJECT(
  'Pantalla','6.2” AMOLED 120Hz','Procesador','Exynos 2400','RAM','8GB','Almacenamiento','256GB','Cámara','50MP + 12MP + 10MP','Batería','4000 mAh'
) WHERE slug = 'samsung-galaxy-s24-256gb';

UPDATE productos SET especificaciones = JSON_OBJECT(
  'Pantalla','6.67” AMOLED 120Hz','Procesador','Snapdragon 7s Gen 2','RAM','8GB','Almacenamiento','256GB','Cámara','200MP','Batería','5100 mAh'
) WHERE slug = 'xiaomi-redmi-note-13-pro';

UPDATE productos SET especificaciones = JSON_OBJECT(
  'Pantalla','6.2” OLED 120Hz','Procesador','Google Tensor G3','RAM','8GB','Almacenamiento','128GB','Cámara','50MP + 12MP','Batería','4575 mAh'
) WHERE slug = 'google-pixel-8-128gb';
