import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="content">
        <div class="code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a routerLink="/home" class="btn">Go Home</a>
      </div>
    </div>
  `,
  styles: `
    .page { min-height: 100vh; display: grid; place-items: center; background: #f8fafc; font-family: Inter, Arial, sans-serif; padding: 24px; }
    .content { text-align: center; }
    .code { font-size: 100px; font-weight: 900; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
    h1 { margin: 8px 0; font-size: 24px; color: #0f172a; }
    p { color: #64748b; margin: 0 0 24px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: 700; }
  `,
})
export class NotFoundComponent {}
