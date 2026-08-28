import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
  imports: [FormRenderer, Message, MatButtonModule, MatIconModule, RouterLink],
  providers: [ReviewStore],
  templateUrl: './review-solution.html'
})
export default class ReviewSolution {
  readonly id = input.required<string>();

  protected readonly store = inject(ReviewStore);
  private readonly authStore = inject(AuthStore);
  protected readonly formRenderer = viewChild(FormRenderer);

  protected readonly solutionsResource = httpResource<{ data: [ISolution[], number] }>(() => '/solutions/reviewer/me');
  protected readonly solution = computed(() =>
    this.solutionsResource.value()?.data[0].find((solution) => solution.id === this.id())
  );
  private readonly assignedReview = computed(() => {
    const user = this.authStore.user();
    if (!user) return undefined;

    return this.solution()?.reviews.find((review) => review.reviewer === user.id || review.reviewer === user.email);
  });
  protected readonly review = computed(() => this.store.review() ?? this.assignedReview());
  protected readonly initialResponses = computed(() => this.review()?.data ?? {});

  protected onSubmit(): void {
    const renderer = this.formRenderer();
    const solution = this.solution();
    if (!renderer || !solution || renderer.answerForm().invalid()) return;

    const payload: IReviewPayload = {
      data: renderer.responses(),
      solution: solution.id
    };
    const review = this.review();

    if (review) {
      this.store.updateReview({ id: review.id, payload });
      return;
    }

    this.store.createReview(payload);
  }
}
