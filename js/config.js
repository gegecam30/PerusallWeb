/**
 * ══════════════════════════════════════════════════════════════════
 * PERUSALL SMART CO-PILOT — CONFIGURACIÓN GLOBAL MODULAR
 * ══════════════════════════════════════════════════════════════════
 * Diseñado para desacoplar completamente la lógica visual del contenido.
 * Soporta activos de Minecraft (Bloques Tierra, Hierro, Diamante),
 * moneda en Soles (PEN S/.), mensajes de encantamiento y música.
 */

const CONFIG = Object.freeze({
  // ── INFORMACIÓN DE MARCA ──
  brand: {
    name: "Perusall Smart Co-Pilot",
    shortName: "Co-Pilot",
    version: "v2.3",
    tagline: "Inteligencia para el estudio dialógico",
    chromeStoreUrl: "https://chromewebstore.google.com/detail/perusall-smart-co-pilot/mdjllgchpbdiempomlnhcjbllceeecbf",
    rating: "5.0 / 5.0",
    ratingCount: "1,240+ universitarios",
    statusText: "Sistemas operativos y compatibles con Perusall v2.3"
  },

  // ── TEXTOS DEL EFECTO DE ENCANTAMIENTO (TYPEWRITER GLITCH) ──
  enchantMessages: [
    { lang: 'es', text: 'Analiza lecturas complejas, formula aportes críticos y asegura tu 20/20 con IA académica.' },
    { lang: 'enchant', text: '' },
    { lang: 'es', text: 'Citas nativas con @mención directa a compañeros y simulación de lectura 100% indetectable.' },
    { lang: 'enchant', text: '' },
    { lang: 'es', text: 'Respuestas contextuales sin patrones sintéticos. Diseñado para estudiantes exigentes.' },
    { lang: 'enchant', text: '' }
  ],

  // ── CANALES DE CONTACTO Y ADQUISICIÓN DIRECTA ──
  contacts: {
    whatsapp: {
      enabled: true,
      label: "WhatsApp",
      handle: "+51 934 033 735",
      phoneRaw: "934033735",
      urlBase: "https://wa.me/51934033735",
      icon: "fa-brands fa-whatsapp",
      generateMessage: (planName, price) => 
        `Hola, deseo adquirir la licencia del Plan ${planName} (${price}) de Perusall Smart Co-Pilot. Pago mediante Yape/Plin/Transferencia. ¿Me indican los datos para el abono?`
    },
    telegram: {
      enabled: true,
      label: "Telegram",
      handle: "Canal Oficial de la Comunidad",
      url: "https://t.me/+kGDzj1dmtOs1MTdh",
      icon: "fa-brands fa-telegram",
      generateMessage: (planName, price) => 
        `Hola, deseo activar el Plan ${planName} (${price}) de Perusall Smart Co-Pilot vía PayPal o Yape/Plin.`
    },
    discord: {
      enabled: true,
      label: "Discord",
      handle: "Servidor Oficial de la Comunidad",
      serverInvite: "https://discord.gg/JPHfryuMeY",
      icon: "fa-brands fa-discord"
    },
    instagram: {
      enabled: true,
      label: "Instagram",
      handle: "@pebotlnx",
      profileUrl: "https://www.instagram.com/pebotlnx/",
      icon: "fa-brands fa-instagram"
    }
  },

  // ── MONEDA OFICIAL (PEN SOL / SIN USD) ──
  currency: {
    symbol: "S/.",
    code: "PEN",
    name: "Soles Peruanos"
  },

  // ── FACTURACIÓN: POR MES (INICIAL) Y POR CICLO (OFERTA 4 MESES) ──
  billing: {
    defaultMode: "month", // Inicia por defecto en mensual
    modes: {
      month: { label: "Mensual", discountTag: "Renovación 30 días" },
      cycle: { label: "Por Ciclo (4 Meses) • Oferta", discountTag: "Ahorra hasta 25%" }
    }
  },

  // ── PLANES Y TARIFAS (9.99 BÁSICO, 19.99 PREMIUM, 24.99 VIP) ──
  plans: [
    {
      id: "basic",
      name: "Básico",
      badge: "Tier Tierra",
      blockAsset: "assets/grass_block_side.png",
      priceMonth: "9.99",
      priceCycle: "29.99",
      limitDaily: "10 comentarios / día",
      summary: "Para estudiantes que buscan asegurar la cuota básica de participación en sus lecturas semanales.",
      isPopular: false,
      features: [
        { text: "10 comentarios académicos por día", included: true },
        { text: "Modo Auto-Comentar inteligente", included: true },
        { text: "Simulación de lectura con scroll humano", included: true },
        { text: "Puntuación estimada meta: 16–18 / 20", included: true },
        { text: "Vinculación a 1 equipo (Device Fingerprint)", included: true },
        { text: "Citas con @mención a compañeros", included: false },
        { text: "Modo Copiloto manual de debate", included: false },
        { text: "Fallback prioritario Gemini Flash", included: false }
      ],
      ctaText: "Adquirir Básico"
    },
    {
      id: "premium",
      name: "Premium",
      badge: "Tier Hierro • Más Elegido",
      blockAsset: "assets/iron_block.png",
      priceMonth: "19.99",
      priceCycle: "59.99",
      limitDaily: "50 comentarios / día",
      summary: "El estándar preferido para cursos con alta exigencia de interacción entre pares y lectura activa.",
      isPopular: true,
      features: [
        { text: "50 comentarios académicos por día", included: true },
        { text: "Modos Auto-Comentar + Auto-Responder", included: true },
        { text: "Citas nativas con @mención directa a hilos", included: true },
        { text: "Interacción entre pares con likes automáticos", included: true },
        { text: "Tiempos aleatorios y pausas anti-detección", included: true },
        { text: "Puntuación estimada meta: 19–20 / 20", included: true },
        { text: "Fallback automático Groq + Gemini", included: true },
        { text: "Soporte prioritario por WhatsApp", included: true }
      ],
      ctaText: "Adquirir Premium"
    },
    {
      id: "vip",
      name: "VIP",
      badge: "Tier Diamante • Máxima Prioridad",
      blockAsset: "assets/diamond_block.png",
      priceMonth: "24.99",
      priceCycle: "74.99",
      limitDaily: "200 comentarios / día",
      summary: "Para asegurar un promedio ponderado sobresaliente con prioridad de procesamiento sin esperas.",
      isPopular: false,
      features: [
        { text: "200 comentarios académicos por día", included: true },
        { text: "Modos Auto-Comentar + Auto-Responder + Copiloto", included: true },
        { text: "Prioridad Gemini Flash (0% tiempo de espera)", included: true },
        { text: "Generación de aportes críticos y preguntas de debate", included: true },
        { text: "Protección anti-plagio con redacción inédita", included: true },
        { text: "Puntuación estimada meta: 20 / 20 garantizada", included: true },
        { text: "Atención personalizada 1 a 1 de por vida", included: true },
        { text: "Garantía total de satisfacción", included: true }
      ],
      ctaText: "Adquirir VIP"
    }
  ],

  // ── MÉTODOS DE PAGO EXCLUSIVOS (SOLO 4 MÉTODOS) ──
  paymentMethods: [
    { 
      id: "yape", 
      name: "Yape", 
      note: "Instantáneo • Sin comisiones", 
      icon: "fa-solid fa-mobile-screen-button", 
      asset: "assets/yape.svg",
      color: "#742284" 
    },
    { 
      id: "plin", 
      name: "Plin", 
      note: "Todos los bancos • Inmediato", 
      icon: "fa-solid fa-bolt", 
      asset: "assets/plin.png",
      color: "#00d0b7" 
    },
    { 
      id: "paypal", 
      name: "PayPal", 
      note: "Web • Internacional", 
      icon: "fa-brands fa-paypal", 
      asset: "assets/paypal.svg",
      color: "#0079c1" 
    },
    { 
      id: "transferencia", 
      name: "Transferencia Bancaria", 
      note: "BCP / BBVA / Interbank", 
      icon: "fa-solid fa-building-columns", 
      asset: "assets/bank.svg",
      color: "#f59e0b" 
    }
  ],

  // ── CAPACIDADES DE LA HERRAMIENTA ──
  capabilities: [
    {
      number: "01",
      title: "Análisis Dialógico Contextual",
      description: "Interpreta el párrafo seleccionado en su contexto académico real, construyendo reflexiones críticas y preguntas epistémicas que aportan valor tangible a la discusión."
    },
    {
      number: "02",
      title: "Citas Nativas con @Mención",
      description: "Identifica hilos existentes y responde a intervenciones de compañeros utilizando la sintaxis nativa de Perusall, maximizando los indicadores de interacción social."
    },
    {
      number: "03",
      title: "Simulación de Lectura Humana",
      description: "Emula el desplazamiento ocular y la velocidad de comprensión a través de un scroll variable con micro-pausas que acumulan tiempo válido en el contador oficial de la plataforma."
    },
    {
      number: "04",
      title: "Redacción Inédita y Segura",
      description: "Cada comentario es generado de manera única evitando patrones sintéticos o frases prefabricadas que pudieran coincidir con otros usuarios de la plataforma."
    }
  ],

  // ── TÉRMINOS Y POLÍTICAS ──
  policies: [
    {
      id: "terms",
      title: "Términos de Servicio",
      summary: "Condiciones de uso y adquisición de licencias.",
      sections: [
        {
          heading: "1. Naturaleza del Software",
          body: "Perusall Smart Co-Pilot es una herramienta de asistencia tecnológica diseñada para apoyar al estudiante en la gestión y análisis de material académico. El usuario conserva la responsabilidad sobre el uso y entrega de sus asignaciones."
        },
        {
          heading: "2. Licenciamiento y Activación",
          body: "Cada licencia otorgada es de carácter personal e intransferible. La activación se realiza de forma inmediata una vez confirmado el comprobante de pago."
        },
        {
          heading: "3. Entrega y Garantía",
          body: "Las claves de acceso se entregan de forma digital e inmediata tras la verificación del pago. Ofrecemos 7 días de garantía de satisfacción con soporte técnico dedicado ante cualquier incidencia de configuración."
        }
      ]
    },
    {
      id: "privacy",
      title: "Política de Privacidad",
      summary: "Compromiso absoluto con la soberanía de tus datos.",
      sections: [
        {
          heading: "1. Cero Recolección de Credenciales",
          body: "La extensión opera íntegramente en el entorno local de tu navegador. Jamás recopila, almacena ni transmite contraseñas, correos institucionales ni datos bancarios a servidores externos."
        },
        {
          heading: "2. Procesamiento de Texto Efímero",
          body: "Los fragmentos de lectura seleccionados para generar comentarios son procesados en memoria de manera estrictamente efímera y no se emplean para el entrenamiento de modelos públicos."
        },
        {
          heading: "3. Sin Rastreo de Terceros",
          body: "No integramos cookies publicitarias, trackers de analítica invasiva ni scripts de telemetría de terceros en la extensión ni en esta página."
        }
      ]
    },
    {
      id: "ethics",
      title: "Ética Académica",
      summary: "Uso responsable de la inteligencia artificial.",
      sections: [
        {
          heading: "1. Asistencia, no Reemplazo",
          body: "Promovemos el uso de la IA como un andamiaje para la comprensión de textos densos y la formulación de ideas claras, fomentando una lectura más eficiente e interactiva."
        },
        {
          heading: "2. Independencia Institucional",
          body: "Perusall Smart Co-Pilot es un desarrollo independiente de ingeniería de software y no guarda afiliación ni patrocinio formal con Perusall LLC ni con ninguna universidad específica."
        }
      ]
    }
  ],

  // ── PREGUNTAS FRECUENTES (FAQ) ──
  faqs: [
    {
      q: "¿Cómo se activa la licencia después de realizar el pago?",
      a: "El proceso toma menos de dos minutos. Al completar el pago, nos envías el comprobante por WhatsApp, Telegram o Discord. Te proporcionamos tu clave de activación y una guía concisa para ingresarla en el popup de la extensión."
    },
    {
      q: "¿La extensión es compatible con cualquier universidad y tipo de documento?",
      a: "Sí. Funciona sobre cualquier plataforma Perusall universitaria (UPC, PUCP, UTEC, entre otras) y con cualquier documento cargado: PDFs, capítulos de libros, artículos o vídeos con transcripción."
    },
    {
      q: "¿Qué sucede si Perusall actualiza su interfaz?",
      a: "Supervisamos constantemente los cambios de la plataforma. Cualquier ajuste técnico es incorporado en la extensión y se actualiza de forma automática en tu navegador sin ningún coste adicional."
    },
    {
      q: "¿Puedo instalarla en más de un dispositivo?",
      a: "Los planes Basic y Premium están diseñados para una computadora personal. El plan VIP incluye autorización para dos equipos simultáneos (por ejemplo, laptop y PC de escritorio)."
    }
  ],

  // ── HOOK PARA INTEGRACIÓN BACKEND FUTURA ──
  backend: {
    enabled: false,
    endpoints: {
      checkout: "/api/checkout",
      verifyLicense: "/api/license/verify"
    },
    onPlanSelected: function(plan) {
      if (this.enabled) {
        console.log(`[API Checkout] Iniciando orden para ${plan.id}...`);
      }
    }
  }
});
