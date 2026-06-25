import { Component, signal, computed, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { I18nService } from '../core/i18n.service';

interface DashboardData {
  employees: number;
  activeToday: number;
  checkedIn: number;
  checkedOut: number;
  absentEstimate: number;
  recentLogs: {
    id: string;
    status: string;
    checkInAt: string | null;
    checkOutAt: string | null;
    employee: { firstName: string; lastName: string };
  }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  template: `
    <header>
      <div>
        <p class="greeting">{{ i18n.t('dashboard.greeting') }}</p>
        <h1>{{ (user()?.email ?? '').split('@')[0] || 'User' }}</h1>
      </div>
    </header>

    <section class="cards">
      <article>
        <span class="card-label">{{ i18n.t('dashboard.total_employees') }}</span>
        <strong>{{ data().employees }}</strong>
        <em>{{ data().employees === 0 ? i18n.t('dashboard.start_adding') : '+' + data().activeToday + ' ' + i18n.t('dashboard.today').toLowerCase() }}</em>
      </article>
      <article>
        <span class="card-label">{{ i18n.t('dashboard.checked_in') }}</span>
        <strong>{{ data().checkedIn }}</strong>
        <em class="green">{{ rate() }}%</em>
      </article>
      <article>
        <span class="card-label">{{ i18n.t('dashboard.late') }}</span>
        <strong>{{ data().checkedOut }}</strong>
        <em class="orange">{{ i18n.t('dashboard.today') }}</em>
      </article>
      <article>
        <span class="card-label">{{ i18n.t('dashboard.absent') }}</span>
        <strong>{{ data().absentEstimate }}</strong>
        <em class="red">{{ i18n.t('dashboard.today') }}</em>
      </article>
    </section>

    <section class="panels">
      <div class="panel">
        <h2>{{ i18n.t('dashboard.today_attendance') }}</h2>
        <div class="ring-wrapper">
          <div class="ring" [style.background]="ringGradient()">
            <span class="ring-value">{{ rate() }}%</span>
          </div>
          <div class="ring-legend">
            <div><span class="dot present"></span> {{ i18n.t('dashboard.present') }} <strong>{{ data().checkedIn }}</strong></div>
            <div><span class="dot checked-out"></span> {{ i18n.t('dashboard.check_out') }} <strong>{{ data().checkedOut }}</strong></div>
            <div><span class="dot absent"></span> {{ i18n.t('dashboard.absent') }} <strong>{{ data().absentEstimate }}</strong></div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h2>{{ i18n.t('dashboard.recent_activity') }}</h2>
        </div>
        @if (data().recentLogs.length === 0) {
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" width="48" height="48"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p>{{ i18n.t('dashboard.no_activity') }}</p>
            <span>{{ i18n.t('dashboard.checkins_here') }}</span>
          </div>
        } @else {
          @for (log of data().recentLogs; track log.id) {
            <div class="activity-row">
              <div class="activity-avatar">{{ log.employee.firstName[0] }}</div>
              <div class="activity-info">
                <strong>{{ log.employee.firstName }} {{ log.employee.lastName }}</strong>
                <span class="activity-type" [class.checkin]="log.status === 'CHECKED_IN'" [class.checkout]="log.status === 'CHECKED_OUT'">
                  {{ log.status === 'CHECKED_IN' ? i18n.t('dashboard.check_in') : i18n.t('dashboard.check_out') }}
                </span>
              </div>
              <span class="activity-time">{{ (log.checkOutAt ?? log.checkInAt) | date:'HH:mm' }}</span>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    header { margin-bottom: 28px; }
    .greeting { color: #64748b; margin: 0 0 4px; font-size: 15px; }
    h1 { margin: 0; font-size: 28px; color: #0f172a; text-transform: capitalize; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 24px; }
    article { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }
    .card-label { color: #64748b; font-size: 13px; font-weight: 500; }
    article strong { display: block; font-size: 36px; margin: 8px 0 4px; color: #0f172a; }
    article em { font-style: normal; font-size: 13px; color: #6366f1; }
    .green { color: #16a34a !important; }
    .orange { color: #f59e0b !important; }
    .red { color: #ef4444 !important; }
    .panels { display: grid; grid-template-columns: 1fr 1.5fr; gap: 18px; }
    .panel { background: white; border-radius: 20px; padding: 28px; box-shadow: 0 1px 3px rgba(15,23,42,0.06); }
    .panel h2 { margin: 0 0 20px; font-size: 17px; color: #0f172a; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; }
    .ring-wrapper { display: flex; align-items: center; gap: 28px; }
    .ring {
      width: 130px; height: 130px; border-radius: 50%;
      background: conic-gradient(#e2e8f0 100%, #e2e8f0 0);
      display: grid; place-items: center; position: relative;
    }
    .ring::after { content: ''; width: 90px; height: 90px; border-radius: 50%; background: white; position: absolute; }
    .ring-value { position: relative; z-index: 1; font-size: 28px; font-weight: 800; color: #0f172a; }
    .ring-legend { display: grid; gap: 12px; font-size: 14px; color: #64748b; }
    .ring-legend div { display: flex; align-items: center; gap: 8px; }
    .ring-legend strong { margin-left: auto; color: #0f172a; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.present { background: #6366f1; }
    .dot.checked-out { background: #3b82f6; }
    .dot.absent { background: #ef4444; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px 0; color: #94a3b8; }
    .empty-state p { margin: 16px 0 4px; color: #64748b; font-weight: 600; }
    .empty-state span { font-size: 13px; }
    .activity-row {
      display: flex; align-items: center; gap: 14px;
      padding: 12px 0; border-bottom: 1px solid #f1f5f9;
    }
    .activity-row:last-child { border-bottom: none; }
    .activity-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; display: grid; place-items: center;
      font-weight: 700; font-size: 14px;
    }
    .activity-info { flex: 1; }
    .activity-info strong { display: block; font-size: 14px; color: #0f172a; }
    .activity-type { font-size: 12px; }
    .activity-type.checkin { color: #6366f1; }
    .activity-type.checkout { color: #3b82f6; }
    .activity-time { font-size: 13px; color: #64748b; font-weight: 500; }

    @media (max-width: 1024px) {
      .cards { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .cards { grid-template-columns: 1fr 1fr; gap: 12px; }
      article { padding: 16px; }
      article strong { font-size: 28px; }
      .panels { grid-template-columns: 1fr; }
      .ring-wrapper { flex-direction: column; gap: 16px; }
      h1 { font-size: 22px; }
    }
    @media (max-width: 480px) {
      .cards { grid-template-columns: 1fr; }
    }
  `,
})
export class DashboardComponent implements OnInit {
  data = signal<DashboardData>({
    employees: 0, activeToday: 0, checkedIn: 0,
    checkedOut: 0, absentEstimate: 0, recentLogs: [],
  });

  rate = computed(() => {
    const d = this.data();
    return d.employees > 0 ? Math.round((d.activeToday / d.employees) * 100) : 0;
  });

  ringGradient = computed(() => {
    const r = this.rate();
    return `conic-gradient(#6366f1 ${r}%, #e2e8f0 ${r}%)`;
  });

  constructor(
    readonly i18n: I18nService,
    private readonly auth: AuthService,
    private readonly http: HttpClient,
  ) {}

  readonly user = this.auth.user;

  ngOnInit() {
    this.http.get<DashboardData>('/api/dashboard/overview').subscribe((d) =>
      this.data.set(d),
    );
  }
}
