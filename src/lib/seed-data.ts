// Seed data — Catálogo COMPLETO Energitas 2026
// Incluye Frutos Secos + Productos Regionales
// Sizes: "Bolsa Completa" = tamaño grande, "Media Bolsa" = tamaño chico

export const PRODUCT_SIZES = ['Bolsa Completa', 'Media Bolsa', 'Bolsa Chica', 'Pieza', 'Litro', 'Kilo', 'Otro'];

export const SEED_PRODUCTS = [
  // ═══════════════════════════════════════
  // ALMENDRAS
  // ═══════════════════════════════════════
  { name: 'ALMENDRA CUBIERTA CON CHOCOLATE 500 GR', cost: 190, suggested_price: 240, sale_price: 250, category: 'Almendras', size: 'Bolsa Completa' },
  { name: 'ALMENDRA CUBIERTA CON CHOCOLATE 250 GR', cost: 95, suggested_price: 120, sale_price: 130, category: 'Almendras', size: 'Media Bolsa' },
  { name: 'ALMENDRA NATURAL 500 GR', cost: 145, suggested_price: 200, sale_price: 225, category: 'Almendras', size: 'Bolsa Completa' },
  { name: 'ALMENDRA NATURAL 250 GR', cost: 72.50, suggested_price: 100, sale_price: 120, category: 'Almendras', size: 'Media Bolsa' },
  { name: 'ALMENDRA FILETEADA 350 GR', cost: 95, suggested_price: 125, sale_price: 125, category: 'Almendras', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // ARÁNDANOS
  // ═══════════════════════════════════════
  { name: 'ARÁNDANO DESHIDRATADO ENCHILADO TAJÍN 500 GR', cost: 95, suggested_price: 150, sale_price: 155, category: 'Arándanos', size: 'Bolsa Completa' },
  { name: 'ARÁNDANO DESHIDRATADO ENCHILADO TAJÍN 250 GR', cost: 47.50, suggested_price: 75, sale_price: 80, category: 'Arándanos', size: 'Media Bolsa' },
  { name: 'ARÁNDANO DESHIDRATADO NATURAL 430 GR', cost: 90, suggested_price: 130, sale_price: 135, category: 'Arándanos', size: 'Bolsa Completa' },
  { name: 'ARÁNDANO DESHIDRATADO NATURAL 215 GR', cost: 45, suggested_price: 65, sale_price: 75, category: 'Arándanos', size: 'Media Bolsa' },

  // ═══════════════════════════════════════
  // CACAHUATES
  // ═══════════════════════════════════════
  { name: 'CACAHUATE GARAPIÑADO ROJO 430 GR', cost: 48, suggested_price: 70, sale_price: 80, category: 'Cacahuates', size: 'Bolsa Completa' },
  { name: 'CACAHUATE GARAPIÑADO ROJO 215 GR', cost: 24, suggested_price: 35, sale_price: 45, category: 'Cacahuates', size: 'Media Bolsa' },
  { name: 'CACAHUATE GARAPIÑADO CON AJONJOLÍ 430 GR', cost: 48, suggested_price: 70, sale_price: 70, category: 'Cacahuates', size: 'Bolsa Completa' },
  { name: 'CACAHUATE BOTANERO CON AJO 500 GR', cost: 55, suggested_price: 85, sale_price: 85, category: 'Cacahuates', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // DÁTILES
  // ═══════════════════════════════════════
  { name: 'DÁTIL 430 GR', cost: 65, suggested_price: 110, sale_price: 110, category: 'Dátiles', size: 'Bolsa Completa' },
  { name: 'DÁTIL 215 GR', cost: 32.50, suggested_price: 55, sale_price: 60, category: 'Dátiles', size: 'Media Bolsa' },
  { name: 'DÁTIL ENCHILADO 430 GR', cost: 98, suggested_price: 135, sale_price: 135, category: 'Dátiles', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // MIXES ENERGITAS
  // ═══════════════════════════════════════
  { name: 'ENERGITAS MIX NATURAL 430 GR', cost: 78, suggested_price: 125, sale_price: 130, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'ENERGITAS MIX NATURAL 215 GR', cost: 39, suggested_price: 65, sale_price: 70, category: 'Mixes Energitas', size: 'Media Bolsa' },
  { name: 'ENERGITAS MIX NATURAL 80 GR', cost: 15, suggested_price: 25, sale_price: 25, category: 'Mixes Energitas', size: 'Bolsa Chica' },
  { name: 'ENERGITAS MIX SALADO 430 GR', cost: 78, suggested_price: 125, sale_price: 130, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'ENERGITAS MIX SALADO 215 GR', cost: 39, suggested_price: 65, sale_price: 70, category: 'Mixes Energitas', size: 'Media Bolsa' },
  { name: 'ENERGITAS MIX SALADO 80 GR', cost: 15, suggested_price: 25, sale_price: 25, category: 'Mixes Energitas', size: 'Bolsa Chica' },
  { name: 'ENERGITAS MIX ENCHILADO 430 GR', cost: 78, suggested_price: 125, sale_price: 130, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'ENERGITAS MIX ENCHILADO 215 GR', cost: 39, suggested_price: 65, sale_price: 70, category: 'Mixes Energitas', size: 'Media Bolsa' },
  { name: 'ENERGITAS MIX ENCHILADO 80 GR', cost: 15, suggested_price: 25, sale_price: 25, category: 'Mixes Energitas', size: 'Bolsa Chica' },
  { name: 'ENERGITAS MIX FRUTA ENCHILADA 430 GR', cost: 120, suggested_price: 170, sale_price: 170, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'ENERGITAS MIX FRUTA ENCHILADA 215 GR', cost: 60, suggested_price: 85, sale_price: 85, category: 'Mixes Energitas', size: 'Media Bolsa' },
  { name: 'ENERGITAS MIX CHOCOLATE 430 GR', cost: 120, suggested_price: 170, sale_price: 170, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'ENERGITAS MIX PREMIUM 430 GR', cost: 115, suggested_price: 150, sale_price: 150, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'ENERGITAS MIX LEGUMBRES 380 GR', cost: 55, suggested_price: 90, sale_price: 90, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'MIX FRUTOS DE CAPIROTADA 500 GR', cost: 90, suggested_price: 130, sale_price: 135, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'MIX FRUTOS DE CAPIROTADA 250 GR', cost: 45, suggested_price: 65, sale_price: 70, category: 'Mixes Energitas', size: 'Media Bolsa' },
  { name: 'MIX FRUTA TROPICAL DE ENERGITAS 430 GR', cost: 90, suggested_price: 130, sale_price: 130, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'MIX FRUTA PICADA CON GARAPIÑADOS 430 GR', cost: 100, suggested_price: 140, sale_price: 140, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'MIX DE NUECES 430 GR', cost: 145, suggested_price: 190, sale_price: 190, category: 'Mixes Energitas', size: 'Bolsa Completa' },
  { name: 'MIX DE LEGUMBRES ENCHILADAS 380 GR', cost: 55, suggested_price: 75, sale_price: 75, category: 'Mixes Energitas', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // NUECES
  // ═══════════════════════════════════════
  { name: 'NUEZ GARAPIÑADA 350 GR', cost: 130, suggested_price: 180, sale_price: 185, category: 'Nueces', size: 'Bolsa Completa' },
  { name: 'NUEZ GARAPIÑADA 175 GR', cost: 65, suggested_price: 90, sale_price: 95, category: 'Nueces', size: 'Media Bolsa' },
  { name: 'NUEZ INDIA TOSTADA CON SAL 430 GR', cost: 162, suggested_price: 225, sale_price: 230, category: 'Nueces', size: 'Bolsa Completa' },
  { name: 'NUEZ INDIA TOSTADA CON SAL 215 GR', cost: 81, suggested_price: 112.50, sale_price: 120, category: 'Nueces', size: 'Media Bolsa' },
  { name: 'NUEZ PECANA NATURAL 300 GR', cost: 120, suggested_price: 160, sale_price: 160, category: 'Nueces', size: 'Bolsa Completa' },
  { name: 'NUEZ PECANA NATURAL 150 GR', cost: 55, suggested_price: 80, sale_price: 80, category: 'Nueces', size: 'Media Bolsa' },
  { name: 'NUEZ CUBIERTA CON CHOCOLATE 430 GR', cost: 180, suggested_price: 230, sale_price: 230, category: 'Nueces', size: 'Bolsa Completa' },
  { name: 'NUEZ DE CASTILLA 300 GR', cost: 85, suggested_price: 120, sale_price: 120, category: 'Nueces', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // PISTACHE
  // ═══════════════════════════════════════
  { name: 'PISTACHE TOSTADO CON SAL 350 GR', cost: 145, suggested_price: 195, sale_price: 210, category: 'Pistache', size: 'Bolsa Completa' },
  { name: 'PISTACHE TOSTADO CON SAL 175 GR', cost: 72.50, suggested_price: 97.50, sale_price: 110, category: 'Pistache', size: 'Media Bolsa' },
  { name: 'PISTACHE HORNEADO ENCHILADO 350 GR', cost: 150, suggested_price: 200, sale_price: 200, category: 'Pistache', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // MANGO
  // ═══════════════════════════════════════
  { name: 'MANGO DESHIDRATADO ENCHILADO 350 GR', cost: 110, suggested_price: 165, sale_price: 165, category: 'Mango', size: 'Bolsa Completa' },
  { name: 'MANGO DESHIDRATADO ENCHILADO 175 GR', cost: 55, suggested_price: 82.50, sale_price: 85, category: 'Mango', size: 'Media Bolsa' },
  { name: 'PULPA DE MANGO DESHIDRATADO GOURMET NATURAL 300 GR', cost: 110, suggested_price: 160, sale_price: 160, category: 'Mango', size: 'Bolsa Completa' },
  { name: 'PULPA DE MANGO DESHIDRATADO GOURMET CHAMOY 350 GR', cost: 115, suggested_price: 165, sale_price: 170, category: 'Mango', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // PIÑA
  // ═══════════════════════════════════════
  { name: 'PIÑA DESHIDRATADA ENCHILADA 500 GR', cost: 145, suggested_price: 195, sale_price: 200, category: 'Piña', size: 'Bolsa Completa' },
  { name: 'PIÑA DESHIDRATADA ENCHILADA 250 GR', cost: 72.50, suggested_price: 97.50, sale_price: 105, category: 'Piña', size: 'Media Bolsa' },

  // ═══════════════════════════════════════
  // GRANOLA Y AVENA
  // ═══════════════════════════════════════
  { name: 'GRANOLA TOSTADA CON MIEL DE ABEJA 430 GR', cost: 55, suggested_price: 95, sale_price: 115, category: 'Granola', size: 'Bolsa Completa' },
  { name: 'GRANOLA TOSTADA CON MIEL DE ABEJA 215 GR', cost: 27.50, suggested_price: 47.50, sale_price: 65, category: 'Granola', size: 'Media Bolsa' },
  { name: 'AVENA TOSTADA CON MIEL DE ABEJA 430 GR', cost: 45, suggested_price: 75, sale_price: 75, category: 'Granola', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // CHOCOLATE (Cubiertas)
  // ═══════════════════════════════════════
  { name: 'PASA CUBIERTA CON CHOCOLATE 500 GR', cost: 98, suggested_price: 150, sale_price: 150, category: 'Chocolate', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // MAÍZ Y SNACKS CRUJIENTES
  // ═══════════════════════════════════════
  { name: 'MAÍZ CRUJIENTE (CHILE-LIMÓN, CHIPOTLE, CHEDDAR, HABANERO) 280 GR', cost: 62, suggested_price: 100, sale_price: 100, category: 'Snacks', size: 'Bolsa Completa' },
  { name: 'HABAS ENCHILADAS 300 GR', cost: 45, suggested_price: 60, sale_price: 70, category: 'Snacks', size: 'Bolsa Completa' },
  { name: 'GOMITAS ENCHILADAS 130 GR', cost: 35, suggested_price: 45, sale_price: 45, category: 'Snacks', size: 'Bolsa Chica' },
  { name: 'BANANA CHIPS DE ENERGITAS 280 GR', cost: 60, suggested_price: 95, sale_price: 95, category: 'Snacks', size: 'Bolsa Completa' },
  { name: 'PLÁTANO CHIP NACIONAL 140 GR', cost: 30, suggested_price: 50, sale_price: 50, category: 'Snacks', size: 'Bolsa Chica' },
  { name: 'NOPAL DESHIDRATADO ENCHILADO EN ROLLOS 350 GR', cost: 90, suggested_price: 125, sale_price: 125, category: 'Snacks', size: 'Bolsa Completa' },
  { name: 'GARBANZO ENCHILADO 300 GR', cost: 42, suggested_price: 57, sale_price: 57, category: 'Snacks', size: 'Bolsa Completa' },
  { name: 'JAMAICA ENCHILADA 350 GR', cost: 105, suggested_price: 140, sale_price: 140, category: 'Snacks', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // SEMILLAS Y GRANOS
  // ═══════════════════════════════════════
  { name: 'SEMILLA DE CALABAZA RUSA TOSTADA CON SAL 280 GR', cost: 65, suggested_price: 100, sale_price: 100, category: 'Semillas', size: 'Bolsa Completa' },
  { name: 'SEMILLA DE CHÍA 500 GR', cost: 77, suggested_price: 110, sale_price: 110, category: 'Semillas', size: 'Bolsa Completa' },
  { name: 'LINAZA 500 GR', cost: 37, suggested_price: 57, sale_price: 57, category: 'Semillas', size: 'Bolsa Completa' },
  { name: 'PEPITA DE CALABAZA HORNEADA 400 GR', cost: 115, suggested_price: 145, sale_price: 145, category: 'Semillas', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // FRUTAS DESHIDRATADAS
  // ═══════════════════════════════════════
  { name: 'CEREZA DESHIDRATADA 500 GR', cost: 135, suggested_price: 175, sale_price: 175, category: 'Frutas deshidratadas', size: 'Bolsa Completa' },
  { name: 'FRESA DESHIDRATADA ENCHILADA 500 GR', cost: 120, suggested_price: 150, sale_price: 150, category: 'Frutas deshidratadas', size: 'Bolsa Completa' },
  { name: 'CHABACANO DESHIDRATADO 500 GR', cost: 170, suggested_price: 215, sale_price: 215, category: 'Frutas deshidratadas', size: 'Bolsa Completa' },
  { name: 'HIGO BLANCO SECO 500 GR', cost: 125, suggested_price: 160, sale_price: 160, category: 'Frutas deshidratadas', size: 'Bolsa Completa' },
  { name: 'HIGO NEGRO SECO 500 GR', cost: 150, suggested_price: 185, sale_price: 185, category: 'Frutas deshidratadas', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // AVELLANA
  // ═══════════════════════════════════════
  { name: 'AVELLANA PELADA ENTERA NATURAL 430 GR', cost: 150, suggested_price: 200, sale_price: 200, category: 'Nueces', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // CAFÉ
  // ═══════════════════════════════════════
  { name: 'CAFÉ DE OAXACA ORGÁNICO TOSTADO MOLIDO GOURMET 500 GR', cost: 138, suggested_price: 180, sale_price: 180, category: 'Café', size: 'Bolsa Completa' },
  { name: 'CAFÉ DE OAXACA ORGÁNICO TOSTADO MOLIDO ESPECIALIDAD 500 GR', cost: 197, suggested_price: 250, sale_price: 250, category: 'Café', size: 'Bolsa Completa' },

  // ═══════════════════════════════════════
  // JAMAICA Y TÉS
  // ═══════════════════════════════════════
  { name: 'FLOR DE JAMAICA 1 KILO', cost: 95, suggested_price: 135, sale_price: 135, category: 'Jamaica', size: 'Kilo' },

  // ═══════════════════════════════════════
  // MIEL
  // ═══════════════════════════════════════
  { name: 'MIEL DE ABEJA 100% NATURAL 1 LITRO', cost: 145, suggested_price: 195, sale_price: 200, category: 'Miel', size: 'Litro' },

  // ═══════════════════════════════════════
  // ESPECIALES / REGALO
  // ═══════════════════════════════════════
  { name: 'TABLA DE PAROTA CON FRUTOS SECOS', cost: 380, suggested_price: 420, sale_price: 420, category: 'Especiales', size: 'Pieza' },
  { name: 'BARRITAS DE AMARANTO CON CACAO 10 PZS', cost: 160, suggested_price: 200, sale_price: 200, category: 'Especiales', size: 'Pieza' },
  { name: 'GALLETAS ARTESANALES SEMILLAS DE ENERGITAS 2 PZS', cost: 30, suggested_price: 50, sale_price: 50, category: 'Especiales', size: 'Pieza' },

  // ═══════════════════════════════════════
  // 🌵 PRODUCTOS REGIONALES
  // ═══════════════════════════════════════
  { name: 'CARNE SECA DE RES ESTILO SONORA 100 GR', cost: 100, suggested_price: 140, sale_price: 140, category: 'Carnes', size: 'Pieza' },
  { name: 'CARNE SECA DE RES SALSEADA 100 GR', cost: 100, suggested_price: 140, sale_price: 140, category: 'Carnes', size: 'Pieza' },
  { name: 'CARNE MACHACA DE ENERGITAS 250 GR', cost: 180, suggested_price: 230, sale_price: 230, category: 'Carnes', size: 'Pieza' },
  { name: 'CHILTEPIN SILVESTRE DE SONORA ENTERO 100 GR', cost: 170, suggested_price: 215, sale_price: 215, category: 'Regionales', size: 'Pieza' },
  { name: 'SALSA MACHA GOURMET DE ENERGITAS 250 GR', cost: 130, suggested_price: 170, sale_price: 170, category: 'Regionales', size: 'Pieza' },
  { name: 'MINI COYOTAS DE CAJETA 4 PZS', cost: 30, suggested_price: 50, sale_price: 50, category: 'Dulces regionales', size: 'Pieza' },
  { name: 'JAMONCILLOS DE URES 10 PZS', cost: 50, suggested_price: 70, sale_price: 75, category: 'Dulces regionales', size: 'Pieza' },
  { name: 'JAMONCILLOS DE URES 04 PZS', cost: 20, suggested_price: 28, sale_price: 30, category: 'Dulces regionales', size: 'Pieza' },
  { name: 'MALVAVISCOS SUAVES DE MAZATLÁN 50 PZS', cost: 50, suggested_price: 68, sale_price: 68, category: 'Dulces regionales', size: 'Pieza' },
  { name: 'CORICOS SONORENSES 15 PZS', cost: 50, suggested_price: 68, sale_price: 68, category: 'Dulces regionales', size: 'Pieza' },
  { name: 'EMPANADITAS RELLENAS DE CAJETA 5 PZS', cost: 53, suggested_price: 73, sale_price: 73, category: 'Dulces regionales', size: 'Pieza' },
  { name: 'EMPANADITAS RELLENAS DE LECHERA 5 PZS', cost: 55, suggested_price: 75, sale_price: 75, category: 'Dulces regionales', size: 'Pieza' },
  { name: 'PLATO MIXTO DE COCADAS CON GUAYABETE', cost: 120, suggested_price: 150, sale_price: 150, category: 'Dulces regionales', size: 'Pieza' },
];
