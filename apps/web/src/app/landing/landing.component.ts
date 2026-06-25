import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Nav -->
    <nav class="top-nav">
      <div class="nav-inner">
        <div class="nav-brand">
          <svg viewBox="0 0 100 100" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="pg" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#059669"/></linearGradient><linearGradient id="pb" x1=".7" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient></defs>
            <circle cx="30" cy="8" r="7" fill="url(#pg)"/><path d="M30 15C6 28 4 72 40 84" stroke="url(#pg)" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M40 84L24 80 30 68" stroke="url(#pg)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="70" cy="8" r="7" fill="url(#pb)"/><path d="M70 15C94 28 96 72 60 84" stroke="url(#pb)" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M60 84L76 80 70 68" stroke="url(#pb)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="50" cy="46" r="26" fill="white"/><line x1="50" y1="46" x2="50" y2="30" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="46" x2="63" y2="40" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="46" r="2.5" fill="#0f172a"/>
          </svg>
          <span><em>in</em>Out</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login" class="btn-login">Sign In</a>
          <a routerLink="/register" class="btn-cta-sm">Start Free</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <span class="hero-badge">Smart Attendance System</span>
        <h1>TIME <em>IN</em>. WORK <em>OUT</em>.</h1>
        <p>ระบบบันทึกเวลาเข้า-ออกงานอัจฉริยะ สำหรับธุรกิจทุกขนาด<br>QR Check-in, GPS, รายงานแบบเรียลไทม์</p>
        <div class="hero-actions">
          <a routerLink="/register" class="btn-cta">เริ่มใช้งานฟรี</a>
          <a href="#features" class="btn-ghost">ดูฟีเจอร์</a>
        </div>
        <div class="hero-stats">
          <div><strong>QR</strong><span>Check-in</span></div>
          <div class="sep"></div>
          <div><strong>GPS</strong><span>Verify</span></div>
          <div class="sep"></div>
          <div><strong>Real-time</strong><span>Dashboard</span></div>
          <div class="sep"></div>
          <div><strong>Export</strong><span>CSV / PDF</span></div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features">
      <h2>Everything you need</h2>
      <p class="features-sub">ครบทุกฟังก์ชันในระบบเดียว</p>
      <div class="features-grid">
        <div class="feat">
          <div class="feat-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></div>
          <h3>QR Check-in / Check-out</h3>
          <p>พนักงานสแกน QR Code ด้วยมือถือ เข้า-ออกงานง่ายใน 3 วินาที</p>
        </div>
        <div class="feat">
          <div class="feat-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div>
          <h3>Real-time Dashboard</h3>
          <p>ดูภาพรวมแบบเรียลไทม์ จำนวนเข้างาน สาย ขาด ทั้งหมด</p>
        </div>
        <div class="feat">
          <div class="feat-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <h3>Employee Management</h3>
          <p>เพิ่ม แก้ไข จัดการพนักงานทั้งหมดในที่เดียว</p>
        </div>
        <div class="feat">
          <div class="feat-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <h3>Reports & Export</h3>
          <p>รายงานรายวัน รายเดือน Export เป็น CSV หรือ PDF ได้ทันที</p>
        </div>
        <div class="feat">
          <div class="feat-icon teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <h3>Schedule & Shifts</h3>
          <p>จัดตารางกะ กำหนดเวลาเข้า-ออก แต่ละทีม</p>
        </div>
        <div class="feat">
          <div class="feat-icon pink"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
          <h3>Leave Management</h3>
          <p>ยื่นลา อนุมัติ ติดตามสถานะ ผ่านระบบออนไลน์</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="pricing" id="pricing">
      <h2>Simple Pricing</h2>
      <p class="features-sub">เลือกแพลนที่เหมาะกับธุรกิจของคุณ</p>
      <div class="price-grid">
        <div class="price-card">
          <h3>Free</h3>
          <div class="price-amount"><strong>฿0</strong><span>/ เดือน</span></div>
          <ul><li>พนักงานสูงสุด 3 คน</li><li>QR Check-in</li><li>Dashboard</li><li>Reports</li></ul>
          <a routerLink="/register" class="btn-cta-outline">เริ่มเลย</a>
        </div>
        <div class="price-card">
          <h3>Starter</h3>
          <div class="price-amount"><strong>฿299</strong><span>/ เดือน</span></div>
          <ul><li>พนักงานสูงสุด 10 คน</li><li>ทุกฟีเจอร์ Free</li><li>Leave Management</li><li>Schedule</li></ul>
          <a routerLink="/register" class="btn-cta-outline">ทดลองฟรี 14 วัน</a>
        </div>
        <div class="price-card popular">
          <div class="pop-badge">Popular</div>
          <h3>Business</h3>
          <div class="price-amount"><strong>฿899</strong><span>/ เดือน</span></div>
          <ul><li>พนักงานสูงสุด 50 คน</li><li>ทุกฟีเจอร์ Starter</li><li>Export PDF</li><li>Priority Support</li></ul>
          <a routerLink="/register" class="btn-cta">ทดลองฟรี 14 วัน</a>
        </div>
        <div class="price-card">
          <h3>Pro</h3>
          <div class="price-amount"><strong>฿1,799</strong><span>/ เดือน</span></div>
          <ul><li>พนักงานไม่จำกัด</li><li>ทุกฟีเจอร์ Business</li><li>API Access</li><li>Dedicated Support</li></ul>
          <a routerLink="/register" class="btn-cta-outline">ติดต่อทีมขาย</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="footer-inner">
        <div class="footer-brand">
          <span><em>in</em>Out</span>
          <p>TIME IN. WORK OUT.</p>
        </div>
        <div class="footer-links">
          <a routerLink="/register">สมัครใช้งาน</a>
          <a routerLink="/login">เข้าสู่ระบบ</a>
        </div>
      </div>
      <p class="footer-copy">© 2026 InOut. All rights reserved.</p>
    </footer>
  `,
  styles: `
    :host { display: block; font-family: Inter, Arial, sans-serif; color: #0f172a; }

    /* Nav */
    .top-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.05); }
    .nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; }
    .nav-brand { display: flex; align-items: center; gap: 10px; }
    .nav-brand span { font-size: 22px; font-weight: 800; }
    .nav-brand em { font-style: normal; color: #6366f1; }
    .nav-links { display: flex; gap: 10px; align-items: center; }
    .btn-login { text-decoration: none; color: #475569; font-weight: 600; font-size: 14px; padding: 8px 16px; }
    .btn-cta-sm { text-decoration: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: 700; font-size: 14px; padding: 8px 20px; border-radius: 10px; }

    /* Hero */
    .hero {
      background: linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%);
      color: white; padding: 120px 24px 80px; text-align: center;
    }
    .hero-inner { max-width: 700px; margin: 0 auto; }
    .hero-badge { display: inline-block; background: rgba(129,140,248,0.2); color: #a5b4fc; font-size: 13px; font-weight: 600; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; }
    .hero h1 { font-size: 48px; margin: 0 0 16px; line-height: 1.1; letter-spacing: -1px; }
    .hero h1 em { font-style: normal; background: linear-gradient(135deg, #a5b4fc, #c4b5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero p { color: #94a3b8; font-size: 17px; line-height: 1.7; margin: 0 0 32px; }
    .hero-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 48px; }
    .btn-cta { text-decoration: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 14px; display: inline-block; transition: opacity 0.2s; }
    .btn-cta:hover { opacity: 0.9; }
    .btn-ghost { text-decoration: none; color: #94a3b8; font-weight: 600; font-size: 16px; padding: 14px 24px; border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; }
    .hero-stats { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
    .hero-stats div { text-align: center; }
    .hero-stats strong { display: block; font-size: 16px; color: #a5b4fc; }
    .hero-stats span { font-size: 12px; color: #64748b; }
    .sep { width: 1px; background: rgba(255,255,255,0.1); }

    /* Features */
    .features { padding: 80px 24px; max-width: 1100px; margin: 0 auto; text-align: center; }
    .features h2 { font-size: 32px; margin: 0 0 8px; }
    .features-sub { color: #64748b; margin: 0 0 40px; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: left; }
    .feat { background: #f8fafc; border-radius: 20px; padding: 28px; border: 1px solid #f1f5f9; transition: all 0.2s; }
    .feat:hover { border-color: #e2e8f0; transform: translateY(-2px); }
    .feat-icon { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 16px; }
    .feat-icon svg { width: 22px; height: 22px; }
    .feat-icon.green { background: #ecfdf5; color: #059669; }
    .feat-icon.blue { background: #eff6ff; color: #2563eb; }
    .feat-icon.purple { background: #f5f3ff; color: #7c3aed; }
    .feat-icon.orange { background: #fff7ed; color: #ea580c; }
    .feat-icon.teal { background: #f0fdfa; color: #0d9488; }
    .feat-icon.pink { background: #fdf2f8; color: #db2777; }
    .feat h3 { margin: 0 0 8px; font-size: 16px; }
    .feat p { margin: 0; color: #64748b; font-size: 14px; line-height: 1.6; }

    /* Pricing */
    .pricing { padding: 80px 24px; background: #f8fafc; text-align: center; }
    .pricing h2 { font-size: 32px; margin: 0 0 8px; }
    .price-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .price-card { background: white; border-radius: 20px; padding: 32px 24px; border: 2px solid transparent; text-align: left; position: relative; }
    .price-card.popular { border-color: #2563eb; }
    .pop-badge { position: absolute; top: -10px; right: 16px; background: #2563eb; color: white; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
    .price-card h3 { margin: 0 0 8px; font-size: 18px; }
    .price-amount strong { font-size: 32px; }
    .price-amount span { font-size: 14px; color: #64748b; }
    .price-card ul { list-style: none; padding: 0; margin: 20px 0; }
    .price-card li { padding: 6px 0; font-size: 14px; color: #475569; }
    .price-card li::before { content: '✓ '; color: #6366f1; font-weight: 700; }
    .btn-cta-outline { display: block; text-align: center; text-decoration: none; border: 2px solid #6366f1; color: #4f46e5; font-weight: 700; font-size: 14px; padding: 10px; border-radius: 12px; }
    .price-card .btn-cta { display: block; text-align: center; padding: 12px; font-size: 14px; }

    /* Footer */
    footer { background: #0f172a; color: white; padding: 48px 24px 24px; }
    .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .footer-brand span { font-size: 24px; font-weight: 800; }
    .footer-brand em { font-style: normal; color: #818cf8; }
    .footer-brand p { color: #64748b; font-size: 12px; letter-spacing: 2px; margin: 4px 0 0; }
    .footer-links { display: flex; gap: 20px; }
    .footer-links a { color: #94a3b8; text-decoration: none; font-size: 14px; }
    .footer-links a:hover { color: white; }
    .footer-copy { text-align: center; color: #475569; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 20px; margin: 0; max-width: 1100px; margin: 0 auto; }

    /* Responsive */
    @media (max-width: 768px) {
      .hero h1 { font-size: 32px; }
      .hero p { font-size: 15px; }
      .hero-actions { flex-direction: column; align-items: center; }
      .features-grid { grid-template-columns: 1fr; }
      .price-grid { grid-template-columns: 1fr; max-width: 400px; }
      .footer-inner { flex-direction: column; gap: 16px; text-align: center; }
    }
    @media (max-width: 1024px) {
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .price-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `,
})
export class LandingComponent {}
