import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/i18n.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="top-nav">
      <div class="nav-inner">
        <div class="nav-brand">
          <svg viewBox="0 0 100 100" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="pg" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#059669"/></linearGradient><linearGradient id="pb" x1=".7" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient></defs>
            <circle cx="30" cy="8" r="7" fill="url(#pg)"/><path d="M30 15C6 28 4 72 40 84" stroke="url(#pg)" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M40 84L24 80 30 68" stroke="url(#pg)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="70" cy="8" r="7" fill="url(#pb)"/><path d="M70 15C94 28 96 72 60 84" stroke="url(#pb)" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M60 84L76 80 70 68" stroke="url(#pb)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="50" cy="46" r="26" fill="white"/><line x1="50" y1="46" x2="50" y2="30" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="46" x2="63" y2="40" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="46" r="2.5" fill="#0f172a"/>
          </svg>
          <span><em>in</em>Out</span>
        </div>
        <div class="nav-links">
          <a href="#features">{{ i18n.t('land.nav_feat') }}</a>
          <a href="#pricing">{{ i18n.t('land.nav_price') }}</a>
          <div class="lang-toggle">
            <button [class.on]="i18n.lang()==='en'" (click)="i18n.setLang('en')">EN</button>
            <button [class.on]="i18n.lang()==='ko'" (click)="i18n.setLang('ko')">한국어</button>
          </div>
          <a routerLink="/login" class="btn-login">{{ i18n.t('land.nav_login') }}</a>
          <a routerLink="/register" class="btn-cta-sm">{{ i18n.t('land.nav_free') }}</a>
        </div>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-blobs">
        <div class="blob b1"></div>
        <div class="blob b2"></div>
        <div class="blob b3"></div>
      </div>
      <div class="hero-inner">
        <span class="hero-badge">{{ i18n.t('land.badge') }}</span>
        <h1>{{ i18n.t('land.hero_title1') }}<br><em>{{ i18n.t('land.hero_title2') }}</em>{{ i18n.t('land.hero_title3') }}</h1>
        <p>{{ i18n.t('land.hero_desc') }}</p>
        <div class="hero-actions">
          <a routerLink="/register" class="btn-cta">{{ i18n.t('land.hero_cta') }}</a>
          <a routerLink="/scan" class="btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            {{ i18n.t('land.hero_app') }}
          </a>
        </div>
      </div>

      <!-- Mockups: Laptop + Phone -->
      <div class="hero-devices">
        <!-- Laptop showing dashboard -->
        <div class="laptop">
          <div class="laptop-top">
            <div class="lt-dots"><span></span><span></span><span></span></div>
            <div class="lt-url">inout.app/dashboard</div>
          </div>
          <div class="lt-body">
            <div class="lt-sidebar">
              <div class="lt-logo"><em>in</em>Out</div>
              <div class="lt-menu"><span class="lt-active"></span><span></span><span></span><span></span></div>
            </div>
            <div class="lt-main">
              <div class="lt-cards">
                <div class="lt-card"><small>Employees</small><b>25</b></div>
                <div class="lt-card c2"><small>Checked In</small><b>21</b></div>
                <div class="lt-card c3"><small>Late</small><b>2</b></div>
                <div class="lt-card c4"><small>Absent</small><b>2</b></div>
              </div>
              <div class="lt-panels">
                <div class="lt-chart">
                  <div class="lt-donut"><span>84%</span></div>
                </div>
                <div class="lt-activity">
                  <div class="lt-row"><div class="lt-av">S</div><div class="lt-txt"><b>Sarah Kim</b><em>Check-in 08:58</em></div></div>
                  <div class="lt-row"><div class="lt-av">D</div><div class="lt-txt"><b>David Lee</b><em>Check-in 09:01</em></div></div>
                  <div class="lt-row"><div class="lt-av">E</div><div class="lt-txt"><b>Emma Park</b><em>Late 09:17</em></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Phone showing scan app -->
        <div class="phone">
          <div class="phone-notch"></div>
          <div class="phone-header"><em>in</em>Out</div>
          <div class="phone-clock">09:00</div>
          <div class="phone-user">
            <div class="pu-av">S</div>
            <div><b>Sarah Kim</b><span>Manager</span></div>
          </div>
          <div class="phone-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            {{ i18n.t('land.phone_scan') }}
          </div>
          <div class="phone-status">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="3" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
            Checked In · 09:00:12
          </div>
        </div>
      </div>
    </section>

    <!-- How it works — with mini mockups -->
    <section class="how" id="how">
      <h2>{{ i18n.t('land.how_title') }}</h2>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-mockup blue-bg">
            <div class="sm-form"><div class="sm-avatar-circle">+</div><div class="sm-input"></div><div class="sm-input short"></div><div class="sm-btn"></div></div>
          </div>
          <h3>{{ i18n.t('land.how1_title') }}</h3><p>{{ i18n.t('land.how1_desc') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-mockup violet-bg">
            <div class="sm-qr"><div class="qr-grid"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="qr-label">SCAN ME</div></div>
          </div>
          <h3>{{ i18n.t('land.how2_title') }}</h3><p>{{ i18n.t('land.how2_desc') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-mockup green-bg">
            <div class="sm-phone"><div class="smp-cam"></div><div class="smp-frame"></div><div class="smp-text">✓</div></div>
          </div>
          <h3>{{ i18n.t('land.how3_title') }}</h3><p>{{ i18n.t('land.how3_desc') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-num">4</div>
          <div class="step-mockup orange-bg">
            <div class="sm-report"><div class="smr-bar b1"></div><div class="smr-bar b2"></div><div class="smr-bar b3"></div><div class="smr-bar b4"></div><div class="smr-line"></div></div>
          </div>
          <h3>{{ i18n.t('land.how4_title') }}</h3><p>{{ i18n.t('land.how4_desc') }}</p>
        </div>
      </div>
    </section>

    <!-- Features — with screenshot mockups -->
    <section class="features" id="features">
      <h2>{{ i18n.t('land.feat_title') }}</h2>
      <p class="features-sub">{{ i18n.t('land.feat_sub') }}</p>
      <div class="features-grid">
        <div class="feat">
          <div class="feat-preview fp-scan">
            <div class="fps-phone"><div class="fps-notch"></div><div class="fps-qr"><span></span><span></span><span></span><span></span></div><div class="fps-btn">SCAN</div></div>
          </div>
          <h3>{{ i18n.t('land.f1') }}</h3><p>{{ i18n.t('land.f1d') }}</p>
        </div>
        <div class="feat">
          <div class="feat-preview fp-dash">
            <div class="fpd-cards"><div class="fpd-c"><b>25</b></div><div class="fpd-c g"><b>21</b></div><div class="fpd-c o"><b>2</b></div></div>
            <div class="fpd-chart"><div class="fpd-donut"></div></div>
          </div>
          <h3>{{ i18n.t('land.f2') }}</h3><p>{{ i18n.t('land.f2d') }}</p>
        </div>
        <div class="feat">
          <div class="feat-preview fp-report">
            <div class="fpr-header"></div>
            <div class="fpr-row"><span></span><span class="fpr-val"></span></div>
            <div class="fpr-row"><span></span><span class="fpr-val"></span></div>
            <div class="fpr-row"><span></span><span class="fpr-val"></span></div>
            <div class="fpr-btns"><div class="fpr-b green">Excel</div><div class="fpr-b red">PDF</div></div>
          </div>
          <h3>{{ i18n.t('land.f3') }}</h3><p>{{ i18n.t('land.f3d') }}</p>
        </div>
        <div class="feat">
          <div class="feat-preview fp-emp">
            <div class="fpe-row"><div class="fpe-av" style="background:#6366f1">S</div><div class="fpe-info"><b></b><span></span></div></div>
            <div class="fpe-row"><div class="fpe-av" style="background:#8b5cf6">D</div><div class="fpe-info"><b></b><span></span></div></div>
            <div class="fpe-row"><div class="fpe-av" style="background:#a855f7">E</div><div class="fpe-info"><b></b><span></span></div></div>
          </div>
          <h3>{{ i18n.t('land.f4') }}</h3><p>{{ i18n.t('land.f4d') }}</p>
        </div>
        <div class="feat">
          <div class="feat-preview fp-sched">
            <div class="fps-days"><span class="on">M</span><span class="on">T</span><span class="on">W</span><span class="on">T</span><span class="on">F</span><span>S</span><span>S</span></div>
            <div class="fps-shift"><div class="fps-bar"></div><span>09:00 – 18:00</span></div>
            <div class="fps-shift"><div class="fps-bar eve"></div><span>14:00 – 22:00</span></div>
          </div>
          <h3>{{ i18n.t('land.f5') }}</h3><p>{{ i18n.t('land.f5d') }}</p>
        </div>
        <div class="feat">
          <div class="feat-preview fp-multi">
            <div class="fpm-laptop"><div class="fpm-screen"><div class="fpm-side"></div><div class="fpm-main"><div class="fpm-c"></div><div class="fpm-c"></div></div></div></div>
            <div class="fpm-phone"><div class="fpm-ps"></div><div class="fpm-ps"></div></div>
          </div>
          <h3>{{ i18n.t('land.f6') }}</h3><p>{{ i18n.t('land.f6d') }}</p>
        </div>
      </div>
    </section>

    <section class="download" id="download">
      <div class="download-inner">
        <div class="download-text">
          <h2>{{ i18n.t('land.dl_title') }}</h2>
          <p>{{ i18n.t('land.dl_desc') }}</p>
          <a routerLink="/scan" class="btn-cta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {{ i18n.t('land.dl_btn') }}
          </a>
          <span class="download-hint">{{ i18n.t('land.dl_hint') }}</span>
        </div>
        <div class="download-mockup">
          <div class="mini-phone">
            <div class="mp-brand"><em>in</em>Out</div>
            <div class="mp-time">09:00</div>
            <div class="mp-card">Sarah Kim</div>
            <div class="mp-card">David Lee</div>
            <div class="mp-btn">{{ i18n.t('land.qr_scan') }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="pricing" id="pricing">
      <h2>{{ i18n.t('land.price_title') }}</h2>
      <p class="features-sub">{{ i18n.t('land.price_sub') }}</p>
      <div class="price-grid">
        <div class="price-card"><h3>Free</h3><div class="price-amount"><strong>₩0</strong><span>{{ i18n.t('land.price_mo') }}</span></div><ul><li>{{ i18n.t('land.p1_1') }}</li><li>{{ i18n.t('land.p1_2') }}</li><li>{{ i18n.t('land.p1_3') }}</li><li>{{ i18n.t('land.p1_4') }}</li></ul><a routerLink="/register" class="btn-outline">{{ i18n.t('land.price_free') }}</a></div>
        <div class="price-card"><h3>Starter</h3><div class="price-amount"><strong>₩9,900</strong><span>{{ i18n.t('land.price_mo') }}</span></div><ul><li>{{ i18n.t('land.p2_1') }}</li><li>{{ i18n.t('land.p2_2') }}</li><li>{{ i18n.t('land.p2_3') }}</li><li>{{ i18n.t('land.p2_4') }}</li></ul><a routerLink="/register" class="btn-outline">{{ i18n.t('land.price_trial') }}</a></div>
        <div class="price-card popular"><div class="pop-badge">{{ i18n.t('land.p_pop') }}</div><h3>Business</h3><div class="price-amount"><strong>₩29,000</strong><span>{{ i18n.t('land.price_mo') }}</span></div><ul><li>{{ i18n.t('land.p3_1') }}</li><li>{{ i18n.t('land.p3_2') }}</li><li>{{ i18n.t('land.p3_3') }}</li><li>{{ i18n.t('land.p3_4') }}</li></ul><a routerLink="/register" class="btn-cta">{{ i18n.t('land.price_trial') }}</a></div>
        <div class="price-card"><h3>Pro</h3><div class="price-amount"><strong>₩59,000</strong><span>{{ i18n.t('land.price_mo') }}</span></div><ul><li>{{ i18n.t('land.p4_1') }}</li><li>{{ i18n.t('land.p4_2') }}</li><li>{{ i18n.t('land.p4_3') }}</li><li>{{ i18n.t('land.p4_4') }}</li></ul><a routerLink="/register" class="btn-outline">{{ i18n.t('land.price_contact') }}</a></div>
      </div>
    </section>

    <footer>
      <div class="footer-inner">
        <div class="footer-brand"><span><em>in</em>Out</span><p>TIME IN. WORK OUT.</p></div>
        <div class="footer-links">
          <a routerLink="/register">{{ i18n.t('land.footer_signup') }}</a>
          <a routerLink="/login">{{ i18n.t('land.footer_login') }}</a>
          <a routerLink="/scan">{{ i18n.t('land.footer_app') }}</a>
        </div>
      </div>
      <p class="footer-copy">© 2026 InOut. All rights reserved.</p>
    </footer>
  `,
  styles: `
    :host { display: block; font-family: Inter, -apple-system, Arial, sans-serif; color: #0f172a; }
    .top-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.04); }
    .nav-inner { max-width: 1100px; margin: 0 auto; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    .nav-brand { display: flex; align-items: center; gap: 10px; }
    .nav-brand span { font-size: 22px; font-weight: 800; color: #1e1b4b; }
    .nav-brand em { font-style: normal; color: #6366f1; }
    .nav-links { display: flex; gap: 6px; align-items: center; }
    .nav-links > a { text-decoration: none; color: #64748b; font-weight: 500; font-size: 14px; padding: 8px 14px; border-radius: 8px; }
    .nav-links > a:hover { color: #1e1b4b; }
    .btn-login { color: #4f46e5 !important; font-weight: 600 !important; }
    .btn-cta-sm { background: #6366f1 !important; color: white !important; font-weight: 700 !important; border-radius: 10px !important; }
    .lang-toggle { display: flex; gap: 2px; background: #f1f5f9; border-radius: 8px; padding: 2px; }
    .lang-toggle button { border: none; background: none; padding: 5px 10px; font-size: 12px; font-weight: 600; color: #94a3b8; border-radius: 6px; cursor: pointer; }
    .lang-toggle button.on { background: white; color: #4f46e5; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
    .hero { background: linear-gradient(160deg, #1e1b4b 0%, #312e81 30%, #4338ca 70%, #6366f1 100%); color: white; padding: 110px 24px 60px; text-align: center; overflow: hidden; position: relative; }
    .hero-inner { max-width: 600px; margin: 0 auto; }
    .hero-badge { display: inline-block; background: rgba(165,180,252,0.15); color: #c7d2fe; font-size: 13px; font-weight: 600; padding: 6px 18px; border-radius: 20px; margin-bottom: 24px; border: 1px solid rgba(165,180,252,0.2); }
    .hero h1 { font-size: 44px; margin: 0 0 16px; line-height: 1.2; letter-spacing: -1px; }
    .hero h1 em { font-style: normal; background: linear-gradient(135deg, #a5b4fc, #c4b5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero p { color: #a5b4fc; font-size: 17px; line-height: 1.7; margin: 0 0 32px; }
    .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn-cta { text-decoration: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 14px; display: inline-flex; align-items: center; gap: 8px; transition: opacity 0.2s; box-shadow: 0 4px 20px rgba(99,102,241,0.3); }
    .btn-cta:hover { opacity: 0.9; }
    .btn-ghost { text-decoration: none; color: #c7d2fe; font-weight: 600; font-size: 15px; padding: 14px 24px; border: 1px solid rgba(165,180,252,0.25); border-radius: 14px; display: inline-flex; align-items: center; gap: 8px; }
    .btn-ghost:hover { background: rgba(255,255,255,0.05); }

    /* Blobs */
    .hero-blobs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
    .b1 { width: 400px; height: 400px; background: #818cf8; top: -100px; left: -100px; animation: float 8s ease-in-out infinite; }
    .b2 { width: 300px; height: 300px; background: #c084fc; bottom: -50px; right: -50px; animation: float 6s ease-in-out infinite reverse; }
    .b3 { width: 200px; height: 200px; background: #22d3ee; top: 40%; left: 60%; animation: float 10s ease-in-out infinite; }
    @keyframes float { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-20px); } }

    /* Devices */
    .hero-devices { display: flex; justify-content: center; align-items: flex-end; gap: 24px; margin-top: 48px; position: relative; z-index: 1; }

    /* Laptop mockup */
    .laptop { width: 520px; background: #1a1a2e; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); }
    .laptop-top { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #111827; }
    .lt-dots { display: flex; gap: 5px; }
    .lt-dots span { width: 8px; height: 8px; border-radius: 50%; }
    .lt-dots span:nth-child(1) { background: #ef4444; }
    .lt-dots span:nth-child(2) { background: #f59e0b; }
    .lt-dots span:nth-child(3) { background: #22c55e; }
    .lt-url { flex: 1; text-align: center; font-size: 10px; color: #64748b; background: #1e293b; padding: 3px 12px; border-radius: 4px; }
    .lt-body { display: flex; height: 260px; }
    .lt-sidebar { width: 100px; background: #0f172a; padding: 14px 10px; }
    .lt-logo { font-size: 13px; font-weight: 800; margin-bottom: 16px; }
    .lt-logo em { font-style: normal; color: #818cf8; }
    .lt-menu { display: grid; gap: 6px; }
    .lt-menu span { display: block; height: 28px; border-radius: 6px; background: rgba(255,255,255,0.04); }
    .lt-active { background: rgba(99,102,241,0.3) !important; }
    .lt-main { flex: 1; background: #f1f5f9; padding: 14px; overflow: hidden; }
    .lt-cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; margin-bottom: 10px; }
    .lt-card { background: white; border-radius: 8px; padding: 8px; text-align: center; }
    .lt-card small { font-size: 7px; color: #64748b; display: block; }
    .lt-card b { font-size: 18px; color: #0f172a; display: block; margin-top: 2px; }
    .lt-card.c2 b { color: #059669; }
    .lt-card.c3 b { color: #f59e0b; }
    .lt-card.c4 b { color: #ef4444; }
    .lt-panels { display: grid; grid-template-columns: 1fr 1.4fr; gap: 8px; }
    .lt-chart { background: white; border-radius: 8px; padding: 12px; display: grid; place-items: center; }
    .lt-donut { width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#6366f1 84%, #e2e8f0 0); display: grid; place-items: center; position: relative; }
    .lt-donut::after { content: ''; width: 56px; height: 56px; border-radius: 50%; background: white; position: absolute; }
    .lt-donut span { position: relative; z-index: 1; font-size: 16px; font-weight: 800; color: #0f172a; }
    .lt-activity { background: white; border-radius: 8px; padding: 10px; }
    .lt-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
    .lt-row:last-child { border: none; }
    .lt-av { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; display: grid; place-items: center; font-size: 9px; font-weight: 700; }
    .lt-txt b { display: block; font-size: 9px; color: #0f172a; }
    .lt-txt em { font-style: normal; font-size: 8px; color: #64748b; }

    /* Phone mockup */
    .phone { width: 190px; background: rgba(15,23,42,0.9); border-radius: 28px; padding: 12px 16px 20px; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; backdrop-filter: blur(10px); flex-shrink: 0; }
    .phone-notch { width: 60px; height: 6px; background: #1e293b; border-radius: 10px; margin: 0 auto 14px; }
    .phone-header { font-size: 16px; font-weight: 800; margin-bottom: 10px; }
    .phone-header em { font-style: normal; color: #a5b4fc; }
    .phone-clock { font-size: 28px; font-weight: 800; color: #c4b5fd; margin-bottom: 12px; font-variant-numeric: tabular-nums; }
    .phone-user { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.06); border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; text-align: left; }
    .pu-av { width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: grid; place-items: center; font-size: 13px; font-weight: 700; }
    .phone-user b { display: block; font-size: 13px; }
    .phone-user span { font-size: 10px; color: #a5b4fc; }
    .phone-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 12px; border-radius: 12px; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 10px; }
    .phone-status { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 10px; color: #4ade80; font-weight: 600; background: rgba(74,222,128,0.1); padding: 8px; border-radius: 10px; }

    .how { padding: 80px 24px; max-width: 1100px; margin: 0 auto; text-align: center; }
    .how h2 { font-size: 32px; margin: 0 0 48px; }
    .steps { display: flex; align-items: flex-start; justify-content: center; gap: 16px; flex-wrap: wrap; }
    .step { width: 220px; text-align: center; position: relative; }
    .step-num { position: absolute; top: -8px; right: calc(50% - 60px); width: 24px; height: 24px; border-radius: 50%; background: #6366f1; color: white; font-size: 12px; font-weight: 800; display: grid; place-items: center; z-index: 2; }
    .step h3 { margin: 0 0 6px; font-size: 15px; }
    .step p { margin: 0; color: #64748b; font-size: 13px; line-height: 1.5; }
    .step-arrow { color: #c7d2fe; font-size: 24px; margin-top: 60px; }

    /* Step mockups */
    .step-mockup { width: 160px; height: 120px; border-radius: 16px; margin: 0 auto 16px; display: grid; place-items: center; overflow: hidden; }
    .blue-bg { background: linear-gradient(135deg, #eef2ff, #e0e7ff); }
    .violet-bg { background: linear-gradient(135deg, #f5f3ff, #ede9fe); }
    .green-bg { background: linear-gradient(135deg, #ecfdf5, #d1fae5); }
    .orange-bg { background: linear-gradient(135deg, #fff7ed, #fed7aa); }

    .sm-form { display: grid; gap: 6px; width: 100px; }
    .sm-avatar-circle { width: 36px; height: 36px; border-radius: 50%; background: #c7d2fe; display: grid; place-items: center; font-size: 18px; color: #6366f1; font-weight: 700; margin: 0 auto; }
    .sm-input { height: 10px; background: white; border-radius: 4px; }
    .sm-input.short { width: 70%; }
    .sm-btn { height: 14px; background: #6366f1; border-radius: 4px; }

    .sm-qr { text-align: center; }
    .qr-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 3px; width: 60px; margin: 0 auto; }
    .qr-grid span { width: 18px; height: 18px; border-radius: 3px; background: #1e1b4b; }
    .qr-grid span:nth-child(5) { background: white; }
    .qr-grid span:nth-child(2) { background: #6366f1; }
    .qr-grid span:nth-child(8) { background: #6366f1; }
    .qr-label { font-size: 8px; font-weight: 800; color: #7c3aed; margin-top: 6px; letter-spacing: 2px; }

    .sm-phone { text-align: center; }
    .smp-cam { width: 40px; height: 40px; border: 3px solid #059669; border-radius: 8px; margin: 0 auto 6px; }
    .smp-frame { width: 24px; height: 24px; border: 2px dashed #10b981; margin: -34px auto 0; border-radius: 4px; }
    .smp-text { font-size: 24px; font-weight: 800; color: #059669; margin-top: 14px; }

    .sm-report { display: flex; align-items: flex-end; gap: 6px; height: 70px; padding: 0 10px; position: relative; }
    .smr-bar { width: 18px; border-radius: 4px 4px 0 0; }
    .smr-bar.b1 { height: 45px; background: #6366f1; }
    .smr-bar.b2 { height: 60px; background: #8b5cf6; }
    .smr-bar.b3 { height: 35px; background: #a855f7; }
    .smr-bar.b4 { height: 50px; background: #c084fc; }
    .smr-line { position: absolute; bottom: 0; left: 10px; right: 10px; height: 1px; background: #fed7aa; }
    .features { padding: 80px 24px; background: #f8fafc; text-align: center; }
    .features h2 { font-size: 32px; margin: 0 0 8px; }
    .features-sub { color: #64748b; margin: 0 0 40px; }
    .features-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: left; }
    .feat { background: white; border-radius: 20px; padding: 0; border: 1px solid #f1f5f9; transition: all 0.2s; overflow: hidden; }
    .feat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
    .feat h3 { margin: 0 0 8px; font-size: 16px; padding: 0 24px; }
    .feat p { margin: 0 0 24px; color: #64748b; font-size: 14px; line-height: 1.6; padding: 0 24px; }

    /* Feature preview mockups */
    .feat-preview { height: 160px; margin-bottom: 18px; display: flex; align-items: center; justify-content: center; overflow: hidden; }

    .fp-scan { background: linear-gradient(135deg, #eef2ff, #e0e7ff); }
    .fps-phone { width: 90px; background: #1e1b4b; border-radius: 14px; padding: 8px 10px; text-align: center; }
    .fps-notch { width: 30px; height: 4px; background: #312e81; border-radius: 4px; margin: 0 auto 8px; }
    .fps-qr { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; width: 40px; margin: 0 auto 8px; }
    .fps-qr span { height: 18px; border-radius: 3px; background: white; }
    .fps-btn { background: #6366f1; padding: 5px; border-radius: 6px; font-size: 8px; font-weight: 800; color: white; }

    .fp-dash { background: linear-gradient(135deg, #f5f3ff, #ede9fe); padding: 16px; flex-direction: column; gap: 8px; }
    .fpd-cards { display: flex; gap: 4px; }
    .fpd-c { background: white; border-radius: 8px; padding: 6px 10px; text-align: center; }
    .fpd-c b { font-size: 16px; color: #1e1b4b; }
    .fpd-c.g b { color: #059669; }
    .fpd-c.o b { color: #f59e0b; }
    .fpd-chart { }
    .fpd-donut { width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(#6366f1 84%, #e2e8f0 0); margin: 0 auto; position: relative; }
    .fpd-donut::after { content: '84%'; position: absolute; inset: 8px; background: white; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 800; color: #1e1b4b; }

    .fp-report { background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 16px; flex-direction: column; gap: 6px; align-items: stretch; }
    .fpr-header { height: 10px; width: 60%; background: #92400e; border-radius: 3px; opacity: 0.3; }
    .fpr-row { display: flex; justify-content: space-between; align-items: center; }
    .fpr-row span { height: 8px; background: white; border-radius: 3px; }
    .fpr-row span:first-child { width: 50%; }
    .fpr-val { width: 20% !important; }
    .fpr-btns { display: flex; gap: 4px; margin-top: 4px; }
    .fpr-b { padding: 4px 10px; border-radius: 4px; font-size: 8px; font-weight: 800; color: white; }
    .fpr-b.green { background: #059669; }
    .fpr-b.red { background: #dc2626; }

    .fp-emp { background: linear-gradient(135deg, #fce7f3, #fbcfe8); padding: 16px; flex-direction: column; gap: 6px; }
    .fpe-row { display: flex; align-items: center; gap: 8px; background: white; padding: 8px 10px; border-radius: 10px; width: 140px; }
    .fpe-av { width: 26px; height: 26px; border-radius: 50%; color: white; display: grid; place-items: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
    .fpe-info b { display: block; width: 50px; height: 6px; background: #1e1b4b; border-radius: 2px; opacity: 0.2; margin-bottom: 3px; }
    .fpe-info span { display: block; width: 30px; height: 5px; background: #6366f1; border-radius: 2px; opacity: 0.2; }

    .fp-sched { background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 16px; flex-direction: column; gap: 8px; }
    .fps-days { display: flex; gap: 4px; }
    .fps-days span { width: 20px; height: 20px; border-radius: 6px; background: white; display: grid; place-items: center; font-size: 8px; font-weight: 700; color: #94a3b8; }
    .fps-days span.on { background: #059669; color: white; }
    .fps-shift { display: flex; align-items: center; gap: 6px; }
    .fps-shift span { font-size: 9px; color: #064e3b; font-weight: 600; }
    .fps-bar { width: 60px; height: 10px; border-radius: 4px; background: linear-gradient(90deg, #10b981, #34d399); }
    .fps-bar.eve { background: linear-gradient(90deg, #6366f1, #818cf8); }

    .fp-multi { background: linear-gradient(135deg, #e0f2fe, #bae6fd); padding: 16px; gap: 10px; }
    .fpm-laptop { width: 100px; background: #0f172a; border-radius: 6px; padding: 4px; }
    .fpm-screen { display: flex; height: 56px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
    .fpm-side { width: 20px; background: #1e293b; }
    .fpm-main { flex: 1; padding: 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
    .fpm-c { background: white; border-radius: 3px; }
    .fpm-phone { width: 36px; background: #0f172a; border-radius: 8px; padding: 4px; }
    .fpm-ps { height: 16px; background: rgba(99,102,241,0.3); border-radius: 4px; margin-bottom: 3px; }
    .download { padding: 80px 24px; }
    .download-inner { max-width: 900px; margin: 0 auto; display: flex; align-items: center; gap: 48px; background: linear-gradient(135deg, #312e81, #4338ca); border-radius: 28px; padding: 48px; color: white; }
    .download-text { flex: 1; }
    .download-text h2 { margin: 0 0 12px; font-size: 28px; }
    .download-text p { color: #c7d2fe; margin: 0 0 24px; line-height: 1.7; }
    .download-text .btn-cta { background: white; color: #4338ca; box-shadow: none; }
    .download-hint { display: block; margin-top: 16px; font-size: 12px; color: #a5b4fc; }
    .download-mockup { flex-shrink: 0; }
    .mini-phone { width: 180px; padding: 20px 16px; background: rgba(255,255,255,0.1); border-radius: 24px; border: 1px solid rgba(255,255,255,0.15); text-align: center; }
    .mp-brand { font-size: 16px; font-weight: 800; margin-bottom: 10px; }
    .mp-brand em { font-style: normal; color: #a5b4fc; }
    .mp-time { font-size: 28px; font-weight: 800; color: #c4b5fd; margin-bottom: 14px; }
    .mp-card { background: rgba(255,255,255,0.08); padding: 10px; border-radius: 10px; font-size: 13px; margin-bottom: 6px; }
    .mp-btn { background: #6366f1; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 700; margin-top: 10px; }
    .pricing { padding: 80px 24px; background: #f8fafc; text-align: center; }
    .pricing h2 { font-size: 32px; margin: 0 0 8px; }
    .price-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .price-card { background: white; border-radius: 20px; padding: 32px 24px; border: 2px solid transparent; text-align: left; position: relative; transition: all 0.2s; }
    .price-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
    .price-card.popular { border-color: #6366f1; }
    .pop-badge { position: absolute; top: -10px; right: 16px; background: #6366f1; color: white; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; }
    .price-card h3 { margin: 0 0 8px; font-size: 18px; }
    .price-amount strong { font-size: 28px; } .price-amount span { font-size: 14px; color: #64748b; }
    .price-card ul { list-style: none; padding: 0; margin: 20px 0; }
    .price-card li { padding: 6px 0; font-size: 14px; color: #475569; }
    .price-card li::before { content: '✓  '; color: #6366f1; font-weight: 700; }
    .btn-outline { display: block; text-align: center; text-decoration: none; border: 2px solid #6366f1; color: #4f46e5; font-weight: 700; font-size: 14px; padding: 10px; border-radius: 12px; transition: all 0.2s; }
    .btn-outline:hover { background: #eef2ff; }
    .price-card .btn-cta { display: block; text-align: center; padding: 12px; font-size: 14px; box-shadow: none; }
    footer { background: #0f172a; color: white; padding: 48px 24px 24px; }
    .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .footer-brand span { font-size: 24px; font-weight: 800; }
    .footer-brand em { font-style: normal; color: #818cf8; }
    .footer-brand p { color: #475569; font-size: 12px; letter-spacing: 2px; margin: 4px 0 0; }
    .footer-links { display: flex; gap: 20px; }
    .footer-links a { color: #94a3b8; text-decoration: none; font-size: 14px; }
    .footer-links a:hover { color: white; }
    .footer-copy { text-align: center; color: #475569; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 20px; margin: 0; }
    @media (max-width: 768px) {
      .hero h1 { font-size: 32px; }
      .hero p { font-size: 15px; }
      .hero-actions { flex-direction: column; align-items: center; }
      .steps { flex-direction: column; align-items: center; }
      .step-arrow { transform: rotate(90deg); margin: 0; }
      .features-grid { grid-template-columns: 1fr; }
      .download-inner { flex-direction: column; padding: 32px; text-align: center; }
      .price-grid { grid-template-columns: 1fr; max-width: 360px; }
      .footer-inner { flex-direction: column; gap: 16px; text-align: center; }
      .nav-links > a:not(.btn-cta-sm):not(.btn-login) { display: none; }
      .lang-toggle { display: flex !important; }
      .hero-devices { flex-direction: column; align-items: center; }
      .laptop { width: 100%; max-width: 400px; }
      .lt-cards { grid-template-columns: repeat(2,1fr); }
      .lt-panels { grid-template-columns: 1fr; }
      .phone { width: 200px; }
    }
    @media (max-width: 1024px) {
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .price-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `,
})
export class LandingComponent {
  constructor(readonly i18n: I18nService) {}
}
