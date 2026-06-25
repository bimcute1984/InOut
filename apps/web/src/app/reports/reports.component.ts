import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { I18nService } from '../core/i18n.service';

interface DailyReport {
  date: string;
  totalEmployees: number;
  present: number;
  absent: number;
  rate: number;
  logs: {
    id: string;
    checkInAt: string | null;
    checkOutAt: string | null;
    status: string;
    employee: { firstName: string; lastName: string };
  }[];
}

interface MonthlyReport {
  year: number;
  month: number;
  totalEmployees: number;
  totalLogs: number;
  avgRate: number;
  employeeSummary: {
    id: string;
    name: string;
    days: number;
    totalHours: number;
  }[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <header>
      <h1>{{ i18n.t('rpt.title') }}</h1>
      <div class="export-btns">
        <button class="btn-csv" (click)="exportCsv()">{{ i18n.t('rpt.export_csv') }}</button>
        <button class="btn-pdf" (click)="exportPdf()">{{ i18n.t('rpt.export_pdf') }}</button>
      </div>
    </header>

    <div class="tabs">
      <button [class.active]="tab() === 'daily'" (click)="tab.set('daily'); loadDaily()">
        {{ i18n.t('rpt.daily') }}
      </button>
      <button [class.active]="tab() === 'monthly'" (click)="tab.set('monthly'); loadMonthly()">
        {{ i18n.t('rpt.monthly') }}
      </button>
    </div>

    @if (tab() === 'daily') {
      <div class="filter-bar">
        <label>{{ i18n.t('rpt.date') }}
          <input type="date" [(ngModel)]="selectedDate" name="date" (change)="loadDaily()" />
        </label>
      </div>

      @if (daily()) {
        <div class="summary-cards">
          <div class="s-card"><span>{{ i18n.t('rpt.total_emp') }}</span><strong>{{ daily()!.totalEmployees }}</strong></div>
          <div class="s-card green"><span>{{ i18n.t('rpt.present') }}</span><strong>{{ daily()!.present }}</strong></div>
          <div class="s-card red"><span>{{ i18n.t('rpt.absent') }}</span><strong>{{ daily()!.absent }}</strong></div>
          <div class="s-card blue"><span>{{ i18n.t('rpt.rate') }}</span><strong>{{ daily()!.rate }}%</strong></div>
        </div>

        @if (daily()!.logs.length > 0) {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{{ i18n.t('rpt.employee') }}</th>
                  <th>{{ i18n.t('att.time_in') }}</th>
                  <th>{{ i18n.t('att.time_out') }}</th>
                  <th>{{ i18n.t('att.status') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (log of daily()!.logs; track log.id) {
                  <tr>
                    <td class="name">{{ log.employee.firstName }} {{ log.employee.lastName }}</td>
                    <td>{{ log.checkInAt | date:'HH:mm' }}</td>
                    <td>{{ log.checkOutAt ? (log.checkOutAt | date:'HH:mm') : '—' }}</td>
                    <td>
                      <span class="badge" [class.in]="log.status === 'CHECKED_IN'" [class.out]="log.status === 'CHECKED_OUT'">
                        {{ log.status === 'CHECKED_IN' ? i18n.t('att.checked_in') : i18n.t('att.checked_out') }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="empty">{{ i18n.t('rpt.no_data') }}</div>
        }
      }
    }

    @if (tab() === 'monthly') {
      <div class="filter-bar">
        <label>{{ i18n.t('rpt.month') }}
          <input type="month" [(ngModel)]="selectedMonth" name="month" (change)="loadMonthly()" />
        </label>
      </div>

      @if (monthly()) {
        <div class="summary-cards">
          <div class="s-card"><span>{{ i18n.t('rpt.total_emp') }}</span><strong>{{ monthly()!.totalEmployees }}</strong></div>
          <div class="s-card green"><span>{{ i18n.t('rpt.rate') }}</span><strong>{{ monthly()!.avgRate }}%</strong></div>
        </div>

        @if (monthly()!.employeeSummary.length > 0) {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{{ i18n.t('rpt.employee') }}</th>
                  <th>{{ i18n.t('rpt.days_worked') }}</th>
                  <th>{{ i18n.t('rpt.total_hours') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (emp of monthly()!.employeeSummary; track emp.id) {
                  <tr>
                    <td class="name">{{ emp.name }}</td>
                    <td>{{ emp.days }}</td>
                    <td>{{ emp.totalHours }}h</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="empty">{{ i18n.t('rpt.no_data') }}</div>
        }
      }
    }
  `,
  styles: `
    :host { display: block; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h1 { margin: 0; font-size: 24px; color: #0f172a; }
    .export-btns { display: flex; gap: 8px; }
    .btn-csv, .btn-pdf {
      padding: 9px 18px; border-radius: 10px; font-size: 13px;
      font-weight: 600; cursor: pointer; border: none;
    }
    .btn-csv { background: #eef2ff; color: #4f46e5; }
    .btn-csv:hover { background: #d1fae5; }
    .btn-pdf { background: #fef2f2; color: #dc2626; }
    .btn-pdf:hover { background: #fee2e2; }
    .tabs {
      display: flex; gap: 4px; background: white; border-radius: 12px;
      padding: 4px; margin-bottom: 20px; width: fit-content;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .tabs button {
      padding: 9px 24px; border-radius: 10px; border: none;
      font-size: 14px; font-weight: 600; cursor: pointer;
      background: none; color: #64748b; transition: all 0.2s;
    }
    .tabs button.active {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
    }
    .filter-bar {
      margin-bottom: 20px;
    }
    .filter-bar label {
      display: flex; align-items: center; gap: 10px;
      font-size: 14px; font-weight: 600; color: #374151;
    }
    .filter-bar input {
      padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: 10px;
      font-size: 14px; outline: none;
    }
    .filter-bar input:focus { border-color: #6366f1; }
    .summary-cards {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 14px; margin-bottom: 20px;
    }
    .s-card {
      background: white; border-radius: 16px; padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .s-card span { font-size: 12px; color: #64748b; font-weight: 500; }
    .s-card strong { display: block; font-size: 28px; margin-top: 6px; color: #0f172a; }
    .s-card.green strong { color: #4f46e5; }
    .s-card.red strong { color: #ef4444; }
    .s-card.blue strong { color: #2563eb; }
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
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge.in { background: #eef2ff; color: #4f46e5; }
    .badge.out { background: #eff6ff; color: #2563eb; }
    .empty {
      text-align: center; padding: 48px; color: #94a3b8;
      background: white; border-radius: 16px; font-weight: 500;
    }

    @media (max-width: 768px) {
      header { flex-direction: column; gap: 12px; align-items: stretch; }
      .export-btns { display: grid; grid-template-columns: 1fr 1fr; }
      .summary-cards { grid-template-columns: 1fr 1fr; }
      .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      table { min-width: 480px; }
    }
  `,
})
export class ReportsComponent implements OnInit {
  tab = signal<'daily' | 'monthly'>('daily');
  daily = signal<DailyReport | null>(null);
  monthly = signal<MonthlyReport | null>(null);
  selectedDate = new Date().toISOString().slice(0, 10);
  selectedMonth = new Date().toISOString().slice(0, 7);

  constructor(
    readonly i18n: I18nService,
    private readonly http: HttpClient,
  ) {}

  ngOnInit() {
    this.loadDaily();
  }

  loadDaily() {
    this.http
      .get<DailyReport>(`/api/reports/daily?date=${this.selectedDate}`)
      .subscribe((d) => this.daily.set(d));
  }

  loadMonthly() {
    const [y, m] = this.selectedMonth.split('-');
    this.http
      .get<MonthlyReport>(`/api/reports/monthly?year=${y}&month=${m}`)
      .subscribe((d) => this.monthly.set(d));
  }

  exportCsv() {
    if (this.tab() === 'daily' && this.daily()) {
      const d = this.daily()!;
      const rows = [
        ['Employee', 'Check In', 'Check Out', 'Status'],
        ...d.logs.map((l) => [
          `${l.employee.firstName} ${l.employee.lastName}`,
          l.checkInAt ? new Date(l.checkInAt).toLocaleTimeString() : '',
          l.checkOutAt ? new Date(l.checkOutAt).toLocaleTimeString() : '',
          l.status,
        ]),
      ];
      this.downloadCsv(rows, `report-${d.date}.csv`);
    } else if (this.tab() === 'monthly' && this.monthly()) {
      const m = this.monthly()!;
      const rows = [
        ['Employee', 'Days Worked', 'Total Hours'],
        ...m.employeeSummary.map((e) => [e.name, String(e.days), `${e.totalHours}h`]),
      ];
      this.downloadCsv(rows, `report-${m.year}-${String(m.month).padStart(2, '0')}.csv`);
    }
  }

  exportPdf() {
    const title =
      this.tab() === 'daily'
        ? `Daily Report - ${this.selectedDate}`
        : `Monthly Report - ${this.selectedMonth}`;

    let body = '';
    if (this.tab() === 'daily' && this.daily()) {
      const d = this.daily()!;
      body = `
        <p><b>Total Employees:</b> ${d.totalEmployees} | <b>Present:</b> ${d.present} | <b>Absent:</b> ${d.absent} | <b>Rate:</b> ${d.rate}%</p>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
          <tr><th>Employee</th><th>Check In</th><th>Check Out</th><th>Status</th></tr>
          ${d.logs.map((l) => `<tr><td>${l.employee.firstName} ${l.employee.lastName}</td><td>${l.checkInAt ? new Date(l.checkInAt).toLocaleTimeString() : ''}</td><td>${l.checkOutAt ? new Date(l.checkOutAt).toLocaleTimeString() : ''}</td><td>${l.status}</td></tr>`).join('')}
        </table>`;
    } else if (this.tab() === 'monthly' && this.monthly()) {
      const m = this.monthly()!;
      body = `
        <p><b>Total Employees:</b> ${m.totalEmployees} | <b>Avg Rate:</b> ${m.avgRate}%</p>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
          <tr><th>Employee</th><th>Days Worked</th><th>Total Hours</th></tr>
          ${m.employeeSummary.map((e) => `<tr><td>${e.name}</td><td>${e.days}</td><td>${e.totalHours}h</td></tr>`).join('')}
        </table>`;
    }

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>${title}</title></head><body style="font-family:Arial;padding:24px"><h1 style="font-size:20px">${title}</h1>${body}</body></html>`);
    win.document.close();
    win.print();
  }

  private downloadCsv(rows: string[][], filename: string) {
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
