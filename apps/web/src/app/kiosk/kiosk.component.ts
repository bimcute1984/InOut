import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

interface Employee { id: string; firstName: string; lastName: string; position?: string; avatarUrl?: string; }
interface Status { checkedIn: boolean; attendanceId: string | null; checkInAt: string | null; }

@Component({
  selector: 'app-kiosk',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="kiosk">
      <div class="kiosk-header">
        <div class="kiosk-brand">
          <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="kg" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#059669"/></linearGradient>
              <linearGradient id="kb" x1=".7" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient>
            </defs>
            <circle cx="30" cy="8" r="7" fill="url(#kg)"/><path d="M30 15C6 28 4 72 40 84" stroke="url(#kg)" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M40 84L24 80 30 68" stroke="url(#kg)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="70" cy="8" r="7" fill="url(#kb)"/><path d="M70 15C94 28 96 72 60 84" stroke="url(#kb)" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M60 84L76 80 70 68" stroke="url(#kb)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="50" cy="46" r="26" fill="white"/>
            <line x1="50" y1="24" x2="50" y2="28" stroke="#334155" stroke-width="2" stroke-linecap="round"/><line x1="50" y1="64" x2="50" y2="68" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="28" y1="46" x2="32" y2="46" stroke="#334155" stroke-width="2" stroke-linecap="round"/><line x1="68" y1="46" x2="72" y2="46" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="46" x2="50" y2="30" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="46" x2="63" y2="40" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="46" r="2.5" fill="#0f172a"/>
          </svg>
          <span><em>in</em>Out</span>
        </div>
        @if (companyName()) { <p class="company">{{ companyName() }}</p> }
      </div>

      <div class="clock">{{ now() }}</div>
      <p class="date">{{ today | date:'EEEE, MMMM d, yyyy' }}</p>

      <!-- Success feedback -->
      @if (feedback()) {
        <div class="feedback" [class.check-in]="feedback()!.action === 'CHECK_IN'" [class.check-out]="feedback()!.action === 'CHECK_OUT'">
          <div class="feedback-icon">
            @if (feedback()!.action === 'CHECK_IN') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            }
          </div>
          <strong>{{ feedback()!.employee }}</strong>
          <span>{{ feedback()!.action === 'CHECK_IN' ? 'Checked In' : 'Checked Out' }}</span>
          <span class="feedback-time">{{ feedback()!.time | date:'HH:mm:ss' }}</span>
        </div>
      }

      <!-- Employee select -->
      @if (!feedback()) {
        <p class="prompt">Select your name to check in / out</p>
        <div class="emp-list">
          @for (emp of employees(); track emp.id) {
            <button class="emp-btn" [disabled]="loading()" (click)="selectEmployee(emp)">
              @if (emp.avatarUrl) {
                <img [src]="emp.avatarUrl" class="emp-avatar-img" />
              } @else {
                <div class="emp-avatar">{{ emp.firstName[0] }}</div>
              }
              <div class="emp-info">
                <strong>{{ emp.firstName }} {{ emp.lastName }}</strong>
                @if (emp.position) { <span>{{ emp.position }}</span> }
              </div>
              <svg class="emp-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          }
        </div>
      }

      <!-- Confirm action -->
      @if (selectedEmp() && !feedback()) {
        <div class="action-overlay" (click)="selectedEmp.set(null)">
          <div class="action-card" (click)="$event.stopPropagation()">
            <div class="action-avatar">{{ selectedEmp()!.firstName[0] }}</div>
            <h2>{{ selectedEmp()!.firstName }} {{ selectedEmp()!.lastName }}</h2>

            @if (empStatus()?.checkedIn) {
              <p class="status-text in">Checked in at {{ empStatus()!.checkInAt | date:'HH:mm' }}</p>
              <button class="action-btn out" [disabled]="loading()" (click)="doCheckOut()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Check Out
              </button>
            } @else {
              <p class="status-text">Not checked in yet</p>
              <button class="action-btn in" [disabled]="loading()" (click)="doCheckIn()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Check In
              </button>
            }

            <button class="cancel-btn" (click)="selectedEmp.set(null)">Cancel</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .kiosk {
      min-height: 100vh;
      background: linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
      color: white; padding: 24px; display: flex; flex-direction: column; align-items: center;
    }
    .kiosk-header { text-align: center; margin-bottom: 20px; }
    .kiosk-brand { display: flex; align-items: center; gap: 10px; justify-content: center; }
    .kiosk-brand .logo { width: 36px; height: 36px; }
    .kiosk-brand span { font-size: 24px; font-weight: 800; }
    .kiosk-brand em { font-style: normal; color: #a5b4fc; }
    .company { color: #94a3b8; font-size: 14px; margin: 6px 0 0; }

    .clock {
      font-size: 56px; font-weight: 800; letter-spacing: 2px;
      background: linear-gradient(135deg, #a5b4fc, #c4b5fd);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin: 8px 0 4px;
    }
    .date { color: #94a3b8; font-size: 14px; margin: 0 0 24px; }

    .prompt { color: #64748b; font-size: 14px; margin: 0 0 16px; }

    .emp-list { width: 100%; max-width: 420px; display: grid; gap: 8px; }
    .emp-btn {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 18px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04); color: white; cursor: pointer;
      text-align: left; width: 100%; transition: all 0.2s;
    }
    .emp-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); }
    .emp-btn:disabled { opacity: 0.5; }
    .emp-avatar, .emp-avatar-img {
      width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    }
    .emp-avatar {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: grid; place-items: center; font-weight: 700; font-size: 16px;
    }
    .emp-avatar-img { object-fit: cover; }
    .emp-info { flex: 1; }
    .emp-info strong { display: block; font-size: 15px; }
    .emp-info span { font-size: 12px; color: #94a3b8; }
    .emp-arrow { width: 20px; height: 20px; color: #475569; }

    /* Action overlay */
    .action-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      display: grid; place-items: center; z-index: 50; padding: 20px;
    }
    .action-card {
      background: white; border-radius: 24px; padding: 40px 32px;
      text-align: center; width: 100%; max-width: 360px; color: #0f172a;
    }
    .action-avatar {
      width: 64px; height: 64px; border-radius: 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; display: grid; place-items: center;
      font-weight: 800; font-size: 24px; margin: 0 auto 16px;
    }
    .action-card h2 { margin: 0 0 8px; font-size: 22px; }
    .status-text { color: #64748b; font-size: 14px; margin: 0 0 24px; }
    .status-text.in { color: #059669; font-weight: 600; }

    .action-btn {
      width: 100%; padding: 16px; border: none; border-radius: 16px;
      font-size: 18px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      color: white; transition: opacity 0.2s;
    }
    .action-btn:hover { opacity: 0.9; }
    .action-btn:disabled { opacity: 0.5; }
    .action-btn.in { background: linear-gradient(135deg, #6366f1, #4f46e5); }
    .action-btn.out { background: linear-gradient(135deg, #f59e0b, #d97706); }

    .cancel-btn {
      margin-top: 12px; background: none; border: none;
      color: #94a3b8; font-size: 14px; cursor: pointer; padding: 8px;
    }

    /* Feedback */
    .feedback {
      background: rgba(255,255,255,0.06); border-radius: 24px;
      padding: 40px; text-align: center; width: 100%; max-width: 360px;
      border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px;
    }
    .feedback-icon { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; margin: 0 auto 16px; }
    .feedback-icon svg { width: 28px; height: 28px; }
    .feedback.check-in .feedback-icon { background: #059669; }
    .feedback.check-out .feedback-icon { background: #d97706; }
    .feedback strong { display: block; font-size: 20px; margin-bottom: 4px; }
    .feedback span { color: #94a3b8; font-size: 14px; }
    .feedback-time { display: block; font-size: 32px; font-weight: 800; margin-top: 12px; color: #a5b4fc; }

    @media (max-width: 480px) {
      .clock { font-size: 42px; }
      .action-card { padding: 32px 24px; }
    }
  `,
})
export class KioskComponent implements OnInit, OnDestroy {
  token = '';
  today = new Date();
  companyName = signal('');
  employees = signal<Employee[]>([]);
  selectedEmp = signal<Employee | null>(null);
  empStatus = signal<Status | null>(null);
  loading = signal(false);
  feedback = signal<{ action: string; employee: string; time: string } | null>(null);
  now = signal(this.formatTime());

  private timer: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    this.http.get<{ name: string }>(`/api/kiosk/${this.token}`).subscribe((c) => this.companyName.set(c.name));
    this.http.get<Employee[]>(`/api/kiosk/${this.token}/employees`).subscribe((e) => this.employees.set(e));
    this.timer = setInterval(() => this.now.set(this.formatTime()), 1000);
  }

  ngOnDestroy() { clearInterval(this.timer); }

  selectEmployee(emp: Employee) {
    this.selectedEmp.set(emp);
    this.empStatus.set(null);
    this.http.post<Status>(`/api/kiosk/${this.token}/status`, { employeeId: emp.id })
      .subscribe((s) => this.empStatus.set(s));
  }

  doCheckIn() {
    this.loading.set(true);
    this.http.post<any>(`/api/kiosk/${this.token}/check-in`, { employeeId: this.selectedEmp()!.id })
      .subscribe({
        next: (res) => { this.loading.set(false); this.selectedEmp.set(null); this.showFeedback(res); },
        error: () => this.loading.set(false),
      });
  }

  doCheckOut() {
    this.loading.set(true);
    this.http.post<any>(`/api/kiosk/${this.token}/check-out`, { employeeId: this.selectedEmp()!.id })
      .subscribe({
        next: (res) => { this.loading.set(false); this.selectedEmp.set(null); this.showFeedback(res); },
        error: () => this.loading.set(false),
      });
  }

  private showFeedback(res: any) {
    this.feedback.set(res);
    setTimeout(() => this.feedback.set(null), 4000);
  }

  private formatTime(): string {
    const d = new Date();
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }
}
