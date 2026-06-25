import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/i18n.service';
import { DatePipe } from '@angular/common';
import QRCode from 'qrcode';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface AttendanceLog {
  id: string;
  status: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  employee: Employee;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <header>
      <h1>{{ i18n.t('att.title') }}</h1>
      <button class="btn-qr" (click)="showQr.set(true)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        QR Code
      </button>
    </header>

    @if (showQr()) {
      <div class="qr-overlay" (click)="showQr.set(false)">
        <div class="qr-card" (click)="$event.stopPropagation()">
          <h2>QR Check-in / Check-out</h2>
          <p class="qr-desc">Employees scan this QR code with their phone to check in or out.</p>
          <div class="qr-img">
            @if (qrDataUrl()) {
              <img [src]="qrDataUrl()" alt="QR Code" width="260" height="260" />
            }
          </div>
          <div class="qr-url">
            <input [value]="kioskUrl" readonly />
            <button class="copy-btn" (click)="copyUrl()">{{ copied() ? 'Copied!' : 'Copy' }}</button>
          </div>
          <button class="qr-close" (click)="showQr.set(false)">Close</button>
        </div>
      </div>
    }

    <div class="actions-bar">
      <select [(ngModel)]="selectedEmployee" name="employee">
        <option value="">{{ i18n.t('att.select_employee') }}</option>
        @for (emp of employees(); track emp.id) {
          <option [value]="emp.id">{{ emp.firstName }} {{ emp.lastName }}</option>
        }
      </select>
      <button
        class="btn-checkin"
        [disabled]="!selectedEmployee || actionLoading()"
        (click)="checkIn()"
      >{{ i18n.t('att.check_in_btn') }}</button>
    </div>

    <h2 class="section-title">{{ i18n.t('att.today') }}</h2>

    @if (records().length === 0 && !loading()) {
      <div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" width="48" height="48"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p>{{ i18n.t('att.no_records') }}</p>
      </div>
    }

    @if (records().length > 0) {
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ i18n.t('emp.first_name') }}</th>
              <th>{{ i18n.t('att.time_in') }}</th>
              <th>{{ i18n.t('att.time_out') }}</th>
              <th>{{ i18n.t('att.status') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (rec of records(); track rec.id) {
              <tr>
                <td class="name">{{ rec.employee.firstName }} {{ rec.employee.lastName }}</td>
                <td>{{ rec.checkInAt | date:'HH:mm' }}</td>
                <td>{{ rec.checkOutAt ? (rec.checkOutAt | date:'HH:mm') : '—' }}</td>
                <td>
                  <span class="badge" [class.in]="rec.status === 'CHECKED_IN'" [class.out]="rec.status === 'CHECKED_OUT'">
                    {{ rec.status === 'CHECKED_IN' ? i18n.t('att.checked_in') : i18n.t('att.checked_out') }}
                  </span>
                </td>
                <td>
                  @if (rec.status === 'CHECKED_IN') {
                    <button class="btn-checkout" [disabled]="actionLoading()" (click)="checkOut(rec.id)">
                      {{ i18n.t('att.check_out_btn') }}
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    h1 { margin: 0; font-size: 24px; color: #0f172a; }
    .btn-qr {
      display: flex; align-items: center; gap: 8px; padding: 9px 18px;
      border-radius: 12px; border: 2px solid #6366f1; background: white;
      color: #4f46e5; font-weight: 700; font-size: 14px; cursor: pointer;
    }
    .btn-qr:hover { background: #eef2ff; }
    .qr-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: grid; place-items: center; z-index: 100; padding: 20px; }
    .qr-card { background: white; border-radius: 24px; padding: 36px; text-align: center; width: 100%; max-width: 400px; }
    .qr-card h2 { margin: 0 0 8px; font-size: 20px; color: #0f172a; }
    .qr-desc { color: #64748b; font-size: 13px; margin: 0 0 20px; }
    .qr-img { margin: 0 auto 20px; }
    .qr-img img { border-radius: 12px; display: block; }
    .qr-url { display: flex; gap: 8px; margin-bottom: 16px; }
    .qr-url input { flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; color: #475569; outline: none; }
    .copy-btn { padding: 8px 16px; border: none; border-radius: 8px; background: #6366f1; color: white; font-size: 12px; font-weight: 600; cursor: pointer; }
    .qr-close { background: #f1f5f9; border: none; border-radius: 10px; padding: 10px 28px; font-weight: 600; cursor: pointer; color: #475569; }
    .section-title { font-size: 16px; color: #334155; margin: 24px 0 14px; }
    .actions-bar {
      display: flex; gap: 12px; align-items: center;
      background: white; padding: 16px 20px; border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    select {
      flex: 1; padding: 10px 14px; border: 1px solid #e2e8f0;
      border-radius: 10px; font-size: 14px; outline: none; background: white;
    }
    select:focus { border-color: #6366f1; }
    .btn-checkin {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white; border: none; border-radius: 10px;
      padding: 10px 24px; font-weight: 700; font-size: 14px; cursor: pointer;
    }
    .btn-checkin:disabled { opacity: 0.5; cursor: not-allowed; }
    .empty {
      display: flex; flex-direction: column; align-items: center;
      padding: 60px 0; color: #94a3b8;
    }
    .empty p { margin: 16px 0 0; color: #64748b; font-weight: 600; }
    .table-wrap {
      background: white; border-radius: 16px; overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left; padding: 14px 20px; font-size: 12px;
      font-weight: 600; color: #64748b; text-transform: uppercase;
      letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9;
    }
    td { padding: 14px 20px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
    .name { font-weight: 600; color: #0f172a; }
    .badge {
      padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
    }
    .badge.in { background: #eef2ff; color: #4f46e5; }
    .badge.out { background: #eff6ff; color: #2563eb; }
    .btn-checkout {
      background: none; border: 1px solid #f59e0b; border-radius: 8px;
      padding: 6px 14px; font-size: 13px; color: #d97706; cursor: pointer; font-weight: 600;
    }
    .btn-checkout:hover { background: #fffbeb; }
    .btn-checkout:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 768px) {
      .actions-bar { flex-direction: column; }
      .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      table { min-width: 500px; }
    }
  `,
})
export class AttendanceComponent implements OnInit {
  employees = signal<Employee[]>([]);
  records = signal<AttendanceLog[]>([]);
  selectedEmployee = '';
  loading = signal(true);
  actionLoading = signal(false);
  showQr = signal(false);
  copied = signal(false);
  qrDataUrl = signal('');
  kioskUrl = '';

  constructor(
    readonly i18n: I18nService,
    private readonly http: HttpClient,
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadToday();
    this.http.get<{ qrToken: string }>('/api/settings').subscribe((s) => {
      this.kioskUrl = `${window.location.origin}/kiosk/${s.qrToken}`;
      QRCode.toDataURL(this.kioskUrl, { width: 260, margin: 2, color: { dark: '#0f172a' } })
        .then((url: string) => this.qrDataUrl.set(url));
    });
  }

  copyUrl() {
    navigator.clipboard.writeText(this.kioskUrl);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  loadEmployees() {
    this.http.get<Employee[]>('/api/employees').subscribe((data) =>
      this.employees.set(data.filter((e: any) => e.isActive)),
    );
  }

  loadToday() {
    this.http.get<AttendanceLog[]>('/api/attendance/today').subscribe((data) => {
      this.records.set(data);
      this.loading.set(false);
    });
  }

  checkIn() {
    this.actionLoading.set(true);
    this.http
      .post('/api/attendance/check-in', { employeeId: this.selectedEmployee })
      .subscribe({
        next: () => {
          this.actionLoading.set(false);
          this.selectedEmployee = '';
          this.loadToday();
        },
        error: () => this.actionLoading.set(false),
      });
  }

  checkOut(attendanceId: string) {
    this.actionLoading.set(true);
    this.http
      .post('/api/attendance/check-out', { attendanceId })
      .subscribe({
        next: () => {
          this.actionLoading.set(false);
          this.loadToday();
        },
        error: () => this.actionLoading.set(false),
      });
  }
}
