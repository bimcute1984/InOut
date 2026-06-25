import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { I18nService } from '../core/i18n.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <!-- Mobile top bar -->
      <div class="topbar">
        <button class="hamburger" (click)="menuOpen.set(!menuOpen())">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="topbar-brand">
          <span class="brand-name"><em>in</em>Out</span>
        </div>
        <div class="topbar-spacer"></div>
      </div>

      <!-- Overlay -->
      @if (menuOpen()) {
        <div class="overlay" (click)="menuOpen.set(false)"></div>
      }

      <aside class="sidebar" [class.open]="menuOpen()">
        <div class="brand">
          <svg class="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sgn" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#059669"/></linearGradient>
              <linearGradient id="sbl" x1=".7" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient>
            </defs>
            <circle cx="30" cy="8" r="7" fill="url(#sgn)"/>
            <path d="M30 15C6 28 4 72 40 84" stroke="url(#sgn)" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M40 84L24 80 30 68" stroke="url(#sgn)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="70" cy="8" r="7" fill="url(#sbl)"/>
            <path d="M70 15C94 28 96 72 60 84" stroke="url(#sbl)" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M60 84L76 80 70 68" stroke="url(#sbl)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="50" cy="46" r="26" fill="white"/>
            <line x1="50" y1="24" x2="50" y2="28" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="64" x2="50" y2="68" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="28" y1="46" x2="32" y2="46" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="68" y1="46" x2="72" y2="46" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="46" x2="50" y2="30" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="46" x2="63" y2="40" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="46" r="2.5" fill="#0f172a"/>
          </svg>
          <div class="brand-text">
            <span class="brand-name"><em>in</em>Out</span>
          </div>
        </div>

        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            {{ i18n.t('nav.dashboard') }}
          </a>
          <a routerLink="/employees" routerLinkActive="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {{ i18n.t('nav.employees') }}
          </a>
          <a routerLink="/attendance" routerLinkActive="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ i18n.t('nav.attendance') }}
          </a>
          <a routerLink="/schedule" routerLinkActive="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ i18n.t('nav.schedule') }}
          </a>
          <a routerLink="/reports" routerLinkActive="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            {{ i18n.t('nav.reports') }}
          </a>
          <a routerLink="/leave" routerLinkActive="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ i18n.t('nav.leave') }}
          </a>
          <a routerLink="/settings" routerLinkActive="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            {{ i18n.t('nav.settings') }}
          </a>
          <a routerLink="/billing" routerLinkActive="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            {{ i18n.t('nav.billing') }}
          </a>
        </nav>

        <div class="spacer"></div>

        <button class="logout" (click)="onLogout()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {{ i18n.t('nav.logout') }}
        </button>
      </aside>

      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    :host { display: block; min-height: 100vh; }

    .shell { display: flex; min-height: 100vh; }

    /* --- Mobile top bar (hidden on desktop) --- */
    .topbar {
      display: none;
      position: fixed; top: 0; left: 0; right: 0; z-index: 20;
      height: 56px; padding: 0 16px;
      background: white; border-bottom: 1px solid #e5e7eb;
      align-items: center; gap: 12px;
    }
    .hamburger {
      background: none; border: none; color: #374151; padding: 4px; cursor: pointer;
    }
    .hamburger svg { width: 24px; height: 24px; }
    .topbar-brand .brand-name { font-size: 20px; font-weight: 800; color: #1e1b4b; }
    .topbar-brand .brand-name em { font-style: normal; color: #6366f1; }
    .topbar-spacer { flex: 1; }

    /* --- Overlay --- */
    .overlay {
      display: none;
      position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 25;
    }

    /* --- Sidebar --- */
    .sidebar {
      width: 260px;
      background: white;
      border-right: 1px solid #eef2ff;
      color: #1e1b4b;
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      z-index: 30;
      transition: transform 0.3s ease;
    }

    .brand { display: flex; align-items: center; gap: 14px; margin-bottom: 36px; }
    .logo-icon { width: 42px; height: 42px; }
    .brand-name { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #1e1b4b; }
    .brand-name em { font-style: normal; color: #6366f1; }

    nav { display: grid; gap: 2px; overflow-y: auto; }
    nav a {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 16px; border-radius: 10px;
      color: #64748b; text-decoration: none;
      font-size: 14px; font-weight: 500; transition: all 0.15s; cursor: pointer;
    }
    nav a:hover { color: #1e1b4b; background: #f5f3ff; }
    nav a.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }
    nav a svg { width: 20px; height: 20px; flex-shrink: 0; }

    .spacer { flex: 1; }

    .logout {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 16px; border-radius: 10px;
      color: #94a3b8; background: none; border: none;
      font-size: 14px; font-weight: 500; cursor: pointer; width: 100%; transition: all 0.15s;
    }
    .logout:hover { color: #ef4444; background: #fef2f2; }
    .logout svg { width: 20px; height: 20px; }

    main {
      flex: 1;
      margin-left: 260px;
      background: #f8fafc;
      min-height: 100vh;
      padding: 32px;
    }

    /* ========== Tablet (≤1024px) ========== */
    @media (max-width: 1024px) {
      main { padding: 24px; }
    }

    /* ========== Mobile (≤768px) ========== */
    @media (max-width: 768px) {
      .topbar { display: flex; }
      .overlay { display: block; }

      .sidebar {
        transform: translateX(-100%);
        width: 280px;
        box-shadow: 4px 0 24px rgba(0,0,0,0.08);
      }
      .sidebar.open { transform: translateX(0); }
      .sidebar .brand { margin-top: 0; }

      main {
        margin-left: 0;
        padding: 72px 16px 24px;
      }
    }
  `,
})
export class LayoutComponent {
  menuOpen = signal(false);

  constructor(
    readonly i18n: I18nService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  onLogout() {
    this.auth.logout();
  }
}
