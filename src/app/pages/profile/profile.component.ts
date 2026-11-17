import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MISSIONS } from '../../data/missions';
import { AuthService } from '../../services/auth.service';
import { ProgressService } from '../../services/progress.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (auth.user(); as u) {
      <header class="top">
        <div class="avatar fade-up">{{ u.name.charAt(0).toUpperCase() }}</div>
        <h1 class="fade-up">{{ u.name }}</h1>
        <span class="chip fade-up">🎒 {{ u.grade }}</span>
      </header>

      <section class="content">
        <div class="stats fade-up">
          <div class="stat">
            <strong>{{ progress.totalStars() }}</strong>
            <span>⭐ Stars</span>
          </div>
          <div class="stat">
            <strong>{{ progress.completedCount() }}/{{ badges().length }}</strong>
            <span>🧭 Missions</span>
          </div>
          <div class="stat">
            <strong>{{ u.createdAt | date: 'MMM d' }}</strong>
            <span>📅 Joined</span>
          </div>
        </div>

        <h2>My badges</h2>
        <div class="badges">
          @for (b of badges(); track b.name) {
            <div class="badge fade-up" [class.earned]="b.earned" [style.--accent]="b.color">
              <span class="medal" aria-hidden="true">{{ b.earned ? b.emoji : '🔒' }}</span>
              <span class="name">{{ b.name }}</span>
            </div>
          }
        </div>

        <button type="button" class="btn logout block" (click)="logout()">
          <app-icon name="logout" /> Log out
        </button>
      </section>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: calc(32px + var(--safe-top)) 22px 30px;
      background:
        radial-gradient(circle at 50% 0%, rgba(255, 197, 49, 0.5), transparent 60%),
        linear-gradient(160deg, #e0682a 0%, var(--clay) 60%, #a8401a 100%);
      color: #fff;
      border-radius: 0 0 34px 34px;
      box-shadow: var(--shadow);
      text-align: center;

      h1 {
        font-size: 1.9rem;
        font-weight: 700;
        word-break: break-word;
      }
    }
    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: linear-gradient(160deg, #ffd25e, var(--sun));
      color: var(--clay-dark);
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 2.8rem;
      border: 5px solid rgba(255, 255, 255, 0.85);
      box-shadow: var(--shadow);
    }
    .content {
      padding: 22px 18px;

      h2 {
        font-size: 1.3rem;
        color: var(--clay-dark);
        margin: 26px 4px 12px;
      }
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 14px 6px;
      background: var(--paper);
      border-radius: var(--r);
      box-shadow: var(--shadow-sm);

      strong {
        font-family: var(--font-display);
        font-size: 1.35rem;
        font-weight: 600;
      }
      span {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--ink-soft);
      }
    }
    .badges {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 6px;
      border-radius: var(--r);
      background: #efe6dc;
      color: var(--ink-faint);
      text-align: center;

      &.earned {
        background: var(--paper);
        color: var(--ink);
        box-shadow: var(--shadow-sm);
        border-bottom: 4px solid var(--accent);
      }
    }
    .medal {
      font-size: 2rem;
      width: 54px;
      height: 54px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
    }
    .earned .medal {
      background: color-mix(in srgb, var(--accent) 16%, white);
    }
    .name {
      font-size: 0.78rem;
      font-weight: 800;
      line-height: 1.2;
    }
    .logout {
      margin-top: 30px;
      background: var(--paper);
      color: var(--bad);
      border: 2px solid #f4b4ae;
    }
  `,
})
export class ProfileComponent {
  readonly auth = inject(AuthService);
  readonly progress = inject(ProgressService);
  private readonly router = inject(Router);

  private readonly badgeInfo: Record<number, { emoji: string; name: string }> = {
    1: { emoji: '🏺', name: 'Nile Explorer' },
    2: { emoji: '🦉', name: 'Greek Thinker' },
    3: { emoji: '🏛️', name: 'Roman Citizen' },
  };

  readonly badges = computed(() =>
    MISSIONS.map((m) => ({
      ...this.badgeInfo[m.id],
      color: m.color,
      earned: this.progress.isPassed(m.id),
    })),
  );

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
