import { httpResource } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, viewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access';
import { ISolution } from '@/app/shared/interfaces';
import { FormRenderer } from '@/app/shared/ui';
import { Message } from '@/app/shared/ui/message/message';
import { ReviewStore } from '../../data-access/review.store';
import { IReviewPayload } from '../../interfaces';

@Component({
  selector: 'app-review-solution',
  imports: [DecimalPipe, FormRenderer, Message, MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  providers: [ReviewStore],
  templateUrl: './review-solution.html'
})
export default class ReviewSolution {
  readonly id = input.required<string>();

  protected readonly store = inject(ReviewStore);
  private readonly authStore = inject(AuthStore);
  protected readonly formRenderers = viewChildren(FormRenderer);

  protected readonly solutionsResource = httpResource<{ data: [ISolution[], number] }>(() => '/solutions/reviewer/me');
  protected readonly solution = computed(() =>
    this.solutionsResource.value()?.data[0].find((solution) => solution.id === this.id())
  );
  private readonly assignedPhases = computed(() => {
    const user = this.authStore.user();
    if (!user) return [];

    const phases = (this.solution()?.call.reviewers ?? [])
      .filter((reviewer) => reviewer.email === user.email)
      .flatMap((reviewer) => this.normalizePhases(reviewer.phase));

    return [...new Set(phases)];
  });
  protected readonly reviewSections = computed(() => {
    const solution = this.solution();
    if (!solution) return [];

    const assignedPhases = this.assignedPhases();
    return solution.call.review_form.filter((section) => assignedPhases.includes(section.phase.trim()));
  });
  private readonly assignedReview = computed(() => {
    const user = this.authStore.user();
    if (!user) return undefined;

    return this.solution()?.reviews.find((review) => review.reviewer === user.id || review.reviewer === user.email);
  });
  protected readonly review = computed(() => this.store.review() ?? this.assignedReview());
  protected readonly initialResponses = computed(() => this.review()?.data ?? {});
  protected readonly invalid = computed(() => {
    const renderers = this.formRenderers();
    return renderers.length === 0 || renderers.some((renderer) => renderer.invalid());
  });
  protected readonly note = computed(() => {
    const numericValues = this.formRenderers().flatMap((renderer) => renderer.numericValues());
    return numericValues.length ? numericValues.reduce((total, value) => total + value, 0) / numericValues.length : 0;
  });

  protected onSubmit(): void {
    const renderers = this.formRenderers();
    const solution = this.solution();
    if (!renderers.length || !solution || renderers.some((renderer) => renderer.answerForm().invalid())) return;

    const data = Object.assign({}, ...renderers.map((renderer) => renderer.responses()));
    const payload: IReviewPayload = {
      data,
      note: this.note(),
      solution: solution.id
    };
    const review = this.review();

    if (review) {
      this.store.updateReview({ id: review.id, payload });
      return;
    }

    this.store.createReview(payload);
  }

  private normalizePhases(value: unknown): string[] {
    const phases = Array.isArray(value) ? value : [value];

    return phases
      .filter((phase): phase is string => typeof phase === 'string')
      .map((phase) => phase.trim())
      .filter(Boolean);
  }
}
