import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'scan',
    loadComponent: () =>
      import('./scan/scan.component').then((m) => m.ScanComponent),
  },
  {
    path: 'kiosk/:token',
    loadComponent: () =>
      import('./kiosk/kiosk.component').then((m) => m.KioskComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./employees/employees.component').then(
            (m) => m.EmployeesComponent,
          ),
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./attendance/attendance.component').then(
            (m) => m.AttendanceComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./reports/reports.component').then(
            (m) => m.ReportsComponent,
          ),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./schedule/schedule.component').then(
            (m) => m.ScheduleComponent,
          ),
      },
      {
        path: 'leave',
        loadComponent: () =>
          import('./leave/leave.component').then((m) => m.LeaveComponent),
      },
      {
        path: 'billing',
        loadComponent: () =>
          import('./billing/billing.component').then(
            (m) => m.BillingComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    canActivate: [() => {
      const auth = inject(AuthService);
      if (auth.isLoggedIn()) return inject(Router).createUrlTree(['/dashboard']);
      return inject(Router).createUrlTree(['/home']);
    }],
    children: [],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
