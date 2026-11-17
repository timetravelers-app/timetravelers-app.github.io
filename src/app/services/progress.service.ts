import { Injectable, computed, inject } from '@angular/core';
import { MAX_STARS, MISSIONS, getMission, starsFor } from '../data/missions';
import { Attempt, AuthService, MissionProgress } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly auth = inject(AuthService);

  private readonly progress = computed(() => this.auth.user()?.progress ?? {});

  /** Missions passed with every answer correct. */
  readonly completedCount = computed(
    () => Object.values(this.progress()).filter((p) => p.bestStars === MAX_STARS).length,
  );
  readonly totalStars = computed(() =>
    Object.values(this.progress()).reduce((sum, p) => sum + p.bestStars, 0),
  );
  readonly maxStars = MISSIONS.length * MAX_STARS;

  get(missionId: number): MissionProgress | undefined {
    return this.progress()[missionId];
  }

  /** True if the mission was played at least once (it appears in the Journal). */
  isPlayed(missionId: number): boolean {
    return !!this.get(missionId);
  }

  /** A mission is passed only when every answer was correct at least once. */
  isPassed(missionId: number): boolean {
    return this.get(missionId)?.bestStars === MAX_STARS;
  }

  /** Mission 1 is always open. Every other mission needs the previous one passed 100%. */
  isUnlocked(missionId: number): boolean {
    return missionId === 1 || this.isPassed(missionId - 1);
  }

  saveAttempt(missionId: number, answers: number[]): Attempt {
    const user = this.auth.user();
    const mission = getMission(missionId);
    if (!user || !mission) throw new Error('No user or mission');

    const correct = mission.questions.filter((q, i) => q.correct === answers[i]).length;
    const attempt: Attempt = {
      answers,
      correct,
      stars: starsFor(correct, mission.questions.length),
      date: new Date().toISOString(),
    };

    const previous = user.progress[missionId];
    const updated: MissionProgress = {
      bestStars: Math.max(previous?.bestStars ?? 0, attempt.stars),
      attempts: (previous?.attempts ?? 0) + 1,
      last: attempt,
    };

    this.auth.updateUser({ ...user, progress: { ...user.progress, [missionId]: updated } });
    return attempt;
  }
}
