/**
 * ══════════════════════════════════════════════════════════════════
 * PERUSALL SMART CO-PILOT — APP & SIMULATOR CONTROLLER
 * ══════════════════════════════════════════════════════════════════
 * Frontend minimalista, desacoplado, seguro contra vulnerabilidades
 * XSS y tabnabbing, con simulador interactivo en tiempo real integrado.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado local de la aplicación
  const state = {
    currentCurrency: (CONFIG.currency && CONFIG.currency.code) || 'PEN',
    selectedPlan: null,
    activePolicyIndex: 0,
    copiedText: '',
    soundEnabled: true,
    billingMode: (CONFIG.billing && CONFIG.billing.defaultMode) || 'month'
  };

  // ── MOTOR DE AUDIO SINTETIZADO (WEB AUDIO API) ──
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const sfx = {
    playPop() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (e) {}
    },
    playTyping() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const freqs = [320, 360, 400, 420];
        const f = freqs[Math.floor(Math.random() * freqs.length)];
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      } catch (e) {}
    },
    playSuccess() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + (i * 0.06));
          gain.gain.setValueAtTime(0.06, now + (i * 0.06));
          gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.06) + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (i * 0.06));
          osc.stop(now + (i * 0.06) + 0.25);
        });
      } catch (e) {}
    }
  };

  // Cache de elementos del DOM
  const dom = {
    plansGrid: document.getElementById('pricing-grid'),
    paymentMethodsStrip: document.getElementById('payment-methods-strip'),
    capabilitiesGrid: document.getElementById('capabilities-grid'),
    policiesNav: document.getElementById('policies-tabs-nav'),
    policyCardContainer: document.getElementById('policy-card-view'),
    faqList: document.getElementById('faq-list'),

    // Facturación Ciclo / Mes
    btnBillCycle: document.getElementById('btn-bill-cycle'),
    btnBillMonth: document.getElementById('btn-bill-month'),

    // Elementos Interactivos Estilo Myweb
    particlesContainer: document.getElementById('particles'),
    typedText: document.getElementById('typed-text'),
    noteBlock: document.getElementById('note-block'),
    noteSound: document.getElementById('note-sound'),
    bgMusic: document.getElementById('bg-music'),
    musicBtn: document.getElementById('music-toggle'),
    musicIcon: document.getElementById('music-icon'),
    musicWrapper: document.querySelector('.music-wrapper'),
    couponModal: document.getElementById('coupon-modal'),
    btnCloseCoupon: document.getElementById('btn-close-coupon'),

    // Modal
    modalOverlay: document.getElementById('purchase-modal'),
    modalCloseBtn: document.getElementById('btn-close-modal'),
    modalPlanName: document.getElementById('modal-plan-name'),
    modalPlanPrice: document.getElementById('modal-plan-price'),
    modalLinkWhatsApp: document.getElementById('modal-link-whatsapp'),
    modalLinkTelegram: document.getElementById('modal-link-telegram'),
    modalLinkDiscord: document.getElementById('modal-link-discord'),
    modalLinkInstagram: document.getElementById('modal-link-instagram'),
    btnCopyOrder: document.getElementById('btn-copy-order'),

    // Toast
    toastBar: document.getElementById('toast-bar'),
    toastText: document.getElementById('toast-text')
  };

  // ────────────────────────────────────────────────────────────────
  // 1. INICIALIZACIÓN GENERAL
  // ────────────────────────────────────────────────────────────────
  function init() {
    initParticles();
    initTypewriter();
    initMusic();
    initNoteBlock();
    renderBrandLinks();
    renderCapabilities();
    renderPlans();
    renderPaymentMethods();
    renderPoliciesTabs();
    renderPolicyCard(0);
    renderFAQs();
    bindEvents();
  }

  function renderBrandLinks() {
    const chromeLinks = document.querySelectorAll('.chrome-store-link');
    chromeLinks.forEach(link => {
      link.href = CONFIG.brand.chromeStoreUrl;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  // ── PARTÍCULAS FLOTANTES (ESTILO MYWEB) ──
  function initParticles() {
    const container = dom.particlesContainer || document.getElementById('particles');
    if (!container) return;
    container.textContent = '';
    const count = 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 12 + 8}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(p);
    }
  }

  // ── TEXTO ANIMADO CON GLITCH DE ENCANTAMIENTO (MINECRAFT GALACTIC) ──
  function initTypewriter() {
    const el = dom.typedText || document.getElementById('typed-text');
    if (!el) return;

    const ENCHANT = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const MESSAGES = (CONFIG.enchantMessages && CONFIG.enchantMessages.length)
      ? CONFIG.enchantMessages
      : [
          { lang: 'es', text: 'Analiza lecturas complejas, formula aportes críticos y asegura tu 20/20 con IA académica.' },
          { lang: 'enchant', text: '' },
          { lang: 'es', text: 'Citas nativas con @mención directa a compañeros y simulación de lectura 100% indetectable.' },
          { lang: 'enchant', text: '' }
        ];

    let msgIdx = 0;
    let charIdx = 0;

    function randEnchant(len) {
      let s = '';
      for (let i = 0; i < len; i++) {
        s += ENCHANT[Math.floor(Math.random() * ENCHANT.length)];
      }
      return s;
    }

    function typeNext() {
      const cur = MESSAGES[msgIdx];
      if (cur.lang === 'enchant') {
        glitchPhase();
        return;
      }
      if (charIdx <= cur.text.length) {
        el.textContent = cur.text.slice(0, charIdx);
        charIdx++;
        setTimeout(typeNext, charIdx < 5 ? 55 : 24);
      } else {
        setTimeout(erasePhase, 3500);
      }
    }

    function erasePhase() {
      if (charIdx > 0) {
        charIdx--;
        el.textContent = MESSAGES[msgIdx].text.slice(0, charIdx);
        setTimeout(erasePhase, 10);
      } else {
        msgIdx = (msgIdx + 1) % MESSAGES.length;
        charIdx = 0;
        setTimeout(typeNext, 300);
      }
    }

    function glitchPhase() {
      let rounds = 0;
      const max = 22, startLen = 45;
      el.style.color = '#00e5ff';
      el.style.textShadow = '0 0 10px #00e5ff';
      el.classList.add('is-enchanting');

      (function tick() {
        rounds++;
        const len = Math.max(3, startLen - Math.floor(rounds * 1.8));
        el.textContent = randEnchant(len);
        if (rounds < max) {
          setTimeout(tick, 40 + rounds * 4);
        } else {
          el.textContent = '';
          el.style.color = '';
          el.style.textShadow = '';
          el.classList.remove('is-enchanting');
          msgIdx = (msgIdx + 1) % MESSAGES.length;
          charIdx = 0;
          setTimeout(typeNext, 250);
        }
      })();
    }

    setTimeout(typeNext, 800);
  }

  // ── MÚSICA AMBIENTAL CHILL (ESTILO MYWEB) ──
  let isMusicPlaying = false;
  let userInteractedWithMusic = false;
  let isManuallyMuted = false;

  function toggleMusic(forcePlay = false) {
    const music = dom.bgMusic || document.getElementById('bg-music');
    const musicBtn = dom.musicBtn || document.getElementById('music-toggle');
    const musicIcon = dom.musicIcon || document.getElementById('music-icon');
    const musicWrapper = dom.musicWrapper || document.querySelector('.music-wrapper');
    if (!music || !musicBtn) return;

    if (isMusicPlaying && !forcePlay) {
      music.pause();
      if (musicIcon) musicIcon.textContent = '🔇';
      musicBtn.classList.remove('playing');
      if (musicWrapper) musicWrapper.classList.remove('is-active');
      isMusicPlaying = false;
      isManuallyMuted = true;
    } else {
      music.volume = 0.2;
      music.play().then(() => {
        if (musicIcon) musicIcon.textContent = '🔊';
        musicBtn.classList.add('playing');
        if (musicWrapper) musicWrapper.classList.add('is-active');
        isMusicPlaying = true;
        isManuallyMuted = false;
      }).catch(() => {});
    }
  }

  function initMusic() {
    const music = dom.bgMusic || document.getElementById('bg-music');
    const musicBtn = dom.musicBtn || document.getElementById('music-toggle');
    if (!music || !musicBtn) return;

    music.volume = 0.2;

    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userInteractedWithMusic = true;
      toggleMusic();
    });

    document.body.addEventListener('click', () => {
      if (!userInteractedWithMusic && !isMusicPlaying && !isManuallyMuted) {
        userInteractedWithMusic = true;
        toggleMusic(true);
      }
    }, { once: true });
  }

  // ── BLOQUE MUSICAL INTERACTIVO (PITCH SHIFT & 50 CLICS) ──
  function initNoteBlock() {
    const block = dom.noteBlock || document.getElementById('note-block');
    const noteSound = dom.noteSound || document.getElementById('note-sound');
    if (!block || !noteSound) return;

    noteSound.volume = 0.5;
    noteSound.preservesPitch = false;
    if (noteSound.mozPreservesPitch !== undefined) noteSound.mozPreservesPitch = false;
    if (noteSound.webkitPreservesPitch !== undefined) noteSound.webkitPreservesPitch = false;

    let blockClicks = 0;

    block.addEventListener('click', (e) => {
      e.stopPropagation();
      blockClicks++;

      // Animación de salto
      block.classList.remove('hit');
      void block.offsetWidth;
      block.classList.add('hit');

      // Modificamos velocidad / tono por cada clic (hasta 3.0x)
      let newSpeed = 1.0 + (blockClicks * 0.05);
      if (newSpeed > 3.0) newSpeed = 3.0;
      noteSound.playbackRate = newSpeed;
      noteSound.currentTime = 0;
      noteSound.play().catch(() => {});

      // Easter egg a los 50 clics
      if (blockClicks === 50) {
        if (dom.couponModal) dom.couponModal.classList.add('active');
        blockClicks = 0;
        noteSound.playbackRate = 1.0;
      }

      // Iniciar música si no estaba sonando y no fue silenciada
      if (!isMusicPlaying && !isManuallyMuted) {
        userInteractedWithMusic = true;
        toggleMusic(true);
      }
    });

    if (dom.btnCloseCoupon && dom.couponModal) {
      dom.btnCloseCoupon.addEventListener('click', () => {
        dom.couponModal.classList.remove('active');
      });
      dom.couponModal.addEventListener('click', (e) => {
        if (e.target === dom.couponModal) {
          dom.couponModal.classList.remove('active');
        }
      });
    }
  }



  // ────────────────────────────────────────────────────────────────
  // 3. CAPACIDADES (01, 02, 03, 04)
  // ────────────────────────────────────────────────────────────────
  function renderCapabilities() {
    if (!dom.capabilitiesGrid) return;
    dom.capabilitiesGrid.textContent = '';

    CONFIG.capabilities.forEach(cap => {
      const card = document.createElement('div');
      card.className = 'capability-card';

      const num = document.createElement('div');
      num.className = 'capability-number';
      num.textContent = cap.number;

      const title = document.createElement('h3');
      title.className = 'capability-title';
      title.textContent = cap.title;

      const desc = document.createElement('p');
      desc.className = 'capability-desc';
      desc.textContent = cap.description;

      card.appendChild(num);
      card.appendChild(title);
      card.appendChild(desc);
      dom.capabilitiesGrid.appendChild(card);
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 4. PLANES Y TARIFAS (BASIC, PREMIUM, VIP) CON BLOQUES MINECRAFT
  // ────────────────────────────────────────────────────────────────
  function renderPlans() {
    if (!dom.plansGrid) return;
    dom.plansGrid.textContent = '';

    const currSymbol = (CONFIG.currency && CONFIG.currency.symbol) ? CONFIG.currency.symbol : 'S/.';
    const isCycle = state.billingMode === 'cycle';

    CONFIG.plans.forEach(plan => {
      const card = document.createElement('div');
      card.className = `minimal-plan-card ${plan.isPopular ? 'is-popular' : ''}`;

      const top = document.createElement('div');
      top.className = 'plan-top';

      // Cabecera con bloque pixelado de Minecraft y badge
      const blockWrapper = document.createElement('div');
      blockWrapper.className = 'plan-block-icon-wrapper';

      if (plan.blockAsset) {
        const blockImg = document.createElement('img');
        blockImg.className = 'plan-block-img';
        blockImg.src = plan.blockAsset;
        blockImg.alt = plan.name;
        blockWrapper.appendChild(blockImg);
      }

      const badge = document.createElement('span');
      badge.className = 'plan-badge-tag';
      badge.textContent = plan.badge;
      blockWrapper.appendChild(badge);

      if (plan.limitDaily) {
        const quotaTag = document.createElement('span');
        quotaTag.className = 'plan-badge-tag';
        quotaTag.style.borderColor = 'rgba(85, 255, 85, 0.35)';
        quotaTag.style.color = '#55ff55';
        quotaTag.style.background = 'rgba(85, 255, 85, 0.08)';
        quotaTag.textContent = plan.limitDaily;
        blockWrapper.appendChild(quotaTag);
      }

      const title = document.createElement('h3');
      title.className = 'plan-title';
      title.textContent = `Plan ${plan.name}`;

      const summary = document.createElement('p');
      summary.className = 'plan-summary-text';
      summary.textContent = plan.summary;

      // Fila de precio dinámico según el modo de facturación (Ciclo vs Mes)
      const priceRow = document.createElement('div');
      priceRow.className = 'plan-price-row';

      const currencySpan = document.createElement('span');
      currencySpan.className = 'plan-currency';
      currencySpan.textContent = currSymbol;

      const activePrice = isCycle ? plan.priceCycle : plan.priceMonth;
      const periodLabel = isCycle ? ' / ciclo (4 meses)' : ' / mes';

      const amountSpan = document.createElement('span');
      amountSpan.className = 'plan-amount';
      amountSpan.textContent = activePrice;

      const periodSpan = document.createElement('span');
      periodSpan.className = 'plan-period-label';
      periodSpan.style.fontFamily = 'var(--font-mono)';
      periodSpan.style.fontSize = '0.7rem';
      periodSpan.style.color = 'var(--text-dim)';
      periodSpan.style.marginLeft = '5px';
      periodSpan.textContent = periodLabel;

      priceRow.appendChild(currencySpan);
      priceRow.appendChild(amountSpan);
      priceRow.appendChild(periodSpan);

      top.appendChild(blockWrapper);
      top.appendChild(title);
      top.appendChild(summary);
      top.appendChild(priceRow);
      card.appendChild(top);

      const featList = document.createElement('ul');
      featList.className = 'plan-features';

      plan.features.forEach(feat => {
        const row = document.createElement('li');
        row.className = `plan-feature-row ${feat.included ? '' : 'excluded'}`;

        const icon = document.createElement('i');
        icon.className = `fa-solid ${feat.included ? 'fa-check feat-bullet' : 'fa-xmark feat-bullet excluded'}`;

        const span = document.createElement('span');
        span.textContent = feat.text;

        row.appendChild(icon);
        row.appendChild(span);
        featList.appendChild(row);
      });

      card.appendChild(featList);

      const btn = document.createElement('button');
      btn.className = 'btn-card-action';
      btn.setAttribute('type', 'button');
      btn.textContent = plan.ctaText;

      btn.addEventListener('click', () => {
        openModalForPlan(plan, `${currSymbol} ${activePrice}${periodLabel}`);
      });

      card.appendChild(btn);
      dom.plansGrid.appendChild(card);
    });
  }

  function renderPaymentMethods() {
    if (!dom.paymentMethodsStrip) return;
    dom.paymentMethodsStrip.textContent = '';

    const label = document.createElement('span');
    label.className = 'payment-footer-title';
    label.textContent = 'Medios de Abono Directo:';
    dom.paymentMethodsStrip.appendChild(label);

    CONFIG.paymentMethods.forEach(method => {
      const chip = document.createElement('div');
      chip.className = 'payment-chip';

      if (method.asset) {
        const logoImg = document.createElement('img');
        logoImg.src = method.asset;
        logoImg.alt = method.name;
        logoImg.className = 'payment-chip-logo';
        chip.appendChild(logoImg);
      } else {
        const icon = document.createElement('i');
        icon.className = method.icon;
        icon.style.fontSize = '0.78rem';
        icon.style.color = method.color || 'var(--cyan)';
        chip.appendChild(icon);
      }

      const text = document.createElement('span');
      text.style.fontWeight = '600';
      text.textContent = method.name;

      const note = document.createElement('span');
      note.className = 'payment-chip-note';
      note.textContent = `(${method.note})`;

      chip.appendChild(text);
      chip.appendChild(note);
      dom.paymentMethodsStrip.appendChild(chip);
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 5. TÉRMINOS Y POLÍTICAS (PESTAÑAS ESTILO CLAUDE)
  // ────────────────────────────────────────────────────────────────
  function renderPoliciesTabs() {
    if (!dom.policiesNav) return;
    dom.policiesNav.textContent = '';

    CONFIG.policies.forEach((policy, idx) => {
      const tab = document.createElement('button');
      tab.className = `policy-tab-btn ${idx === state.activePolicyIndex ? 'active' : ''}`;
      tab.setAttribute('type', 'button');
      tab.textContent = policy.title;

      tab.addEventListener('click', () => {
        state.activePolicyIndex = idx;
        renderPoliciesTabs();
        renderPolicyCard(idx);
      });

      dom.policiesNav.appendChild(tab);
    });
  }

  function renderPolicyCard(index) {
    if (!dom.policyCardContainer) return;
    dom.policyCardContainer.textContent = '';

    const policy = CONFIG.policies[index];
    if (!policy) return;

    const header = document.createElement('div');
    header.className = 'policy-card-header';

    const title = document.createElement('h3');
    title.className = 'policy-card-title';
    title.textContent = policy.title;

    const summary = document.createElement('p');
    summary.className = 'policy-card-summary';
    summary.textContent = policy.summary;

    header.appendChild(title);
    header.appendChild(summary);
    dom.policyCardContainer.appendChild(header);

    const clausesList = document.createElement('div');
    clausesList.className = 'policy-clauses-list';

    policy.sections.forEach(sec => {
      const clause = document.createElement('div');
      clause.className = 'clause-item';

      const h4 = document.createElement('h4');
      h4.textContent = sec.heading;

      const p = document.createElement('p');
      p.textContent = sec.body;

      clause.appendChild(h4);
      clause.appendChild(p);
      clausesList.appendChild(clause);
    });

    dom.policyCardContainer.appendChild(clausesList);
  }

  // ────────────────────────────────────────────────────────────────
  // 6. PREGUNTAS FRECUENTES (FAQ ACORDEÓN)
  // ────────────────────────────────────────────────────────────────
  function renderFAQs() {
    if (!dom.faqList) return;
    dom.faqList.textContent = '';

    CONFIG.faqs.forEach((faq, index) => {
      const entry = document.createElement('div');
      entry.className = `faq-entry ${index === 0 ? 'is-open' : ''}`;

      const trigger = document.createElement('div');
      trigger.className = 'faq-trigger';

      const qText = document.createElement('span');
      qText.textContent = faq.q;

      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-chevron-down faq-icon-arrow';

      trigger.appendChild(qText);
      trigger.appendChild(icon);

      const body = document.createElement('div');
      body.className = 'faq-body';
      body.textContent = faq.a;

      trigger.addEventListener('click', () => {
        entry.classList.toggle('is-open');
      });

      entry.appendChild(trigger);
      entry.appendChild(body);
      dom.faqList.appendChild(entry);
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 7. MODAL DE ADQUISICIÓN / CONTACTO
  // ────────────────────────────────────────────────────────────────
  function openModalForPlan(plan, formattedPrice) {
    state.selectedPlan = plan;

    if (CONFIG.backend && CONFIG.backend.enabled) {
      CONFIG.backend.onPlanSelected(plan, state.currentCurrency);
      return;
    }

    dom.modalPlanName.textContent = `Plan ${plan.name}`;
    dom.modalPlanPrice.textContent = formattedPrice;

    if (dom.modalLinkWhatsApp && CONFIG.contacts.whatsapp.enabled) {
      const waMsg = CONFIG.contacts.whatsapp.generateMessage(plan.name, formattedPrice);
      state.copiedText = waMsg;
      dom.modalLinkWhatsApp.href = `${CONFIG.contacts.whatsapp.urlBase}?text=${encodeURIComponent(waMsg)}`;
      dom.modalLinkWhatsApp.setAttribute('target', '_blank');
      dom.modalLinkWhatsApp.setAttribute('rel', 'noopener noreferrer');
    }

    if (dom.modalLinkTelegram && CONFIG.contacts.telegram.enabled) {
      if (CONFIG.contacts.telegram.url.includes('+') || !CONFIG.contacts.telegram.generateMessage) {
        dom.modalLinkTelegram.href = CONFIG.contacts.telegram.url;
      } else {
        const tgMsg = CONFIG.contacts.telegram.generateMessage(plan.name, formattedPrice);
        dom.modalLinkTelegram.href = `${CONFIG.contacts.telegram.url}?text=${encodeURIComponent(tgMsg)}`;
      }
      dom.modalLinkTelegram.setAttribute('target', '_blank');
      dom.modalLinkTelegram.setAttribute('rel', 'noopener noreferrer');
    }

    if (dom.modalLinkDiscord && CONFIG.contacts.discord.enabled) {
      dom.modalLinkDiscord.href = CONFIG.contacts.discord.serverInvite;
      dom.modalLinkDiscord.setAttribute('target', '_blank');
      dom.modalLinkDiscord.setAttribute('rel', 'noopener noreferrer');
    }

    if (dom.modalLinkInstagram && CONFIG.contacts.instagram.enabled) {
      dom.modalLinkInstagram.href = CONFIG.contacts.instagram.profileUrl;
      dom.modalLinkInstagram.setAttribute('target', '_blank');
      dom.modalLinkInstagram.setAttribute('rel', 'noopener noreferrer');
    }

    dom.modalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!dom.modalOverlay) return;
    dom.modalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  async function copyOrderMessage() {
    const textToCopy = state.copiedText || `Deseo adquirir la licencia de Perusall Smart Co-Pilot.`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('Mensaje de pedido copiado al portapapeles.');
    } catch (e) {
      showToast('Mensaje preparado para el chat.');
    }
  }

  function showToast(msg) {
    if (!dom.toastBar || !dom.toastText) return;
    dom.toastText.textContent = msg;
    dom.toastBar.classList.add('visible');
    setTimeout(() => {
      dom.toastBar.classList.remove('visible');
    }, 3200);
  }

  // ────────────────────────────────────────────────────────────────
  // 8. EVENTOS GLOBALES
  // ────────────────────────────────────────────────────────────────
  function bindEvents() {
    // Alternar modo de facturación: Ciclo vs Mes
    if (dom.btnBillCycle) {
      dom.btnBillCycle.addEventListener('click', () => {
        if (state.billingMode === 'cycle') return;
        state.billingMode = 'cycle';
        dom.btnBillCycle.classList.add('active');
        if (dom.btnBillMonth) dom.btnBillMonth.classList.remove('active');
        renderPlans();
        sfx.playPop();
      });
    }

    if (dom.btnBillMonth) {
      dom.btnBillMonth.addEventListener('click', () => {
        if (state.billingMode === 'month') return;
        state.billingMode = 'month';
        dom.btnBillMonth.classList.add('active');
        if (dom.btnBillCycle) dom.btnBillCycle.classList.remove('active');
        renderPlans();
        sfx.playPop();
      });
    }

    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener('click', closeModal);
    }

    if (dom.modalOverlay) {
      dom.modalOverlay.addEventListener('click', (e) => {
        if (e.target === dom.modalOverlay) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    if (dom.btnCopyOrder) {
      dom.btnCopyOrder.addEventListener('click', copyOrderMessage);
    }
  }

  init();
});
