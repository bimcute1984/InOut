import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/i18n.service';

interface CompanyInfo {
  id: string; name: string; email: string; phone: string | null;
  plan: string; trialEndsAt: string | null; createdAt: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink],
  template: `
    <header><h1>{{ i18n.t('set.title') }}</h1></header>

    @if (company()) {
      <div class="card">
        <h2>{{ i18n.t('set.company_info') }}</h2>
        <form (ngSubmit)="onSave()" class="form">
          <label>{{ i18n.t('set.company_name') }}
            <input [(ngModel)]="form.name" name="name" required />
          </label>
          <label>{{ i18n.t('set.email') }}
            <input [value]="company()!.email" disabled />
          </label>
          <label>{{ i18n.t('set.phone') }}
            <input [(ngModel)]="form.phone" name="phone" placeholder="+82-10-0000-0000" />
          </label>
          <div class="info-row">
            <div><span>{{ i18n.t('set.plan') }}</span><strong class="plan-badge">{{ company()!.plan }}</strong></div>
            <div><span>{{ i18n.t('set.member_since') }}</span><strong>{{ company()!.createdAt | date:'yyyy-MM-dd' }}</strong></div>
          </div>
          <button type="submit" class="btn-primary" [disabled]="saving()">
            {{ saved() ? i18n.t('set.saved') : i18n.t('set.save') }}
          </button>
        </form>
      </div>

      <div class="card">
        <h2>{{ i18n.t('nav.leave') }} & {{ i18n.t('nav.billing') }}</h2>
        <div class="link-grid">
          <a class="link-card" routerLink="/leave">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ i18n.t('leave.title') }}
          </a>
          <a class="link-card" routerLink="/billing">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            {{ i18n.t('bill.title') }}
          </a>
        </div>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    header { margin-bottom: 28px; }
    h1 { margin: 0; font-size: 24px; color: #0f172a; }
    .card {
      background: white; border-radius: 20px; padding: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 20px;
    }
    .card h2 { margin: 0 0 20px; font-size: 18px; color: #0f172a; }
    .form { display: grid; gap: 16px; max-width: 480px; }
    .form label { display: grid; gap: 5px; font-size: 13px; font-weight: 600; color: #374151; }
    .form input {
      padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 12px;
      font-size: 14px; outline: none;
    }
    .form input:focus { border-color: #6366f1; }
    .form input:disabled { background: #f8fafc; color: #94a3b8; }
    .info-row { display: flex; gap: 32px; }
    .info-row div span { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; }
    .info-row div strong { font-size: 16px; color: #0f172a; }
    .plan-badge { background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border: none; border-radius: 12px; padding: 12px 28px; font-weight: 700;
      font-size: 14px; cursor: pointer; width: fit-content;
    }
    .btn-primary:disabled { opacity: 0.6; }
    .link-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .link-card {
      display: flex; align-items: center; gap: 12px; padding: 18px 20px;
      border-radius: 14px; border: 1px solid #e2e8f0; text-decoration: none;
      color: #334155; font-weight: 600; font-size: 14px; transition: all 0.2s;
    }
    .link-card:hover { border-color: #6366f1; background: #f0fdf4; }

    @media (max-width: 768px) {
      .card { padding: 20px; }
      .info-row { flex-direction: column; gap: 16px; }
      .link-grid { grid-template-columns: 1fr; }
      .btn-primary { width: 100%; text-align: center; }
    }
  `,
})
export class SettingsComponent implements OnInit {
  company = signal<CompanyInfo | null>(null);
  form = { name: '', phone: '' };
  saving = signal(false);
  saved = signal(false);

  constructor(readonly i18n: I18nService, private readonly http: HttpClient) {}

  ngOnInit() {
    this.http.get<CompanyInfo>('/api/settings').subscribe((d) => {
      this.company.set(d);
      this.form = { name: d.name, phone: d.phone ?? '' };
    });
  }

  onSave() {
    this.saving.set(true);
    this.http.patch('/api/settings', this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 2000);
      },
      error: () => this.saving.set(false),
    });
  }
}
