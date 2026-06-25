import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { I18nService, Lang } from '../core/i18n.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="lang-switch">
        <button
          [class.active]="i18n.lang() === 'en'"
          (click)="i18n.setLang('en')"
        >EN</button>
        <button
          [class.active]="i18n.lang() === 'ko'"
          (click)="i18n.setLang('ko')"
        >한국어</button>
      </div>

      <div class="auth-card">
        <div class="brand">
          <svg class="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lgn" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#059669"/></linearGradient>
              <linearGradient id="lbl" x1=".7" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient>
            </defs>
            <circle cx="30" cy="8" r="7" fill="url(#lgn)"/>
            <path d="M30 15C6 28 4 72 40 84" stroke="url(#lgn)" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M40 84L24 80 30 68" stroke="url(#lgn)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="70" cy="8" r="7" fill="url(#lbl)"/>
            <path d="M70 15C94 28 96 72 60 84" stroke="url(#lbl)" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M60 84L76 80 70 68" stroke="url(#lbl)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="50" cy="46" r="26" fill="white"/>
            <line x1="50" y1="24" x2="50" y2="28" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="64" x2="50" y2="68" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="28" y1="46" x2="32" y2="46" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="68" y1="46" x2="72" y2="46" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="46" x2="50" y2="30" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="46" x2="63" y2="40" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="46" r="2.5" fill="#0f172a"/>
          </svg>
          <h1><span class="green">in</span><span class="blue">Out</span></h1>
        </div>
        <p class="tagline">{{ i18n.t('tagline') }}</p>
        <p class="subtitle">{{ i18n.t('login.title') }}</p>

        @if (error()) {
          <div class="error-box">{{ error() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="form">
          <label>
            {{ i18n.t('login.email') }}
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="you@company.com"
              required
            />
          </label>
          <label>
            {{ i18n.t('login.password') }}
            <div class="password-field">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                class="eye-btn"
                (click)="showPassword.set(!showPassword())"
              >
                @if (showPassword()) {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                } @else {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </label>
          <button type="submit" [disabled]="loading()">
            {{ loading() ? i18n.t('login.loading') : i18n.t('login.submit') }}
          </button>
        </form>

        <p class="link">
          {{ i18n.t('login.no_account') }}
          <a routerLink="/register">{{ i18n.t('login.register') }}</a>
        </p>
      </div>
    </div>
  `,
  styles: `
    .auth-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 30%, #f5f3ff 60%, #faf5ff 100%);
      font-family: Inter, Arial, sans-serif;
      padding: 20px;
      position: relative;
    }
    .lang-switch {
      position: absolute;
      top: 24px;
      right: 28px;
      display: flex;
      gap: 4px;
      background: #eef2ff;
      border-radius: 10px;
      padding: 3px;
      border: 1px solid #e0e7ff;
    }
    .lang-switch button {
      background: none;
      border: none;
      color: #94a3b8;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin: 0;
    }
    .lang-switch button.active {
      background: white;
      color: #4f46e5;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .lang-switch button:hover:not(.active) {
      color: #475569;
    }
    .auth-card {
      background: white;
      border-radius: 24px;
      padding: 48px 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 4px;
    }
    .logo-icon {
      width: 48px;
      height: 48px;
    }
    h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: -0.5px;
    }
    .green {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .blue {
      color: #1e1b4b;
    }
    .tagline {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #94a3b8;
      margin: 2px 0 0;
    }
    .subtitle {
      color: #64748b;
      margin: 16px 0 24px;
    }
    .error-box {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .form {
      display: grid;
      gap: 16px;
    }
    label {
      display: grid;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
    input {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .password-field {
      position: relative;
    }
    .password-field input {
      width: 100%;
      padding-right: 48px;
    }
    .eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      padding: 4px;
      margin: 0;
      cursor: pointer;
      color: #94a3b8;
      display: grid;
      place-items: center;
    }
    .eye-btn:hover {
      color: #475569;
    }
    .eye-btn svg {
      width: 20px;
      height: 20px;
    }
    button {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 14px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 8px;
      transition: opacity 0.2s;
    }
    button:hover:not(:disabled) {
      opacity: 0.9;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .link {
      text-align: center;
      margin-top: 20px;
      color: #64748b;
      font-size: 14px;
    }
    .link a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
    }
    @media (max-width: 480px) {
      .auth-card { padding: 32px 24px; border-radius: 20px; }
      .lang-switch { top: 12px; right: 12px; }
    }
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = signal(false);
  loading = signal(false);
  error = signal('');

  constructor(
    readonly i18n: I18nService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed');
      },
    });
  }
}
