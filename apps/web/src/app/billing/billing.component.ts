import { Component, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/i18n.service';

interface Plan { key: string; name: string; maxEmployees: number; price: number; }
interface BillingData {
  currentPlan: string; planName: string; maxEmployees: number;
  price: number; employeeCount: number; trialEndsAt: string | null;
  plans: Plan[];
}

@Component({
  selector: 'app-billing',
  standalone: true,
  template: `
    <header><h1>{{ i18n.t('bill.title') }}</h1></header>

    @if (data()) {
      <div class="current">
        <div class="current-card">
          <span>{{ i18n.t('bill.current_plan') }}</span>
          <strong>{{ data()!.planName }}</strong>
          <p>{{ data()!.price === 0 ? i18n.t('bill.free') : '₩' + data()!.price.toLocaleString() + ' ' + i18n.t('bill.per_month') }}</p>
        </div>
        <div class="current-card">
          <span>{{ i18n.t('bill.employees_used') }}</span>
          <strong>{{ data()!.employeeCount }} <small>/ {{ data()!.maxEmployees > 99999 ? '∞' : data()!.maxEmployees }}</small></strong>
        </div>
      </div>

      <h2>{{ i18n.t('bill.choose_plan') }}</h2>
      <div class="plans">
        @for (plan of data()!.plans; track plan.key) {
          <div class="plan-card" [class.active]="plan.key === data()!.currentPlan" [class.popular]="plan.key === 'BUSINESS'">
            @if (plan.key === 'BUSINESS') { <div class="popular-badge">Popular</div> }
            <h3>{{ plan.name }}</h3>
            <div class="price">
              @if (plan.price === 0) {
                <strong>{{ i18n.t('bill.free') }}</strong>
              } @else {
                <strong>₩{{ plan.price.toLocaleString() }}</strong>
                <span>{{ i18n.t('bill.per_month') }}</span>
              }
            </div>
            <p class="limit">{{ i18n.t('bill.up_to') }} {{ plan.maxEmployees > 99999 ? i18n.t('bill.unlimited') : plan.maxEmployees }} {{ i18n.t('bill.employees') }}</p>
            <button
              [class.current-btn]="plan.key === data()!.currentPlan"
              [disabled]="plan.key === data()!.currentPlan || loading()"
              (click)="selectPlan(plan.key)"
            >{{ plan.key === data()!.currentPlan ? i18n.t('bill.current') : i18n.t('bill.select') }}</button>
          </div>
        }
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    header { margin-bottom: 28px; }
    h1 { margin: 0; font-size: 24px; color: #0f172a; }
    h2 { font-size: 18px; color: #0f172a; margin: 32px 0 16px; }
    .current { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .current-card {
      background: white; border-radius: 20px; padding: 28px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .current-card span { font-size: 13px; color: #64748b; }
    .current-card strong { display: block; font-size: 32px; margin: 6px 0 4px; color: #0f172a; }
    .current-card small { font-size: 18px; color: #94a3b8; }
    .current-card p { margin: 0; color: #6366f1; font-weight: 600; font-size: 14px; }
    .plans { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .plan-card {
      background: white; border-radius: 20px; padding: 28px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 2px solid transparent;
      position: relative; transition: all 0.2s;
    }
    .plan-card:hover { border-color: #e2e8f0; transform: translateY(-2px); }
    .plan-card.active { border-color: #6366f1; }
    .plan-card.popular { border-color: #2563eb; }
    .popular-badge {
      position: absolute; top: -10px; right: 16px;
      background: #2563eb; color: white; font-size: 11px;
      font-weight: 700; padding: 4px 12px; border-radius: 20px;
    }
    .plan-card h3 { margin: 0 0 12px; font-size: 18px; color: #0f172a; }
    .price strong { font-size: 28px; color: #0f172a; }
    .price span { font-size: 14px; color: #64748b; }
    .limit { font-size: 13px; color: #64748b; margin: 12px 0 20px; }
    .plan-card button {
      width: 100%; padding: 10px; border-radius: 10px; border: none;
      font-weight: 700; font-size: 14px; cursor: pointer;
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
    }
    .plan-card button:disabled { opacity: 0.5; cursor: default; }
    .current-btn { background: #f1f5f9 !important; color: #64748b !important; }

    @media (max-width: 1024px) {
      .plans { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .current { grid-template-columns: 1fr; }
      .plans { grid-template-columns: 1fr; }
      .current-card strong { font-size: 26px; }
    }
  `,
})
export class BillingComponent implements OnInit {
  data = signal<BillingData | null>(null);
  loading = signal(false);

  constructor(readonly i18n: I18nService, private readonly http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<BillingData>('/api/billing').subscribe((d) => this.data.set(d));
  }

  selectPlan(plan: string) {
    this.loading.set(true);
    this.http.post('/api/billing/change-plan', { plan }).subscribe({
      next: () => { this.loading.set(false); this.load(); },
      error: () => this.loading.set(false),
    });
  }
}
