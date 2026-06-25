import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../core/i18n.service';

interface Schedule {
  id: string; name: string; startTime: string;
  endTime: string; daysOfWeek: number[]; isActive: boolean;
}

const DAY_KEYS = ['sched.sun','sched.mon','sched.tue','sched.wed','sched.thu','sched.fri','sched.sat'];

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header>
      <h1>{{ i18n.t('sched.title') }}</h1>
      <button class="btn-primary" (click)="openAdd()">{{ i18n.t('sched.add') }}</button>
    </header>

    @if (schedules().length === 0 && !loading()) {
      <div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" width="48" height="48"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p>{{ i18n.t('sched.no_schedules') }}</p>
      </div>
    }

    <div class="grid">
      @for (s of schedules(); track s.id) {
        <div class="shift-card" [class.inactive]="!s.isActive">
          <div class="shift-header">
            <h3>{{ s.name }}</h3>
            <span class="badge" [class.active]="s.isActive">{{ s.isActive ? i18n.t('emp.active') : i18n.t('emp.inactive') }}</span>
          </div>
          <div class="shift-time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ s.startTime }} — {{ s.endTime }}
          </div>
          <div class="shift-days">
            @for (d of [0,1,2,3,4,5,6]; track d) {
              <span class="day" [class.on]="s.daysOfWeek.includes(d)">{{ i18n.t(dayKeys[d]) }}</span>
            }
          </div>
        </div>
      }
    </div>

    @if (showDialog()) {
      <div class="overlay" (click)="showDialog.set(false)">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h2>{{ i18n.t('sched.add_title') }}</h2>
          <form (ngSubmit)="onSave()" class="form">
            <label>{{ i18n.t('sched.name') }}
              <input [(ngModel)]="form.name" name="name" required />
            </label>
            <div class="row">
              <label>{{ i18n.t('sched.start') }}
                <input type="time" [(ngModel)]="form.startTime" name="startTime" required />
              </label>
              <label>{{ i18n.t('sched.end') }}
                <input type="time" [(ngModel)]="form.endTime" name="endTime" required />
              </label>
            </div>
            <label>{{ i18n.t('sched.days') }}</label>
            <div class="days-pick">
              @for (d of [1,2,3,4,5,6,0]; track d) {
                <button type="button" class="day-btn" [class.selected]="form.daysOfWeek.includes(d)" (click)="toggleDay(d)">
                  {{ i18n.t(dayKeys[d]) }}
                </button>
              }
            </div>
            <div class="dialog-actions">
              <button type="button" class="btn-cancel" (click)="showDialog.set(false)">{{ i18n.t('sched.cancel') }}</button>
              <button type="submit" class="btn-primary">{{ i18n.t('sched.save') }}</button>
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
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .shift-card {
      background: white; border-radius: 20px; padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); border-left: 4px solid #6366f1;
    }
    .shift-card.inactive { opacity: 0.5; border-left-color: #94a3b8; }
    .shift-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .shift-header h3 { margin: 0; font-size: 16px; }
    .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge.active { background: #eef2ff; color: #4f46e5; }
    .shift-time { display: flex; align-items: center; gap: 8px; color: #475569; font-size: 20px; font-weight: 700; margin-bottom: 14px; }
    .shift-days { display: flex; gap: 6px; }
    .day { width: 32px; height: 32px; border-radius: 8px; display: grid; place-items: center; font-size: 11px; font-weight: 700; color: #94a3b8; background: #f8fafc; }
    .day.on { background: #6366f1; color: white; }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: grid; place-items: center; z-index: 100; }
    .dialog { background: white; border-radius: 20px; padding: 32px; width: 100%; max-width: 460px; }
    .dialog h2 { margin: 0 0 20px; font-size: 20px; }
    .form { display: grid; gap: 14px; }
    .form label { display: grid; gap: 5px; font-size: 13px; font-weight: 600; color: #374151; }
    .form input { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 14px; outline: none; }
    .form input:focus { border-color: #6366f1; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .days-pick { display: flex; gap: 6px; }
    .day-btn {
      width: 42px; height: 42px; border-radius: 10px; border: 2px solid #e2e8f0;
      background: white; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer;
    }
    .day-btn.selected { background: #6366f1; color: white; border-color: #6366f1; }
    .dialog-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
    .btn-cancel { background: #f1f5f9; color: #475569; border: none; border-radius: 10px; padding: 10px 20px; font-weight: 600; cursor: pointer; }

    @media (max-width: 768px) {
      header { flex-direction: column; gap: 12px; align-items: stretch; }
      .btn-primary { text-align: center; }
      .grid { grid-template-columns: 1fr; }
      .dialog { margin: 16px; max-width: none; }
      .days-pick { flex-wrap: wrap; }
      .day-btn { width: 38px; height: 38px; }
    }
  `,
})
export class ScheduleComponent implements OnInit {
  schedules = signal<Schedule[]>([]);
  showDialog = signal(false);
  loading = signal(true);
  form = { name: '', startTime: '09:00', endTime: '18:00', daysOfWeek: [1,2,3,4,5] as number[] };
  dayKeys = DAY_KEYS;

  constructor(readonly i18n: I18nService, private readonly http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<Schedule[]>('/api/schedules').subscribe((d) => { this.schedules.set(d); this.loading.set(false); });
  }

  openAdd() {
    this.form = { name: '', startTime: '09:00', endTime: '18:00', daysOfWeek: [1,2,3,4,5] };
    this.showDialog.set(true);
  }

  toggleDay(d: number) {
    const i = this.form.daysOfWeek.indexOf(d);
    if (i >= 0) this.form.daysOfWeek.splice(i, 1);
    else this.form.daysOfWeek.push(d);
  }

  onSave() {
    this.http.post('/api/schedules', this.form).subscribe(() => {
      this.showDialog.set(false);
      this.load();
    });
  }
}
