import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MISSIONS } from '../../data/missions';
import { AuthService } from '../../services/auth.service';
import { ProgressService } from '../../services/progress.service';
import { IconComponent } from '../../shared/icon.component';
import { StarsComponent } from '../../shared/stars.component';

@Component({
  selector: 'app-map',
  imports: [RouterLink, NgTemplateOutlet, IconComponent, StarsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  private readonly auth = inject(AuthService);
  readonly progress = inject(ProgressService);

  readonly firstName = computed(() => this.auth.user()?.name.split(' ')[0] ?? '');

  readonly missions = computed(() =>
    MISSIONS.map((m) => ({
      ...m,
      unlocked: this.progress.isUnlocked(m.id),
      passed: this.progress.isPassed(m.id),
      result: this.progress.get(m.id),
    })),
  );

  /** The first mission that is open but not passed yet (gets a highlight). */
  readonly nextId = computed(() => this.missions().find((m) => m.unlocked && !m.passed)?.id);
}
