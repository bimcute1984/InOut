import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { I18nService } from '../core/i18n.service';

interface Employee { id: string; firstName: string; lastName: string; }
interface LeaveReq {
  id: string; type: string; startDate: string; endDate: string;
  reason: string | null; status: string;
  employee: { firstName: string; lastName: string };
}

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <header>
      <h1>{{ i18n.t('leave.title') }}</h1>
      <button class="btn-primary" (click)="showDialog.set(true)">{{ i18n.t('leave.add') }}</button>
    </header>

    @if (leaves().length === 0 && !loading()) {
      <div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" width="48" height="48"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <p>{{ i18n.t('leave.no_leaves') }}</p>
      </div>
    }

    @if (leaves().length > 0) {
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ i18n.t('rpt.employee') }}</th>
              <th>{{ i18n.t('leave.type') }}</th>
              <th>{{ i18n.t('leave.start') }}</th>
              <th>{{ i18n.t('leave.end') }}</th>
              <th>{{ i18n.t('leave.reason') }}</th>
              <th>{{ i18n.t('leave.status') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (l of leaves(); track l.id) {
              <tr>
                <td class="name">{{ l.employee.firstName }} {{ l.employee.lastName }}</td>
                <td>{{ leaveTypeLabel(l.type) }}</td>
                <td>{{ l.startDate | date:'yyyy-MM-dd' }}</td>
                <td>{{ l.endDate | date:'yyyy-MM-dd' }}</td>
                <td>{{ l.reason || '—' }}</td>
                <td>
                  <span class="badge" [class]="l.status.toLowerCase()">
                    {{ i18n.t('leave.' + l.status.toLowerCase()) }}
                  </span>
                </td>
                <td>
                  @if (l.status === 'PENDING') {
                    <div class="action-btns">
                      <button class="btn-approve" (click)="updateStatus(l.id, 'APPROVED')">{{ i18n.t('leave.approve') }}</button>
                      <button class="btn-reject" (click)="updateStatus(l.id, 'REJECTED')">{{ i18n.t('leave.reject') }}</button>
                    </div>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    @if (showDialog()) {
      <div class="overlay" (click)="showDialog.set(false)">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h2>{{ i18n.t('leave.add') }}</h2>
          <form (ngSubmit)="onSubmit()" class="form">
            <label>{{ i18n.t('att.select_employee') }}
              <select [(ngModel)]="form.employeeId" name="employeeId" required>
                <option value="">—</option>
                @for (emp of employees(); track emp.id) {
                  <option [value]="emp.id">{{ emp.firstName }} {{ emp.lastName }}</option>
                }
              </select>
            </label>
            <label>{{ i18n.t('leave.type') }}
              <select [(ngModel)]="form.type" name="type" required>
                <option value="SICK">{{ i18n.t('leave.sick') }}</option>
                <option value="ANNUAL">{{ i18n.t('leave.annual') }}</option>
                <option value="PERSONAL">{{ i18n.t('leave.personal') }}</option>
              </select>
            </label>
            <div class="row">
              <label>{{ i18n.t('leave.start') }}<input type="date" [(ngModel)]="form.startDate" name="startDate" required /></label>
              <label>{{ i18n.t('leave.end') }}<input type="date" [(ngModel)]="form.endDate" name="endDate" required /></label>
            </div>
            <label>{{ i18n.t('leave.reason') }}<input [(ngModel)]="form.reason" name="reason" /></label>
            <div class="dialog-actions">
              <button type="button" class="btn-cancel" (click)="showDialog.set(false)">{{ i18n.t('leave.cancel') }}</button>
              <button type="submit" class="btn-primary">{{ i18n.t('leave.submit') }}</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; color: #0f172a; }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border: none; border-radius: 12px; padding: 10px 20px; font-weight: 700; font-size: 14px; cursor: pointer;
    }
    .empty { display: flex; flex-direction: column; align-items: center; padding: 60px 0; color: #94a3b8; }
    .empty p { margin: 16px 0 0; color: #64748b; font-weight: 600; }
    .table-wrap { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 14px 16px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9; }
    td { padding: 14px 16px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
    .name { font-weight: 600; color: #0f172a; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge.pending { background: #fef3c7; color: #d97706; }
    .badge.approved { background: #eef2ff; color: #4f46e5; }
    .badge.rejected { background: #fef2f2; color: #dc2626; }
    .action-btns { display: flex; gap: 6px; }
    .btn-approve { background: #eef2ff; color: #4f46e5; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .btn-reject { background: #fef2f2; color: #dc2626; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: grid; place-items: center; z-index: 100; }
    .dialog { background: white; border-radius: 20px; padding: 32px; width: 100%; max-width: 460px; }
    .dialog h2 { margin: 0 0 20px; font-size: 20px; }
    .form { display: grid; gap: 14px; }
    .form label { display: grid; gap: 5px; font-size: 13px; font-weight: 600; color: #374151; }
    .form input, .form select { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 14px; outline: none; background: white; }
    .form input:focus, .form select:focus { border-color: #6366f1; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .dialog-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
    .btn-cancel { background: #f1f5f9; color: #475569; border: none; border-radius: 10px; padding: 10px 20px; font-weight: 600; cursor: pointer; }

    @media (max-width: 768px) {
      header { flex-direction: column; gap: 12px; align-items: stretch; }
      .btn-primary { text-align: center; }
      .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      table { min-width: 640px; }
      .dialog { margin: 16px; max-width: none; }
      .row { grid-template-columns: 1fr; }
    }
  `,
})
export class LeaveComponent implements OnInit {
  leaves = signal<LeaveReq[]>([]);
  employees = signal<Employee[]>([]);
  showDialog = signal(false);
  loading = signal(true);
  form = { employeeId: '', type: 'ANNUAL', startDate: '', endDate: '', reason: '' };

  constructor(readonly i18n: I18nService, private readonly http: HttpClient) {}

  ngOnInit() {
    this.http.get<LeaveReq[]>('/api/leaves').subscribe((d) => { this.leaves.set(d); this.loading.set(false); });
    this.http.get<Employee[]>('/api/employees').subscribe((d) => this.employees.set(d.filter((e: any) => e.isActive)));
  }

  leaveTypeLabel(type: string) {
    const map: Record<string, string> = { SICK: 'leave.sick', ANNUAL: 'leave.annual', PERSONAL: 'leave.personal' };
    return this.i18n.t(map[type] || type);
  }

  onSubmit() {
    this.http.post('/api/leaves', this.form).subscribe(() => {
      this.showDialog.set(false);
      this.http.get<LeaveReq[]>('/api/leaves').subscribe((d) => this.leaves.set(d));
    });
  }

  updateStatus(id: string, status: string) {
    this.http.patch(`/api/leaves/${id}/status`, { status }).subscribe(() => {
      this.http.get<LeaveReq[]>('/api/leaves').subscribe((d) => this.leaves.set(d));
    });
  }
}
