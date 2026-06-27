import { Component, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Html5Qrcode } from 'html5-qrcode';

type Step = 'setup' | 'ready' | 'scanning' | 'result';

interface Employee { id: string; firstName: string; lastName: string; position?: string; avatarUrl?: string; }

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="app">
      <!-- Header -->
      <div class="app-header">
        <div class="app-brand"><em>in</em>Out</div>
        <div class="clock">{{ now() }}</div>
      </div>

      <!-- Step 1: Setup — enter company code + select name -->
      @if (step() === 'setup') {
        <div class="setup">
          <div class="setup-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2>Welcome</h2>
          <p>Enter your company code to get started</p>
          <div class="input-group">
            <input
              [value]="companyCode"
              (input)="companyCode = $any($event.target).value"
              placeholder="Company code"
            />
            <button class="btn-go" [disabled]="!companyCode || loadingSetup()" (click)="loadCompany()">
              {{ loadingSetup() ? '...' : 'Go' }}
            </button>
          </div>
          @if (setupError()) {
            <p class="error">{{ setupError() }}</p>
          }
        </div>
      }

      <!-- Step 2: Ready — select employee + scan button -->
      @if (step() === 'ready') {
        <div class="ready">
          <p class="company-label">{{ companyName() }}</p>

          <div class="emp-select">
            <p class="select-label">Who are you?</p>
            @for (emp of employees(); track emp.id) {
              <button
                class="emp-chip"
                [class.selected]="selectedEmp()?.id === emp.id"
                (click)="selectedEmp.set(emp)"
              >
                @if (emp.avatarUrl) {
                <img [src]="emp.avatarUrl" class="chip-avatar-img" />
              } @else {
                <div class="chip-avatar">{{ emp.firstName[0] }}</div>
              }
                <div class="chip-info">
                  <strong>{{ emp.firstName }} {{ emp.lastName }}</strong>
                  @if (emp.position) { <span>{{ emp.position }}</span> }
                </div>
              </button>
            }
          </div>

          @if (selectedEmp()) {
            <button class="btn-scan" (click)="startScan()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Scan QR to Check In / Out
            </button>
          }

          <button class="btn-switch" (click)="step.set('setup'); resetState()">Switch Company</button>
        </div>
      }

      <!-- Step 3: Scanning — camera view -->
      @if (step() === 'scanning') {
        <div class="scanning">
          <p class="scan-label">Point camera at the office QR code</p>
          <div class="camera-box">
            <div id="qr-reader"></div>
          </div>
          <button class="btn-cancel" (click)="stopScan()">Cancel</button>
        </div>
      }

      <!-- Step 4: Result — success/fail -->
      @if (step() === 'result') {
        <div class="result" [class.success]="resultOk()" [class.fail]="!resultOk()">
          <div class="result-icon">
            @if (resultOk()) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="48" height="48"><polyline points="20 6 9 17 4 12"/></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="48" height="48"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            }
          </div>
          <h2>{{ resultMsg() }}</h2>
          <p class="result-name">{{ selectedEmp()?.firstName }} {{ selectedEmp()?.lastName }}</p>
          @if (resultTime()) {
            <div class="result-time">{{ resultTime() | date:'HH:mm:ss' }}</div>
          }
          <button class="btn-done" (click)="step.set('ready')">Done</button>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .app {
      min-height: 100vh; min-height: 100dvh;
      background: linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%);
      color: white; display: flex; flex-direction: column; align-items: center;
      padding: 0 20px 32px; font-family: Inter, Arial, sans-serif;
    }
    .app-header {
      width: 100%; max-width: 420px; display: flex; justify-content: space-between;
      align-items: center; padding: 16px 0;
    }
    .app-brand { font-size: 22px; font-weight: 800; }
    .app-brand em { font-style: normal; color: #a5b4fc; }
    .clock { font-size: 14px; color: #a5b4fc; font-weight: 600; font-variant-numeric: tabular-nums; }

    /* Setup */
    .setup { text-align: center; margin-top: 20vh; width: 100%; max-width: 360px; }
    .setup-icon { color: #a5b4fc; margin-bottom: 16px; }
    .setup h2 { margin: 0 0 8px; font-size: 24px; }
    .setup p { color: #a5b4fc; margin: 0 0 24px; font-size: 14px; }
    .input-group { display: flex; gap: 8px; }
    .input-group input {
      flex: 1; padding: 14px 18px; border: 2px solid rgba(165,180,252,0.3);
      border-radius: 14px; background: rgba(255,255,255,0.08); color: white;
      font-size: 16px; outline: none;
    }
    .input-group input::placeholder { color: #818cf8; }
    .input-group input:focus { border-color: #818cf8; }
    .btn-go {
      padding: 14px 24px; border-radius: 14px; border: none;
      background: #6366f1; color: white; font-weight: 700; font-size: 16px; cursor: pointer;
    }
    .btn-go:disabled { opacity: 0.4; }
    .error { color: #fca5a5; font-size: 13px; margin-top: 12px; }

    /* Ready */
    .ready { width: 100%; max-width: 420px; flex: 1; display: flex; flex-direction: column; }
    .company-label {
      text-align: center; color: #a5b4fc; font-size: 13px; font-weight: 600;
      letter-spacing: 1px; text-transform: uppercase; margin: 8px 0 20px;
    }
    .select-label { color: #c7d2fe; font-size: 14px; margin: 0 0 10px; font-weight: 500; }
    .emp-select { flex: 1; display: grid; gap: 8px; align-content: start; }
    .emp-chip {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px; border-radius: 14px;
      border: 2px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
      color: white; cursor: pointer; text-align: left; width: 100%; transition: all 0.15s;
    }
    .emp-chip:hover { background: rgba(255,255,255,0.08); }
    .emp-chip.selected { border-color: #818cf8; background: rgba(99,102,241,0.2); }
    .chip-avatar, .chip-avatar-img {
      width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    }
    .chip-avatar {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: grid; place-items: center; font-weight: 700; font-size: 16px;
    }
    .chip-avatar-img { object-fit: cover; }
    .chip-info { flex: 1; }
    .chip-info strong { display: block; font-size: 15px; }
    .chip-info span { font-size: 12px; color: #a5b4fc; }

    .btn-scan {
      display: flex; align-items: center; justify-content: center; gap: 12px;
      width: 100%; padding: 18px; margin-top: 20px;
      border-radius: 16px; border: none;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; font-size: 17px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 30px rgba(99,102,241,0.4);
      transition: transform 0.15s;
    }
    .btn-scan:active { transform: scale(0.97); }

    .btn-switch {
      background: none; border: none; color: #818cf8; font-size: 13px;
      margin-top: 16px; cursor: pointer; padding: 8px; align-self: center;
    }

    /* Scanning */
    .scanning { width: 100%; max-width: 420px; text-align: center; margin-top: 20px; }
    .scan-label { color: #c7d2fe; font-size: 15px; margin: 0 0 16px; }
    .camera-box {
      border-radius: 20px; overflow: hidden; background: #000;
      aspect-ratio: 1; max-width: 320px; margin: 0 auto 20px;
      border: 3px solid rgba(165,180,252,0.3);
    }
    .camera-box :first-child { width: 100% !important; height: 100% !important; }
    .btn-cancel {
      background: rgba(255,255,255,0.1); border: none; color: white;
      padding: 12px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer;
    }

    /* Result */
    .result { text-align: center; margin-top: 15vh; width: 100%; max-width: 360px; }
    .result-icon {
      width: 80px; height: 80px; border-radius: 50%;
      display: grid; place-items: center; margin: 0 auto 20px;
    }
    .result.success .result-icon { background: rgba(34,197,94,0.2); color: #4ade80; }
    .result.fail .result-icon { background: rgba(248,113,113,0.2); color: #f87171; }
    .result h2 { margin: 0 0 4px; font-size: 24px; }
    .result-name { color: #a5b4fc; margin: 0 0 16px; font-size: 15px; }
    .result-time { font-size: 44px; font-weight: 800; color: #a5b4fc; margin-bottom: 32px; font-variant-numeric: tabular-nums; }
    .btn-done {
      background: rgba(255,255,255,0.1); border: none; color: white;
      padding: 14px 40px; border-radius: 14px; font-size: 16px; font-weight: 600; cursor: pointer;
    }
  `,
})
export class ScanComponent implements OnDestroy {
  step = signal<Step>('setup');
  companyCode = '';
  companyName = signal('');
  employees = signal<Employee[]>([]);
  selectedEmp = signal<Employee | null>(null);
  loadingSetup = signal(false);
  setupError = signal('');
  resultOk = signal(false);
  resultMsg = signal('');
  resultTime = signal<string | null>(null);
  now = signal(this.formatTime());

  private scanner: Html5Qrcode | null = null;
  private token = '';
  private timer: any;

  constructor(private readonly http: HttpClient) {
    this.timer = setInterval(() => this.now.set(this.formatTime()), 1000);
    const saved = localStorage.getItem('scan_token');
    if (saved) { this.companyCode = saved; this.loadCompany(); }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    this.stopScan();
  }

  loadCompany() {
    this.loadingSetup.set(true);
    this.setupError.set('');
    const code = this.companyCode.trim();
    this.http.get<{ name: string }>(`/api/kiosk/${code}`).subscribe({
      next: (c) => {
        this.token = code;
        this.companyName.set(c.name);
        localStorage.setItem('scan_token', code);
        this.http.get<Employee[]>(`/api/kiosk/${code}/employees`).subscribe((emps) => {
          this.employees.set(emps);
          this.loadingSetup.set(false);
          this.step.set('ready');
        });
      },
      error: () => {
        this.loadingSetup.set(false);
        this.setupError.set('Invalid company code');
      },
    });
  }

  startScan() {
    this.step.set('scanning');
    setTimeout(() => {
      this.scanner = new Html5Qrcode('qr-reader');
      this.scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (text) => this.onScanSuccess(text),
        () => {},
      ).catch(() => {
        this.setupError.set('Camera access denied');
        this.step.set('ready');
      });
    }, 100);
  }

  stopScan() {
    if (this.scanner?.isScanning) {
      this.scanner.stop().catch(() => {});
    }
    this.scanner = null;
    if (this.step() === 'scanning') this.step.set('ready');
  }

  resetState() {
    this.token = '';
    this.companyName.set('');
    this.employees.set([]);
    this.selectedEmp.set(null);
    localStorage.removeItem('scan_token');
  }

  private onScanSuccess(qrText: string) {
    this.stopScan();
    const emp = this.selectedEmp();
    if (!emp) return;

    this.http.post<any>(`/api/kiosk/${this.token}/status`, { employeeId: emp.id }).subscribe({
      next: (status) => {
        if (status.checkedIn) {
          this.http.post<any>(`/api/kiosk/${this.token}/check-out`, { employeeId: emp.id }).subscribe({
            next: (res) => this.showResult(true, 'Checked Out', res.time),
            error: (e) => this.showResult(false, e.error?.message || 'Failed', null),
          });
        } else {
          this.http.post<any>(`/api/kiosk/${this.token}/check-in`, { employeeId: emp.id }).subscribe({
            next: (res) => this.showResult(true, 'Checked In', res.time),
            error: (e) => this.showResult(false, e.error?.message || 'Failed', null),
          });
        }
      },
      error: () => this.showResult(false, 'Error checking status', null),
    });
  }

  private showResult(ok: boolean, msg: string, time: string | null) {
    this.resultOk.set(ok);
    this.resultMsg.set(msg);
    this.resultTime.set(time);
    this.step.set('result');
  }

  private formatTime(): string {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }
}
