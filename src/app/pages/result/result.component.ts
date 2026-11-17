import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MAX_STARS, getMission } from '../../data/missions';
import { ProgressService } from '../../services/progress.service';
import { FeedbackListComponent } from '../../shared/feedback-list.component';
import { IconComponent } from '../../shared/icon.component';
import { StarsComponent } from '../../shared/stars.component';

interface Message {
  title: string;
  text: string;
}

@Component({
  selector: 'app-result',
  imports: [RouterLink, DatePipe, IconComponent, StarsComponent, FeedbackListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent {
  private readonly progress = inject(ProgressService);
  private readonly router = inject(Router);

  readonly id = input.required({ transform: numberAttribute });
  readonly mission = computed(() => getMission(this.id())!);
  readonly attempt = computed(() => this.progress.get(this.id())?.last);
  readonly nextMission = computed(() => getMission(this.id() + 1));
  /** The next mission opens only after a perfect score (best try counts). */
  readonly passed = computed(() => this.progress.isPassed(this.id()));

  readonly message = computed<Message>(() => {
    const stars = this.attempt()?.stars ?? 0;
    if (stars === MAX_STARS) {
      return { title: 'Well done, Adventurer!', text: 'You answered every question correctly!' };
    }
    if (stars > 0) {
      return { title: 'Good job, Explorer!', text: 'You’re halfway there! Review the one you missed and try again to get all 4 stars.' };
    }
    return {
      title: 'Oops! Lost in time!',
      text: 'Don’t worry, every great explorer gets lost sometimes. Let’s see what happened!',
    };
  });

  constructor() {
    // If the mission was never played, there is nothing to show yet.
    effect(() => {
      if (!this.attempt()) this.router.navigate(['/mission', this.id()], { replaceUrl: true });
    });
  }
}
