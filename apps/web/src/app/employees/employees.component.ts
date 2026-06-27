import { Component, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/i18n.service';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header>
      <h1>{{ i18n.t('emp.title') }}</h1>
      <button class="btn-primary" (click)="openAdd()">{{ i18n.t('emp.add') }}</button>
    </header>

    <div class="search-bar">
      <input
        type="text"
        [placeholder]="i18n.t('emp.search')"
        [(ngModel)]="search"
        name="search"
      />
    </div>

    @if (filtered().length === 0 && !loading()) {
      <div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" width="48" height="48"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <p>{{ i18n.t('emp.no_employees') }}</p>
      </div>
    }

    @if (filtered().length > 0) {
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ i18n.t('emp.first_name') }}</th>
              <th>{{ i18n.t('emp.last_name') }}</th>
              <th>{{ i18n.t('emp.position') }}</th>
              <th>{{ i18n.t('emp.phone') }}</th>
              <th>{{ i18n.t('att.status') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (emp of filtered(); track emp.id) {
              <tr>
                <td>
                  <div class="emp-cell">
                    @if (emp.avatarUrl) {
                      <img [src]="emp.avatarUrl" class="avatar" />
                    } @else {
                      <div class="avatar-placeholder">{{ emp.firstName[0] }}</div>
                    }
                    <span class="name">{{ emp.firstName }}</span>
                  </div>
                </td>
                <td class="name">{{ emp.lastName }}</td>
                <td>{{ emp.position || '—' }}</td>
                <td>{{ emp.phone || '—' }}</td>
                <td>
                  <span class="badge" [class.active]="emp.isActive" [class.inactive]="!emp.isActive">
                    {{ emp.isActive ? i18n.t('emp.active') : i18n.t('emp.inactive') }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn-edit" (click)="openEdit(emp)">{{ i18n.t('emp.edit') }}</button>
                    <button class="btn-del" (click)="onDelete(emp)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    @if (showDialog()) {
      <div class="overlay" (click)="closeDialog()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h2>{{ editingId ? i18n.t('emp.edit_title') : i18n.t('emp.add_title') }}</h2>
          <form (ngSubmit)="onSave()" class="form">
            <div class="photo-upload" (click)="fileInput.click()">
              @if (form.avatarUrl) {
                <img [src]="form.avatarUrl" class="photo-preview" />
              } @else {
                <div class="photo-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span>Add Photo</span>
                </div>
              }
              <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)" />
            </div>
            <label>{{ i18n.t('emp.first_name') }}
              <input [(ngModel)]="form.firstName" name="firstName" required />
            </label>
            <label>{{ i18n.t('emp.last_name') }}
              <input [(ngModel)]="form.lastName" name="lastName" required />
            </label>
            <label>{{ i18n.t('emp.position') }}
              <select [(ngModel)]="form.position" name="position">
                <option value="">—</option>
                @for (pos of positions; track pos.value) {
                  <option [value]="pos.value">{{ i18n.t(pos.labelKey) }}</option>
                }
              </select>
            </label>
            <label>{{ i18n.t('emp.phone') }}
              <input [(ngModel)]="form.phone" name="phone" />
            </label>
            <div class="dialog-actions">
              <button type="button" class="btn-cancel" (click)="closeDialog()">{{ i18n.t('emp.cancel') }}</button>
              <button type="submit" class="btn-primary" [disabled]="saving()">{{ i18n.t('emp.save') }}</button>
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
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; border: none; border-radius: 12px;
      padding: 10px 20px; font-weight: 700; font-size: 14px; cursor: pointer;
    }
    .search-bar { margin-bottom: 20px; }
    .search-bar input {
      width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0;
      border-radius: 12px; font-size: 14px; outline: none; background: white;
    }
    .search-bar input:focus { border-color: #6366f1; }
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
    .emp-cell { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; }
    .avatar-placeholder { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; display: grid; place-items: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .name { font-weight: 600; color: #0f172a; }
    .photo-upload { cursor: pointer; display: flex; justify-content: center; margin-bottom: 4px; }
    .photo-preview { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #eef2ff; }
    .photo-empty { width: 80px; height: 80px; border-radius: 50%; background: #f5f3ff; border: 2px dashed #c7d2fe; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6366f1; gap: 2px; }
    .photo-empty span { font-size: 10px; font-weight: 600; }
    .badge {
      padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
    }
    .badge.active { background: #eef2ff; color: #4f46e5; }
    .badge.inactive { background: #fef2f2; color: #dc2626; }
    .btn-edit {
      background: none; border: 1px solid #e2e8f0; border-radius: 8px;
      padding: 6px 14px; font-size: 13px; color: #475569; cursor: pointer;
    }
    .btn-edit:hover { background: #f8fafc; }
    .action-btns { display: flex; gap: 6px; }
    .btn-del { background: none; border: 1px solid #fecaca; border-radius: 8px; padding: 6px 8px; color: #ef4444; cursor: pointer; display: grid; place-items: center; }
    .btn-del:hover { background: #fef2f2; }
    .overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: grid; place-items: center; z-index: 100;
    }
    .dialog {
      background: white; border-radius: 20px; padding: 32px;
      width: 100%; max-width: 440px; box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }
    .dialog h2 { margin: 0 0 20px; font-size: 20px; }
    .form { display: grid; gap: 14px; }
    .form label {
      display: grid; gap: 5px; font-size: 13px; font-weight: 600; color: #374151;
    }
    .form input, .form select {
      padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px;
      font-size: 14px; outline: none; background: white;
    }
    .form input:focus, .form select:focus { border-color: #6366f1; }
    .dialog-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
    .btn-cancel {
      background: #f1f5f9; color: #475569; border: none; border-radius: 10px;
      padding: 10px 20px; font-weight: 600; cursor: pointer;
    }

    @media (max-width: 768px) {
      header { flex-direction: column; gap: 12px; align-items: stretch; }
      .btn-primary { text-align: center; }
      .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      table { min-width: 560px; }
      .dialog { margin: 16px; max-width: none; }
    }
  `,
})
export class EmployeesComponent implements OnInit {
  positions = [
    { value: 'Manager', labelKey: 'pos.manager' },
    { value: 'Supervisor', labelKey: 'pos.supervisor' },
    { value: 'Staff', labelKey: 'pos.staff' },
    { value: 'Cashier', labelKey: 'pos.cashier' },
    { value: 'Barista', labelKey: 'pos.barista' },
    { value: 'Chef', labelKey: 'pos.chef' },
    { value: 'Driver', labelKey: 'pos.driver' },
    { value: 'Security', labelKey: 'pos.security' },
    { value: 'Intern', labelKey: 'pos.intern' },
    { value: 'Other', labelKey: 'pos.other' },
  ];

  employees = signal<Employee[]>([]);
  search = '';
  loading = signal(true);
  showDialog = signal(false);
  saving = signal(false);
  editingId = '';
  form = { firstName: '', lastName: '', position: '', phone: '', avatarUrl: '' };

  filtered = computed(() => {
    const q = this.search.toLowerCase();
    return this.employees().filter(
      (e) =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        (e.position ?? '').toLowerCase().includes(q),
    );
  });

  constructor(
    readonly i18n: I18nService,
    private readonly http: HttpClient,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<Employee[]>('/api/employees').subscribe((data) => {
      this.employees.set(data);
      this.loading.set(false);
    });
  }

  openAdd() {
    this.editingId = '';
    this.form = { firstName: '', lastName: '', position: '', phone: '', avatarUrl: '' };
    this.showDialog.set(true);
  }

  openEdit(emp: Employee) {
    this.editingId = emp.id;
    this.form = {
      firstName: emp.firstName,
      lastName: emp.lastName,
      position: emp.position ?? '',
      phone: emp.phone ?? '',
      avatarUrl: emp.avatarUrl ?? '',
    };
    this.showDialog.set(true);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.form.avatarUrl = reader.result as string; };
    reader.readAsDataURL(file);
  }

  closeDialog() {
    this.showDialog.set(false);
  }

  onDelete(emp: Employee) {
    if (!confirm(`${emp.firstName} ${emp.lastName} — Delete?`)) return;
    this.http.patch(`/api/employees/${emp.id}`, { isActive: false }).subscribe(() => this.load());
  }

  onSave() {
    this.saving.set(true);
    const req$ = this.editingId
      ? this.http.patch(`/api/employees/${this.editingId}`, this.form)
      : this.http.post('/api/employees', this.form);

    req$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeDialog();
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }
}
