import { IForm, IReviewer } from '@/app/shared/interfaces';
import { Role } from '@/app/shared/enums';
import { httpResource } from '@angular/common/http';
import { Component, computed, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IUsersByRoleResponse } from '../../interfaces';

@Component({
  selector: 'call-reviewers-editor',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './call-reviewers-editor.html'
})
export class CallReviewersEditor {
  readonly value = model.required<IReviewer[]>();
  readonly reviewForm = input.required<IForm[]>();

  protected readonly cartographersResource = httpResource<IUsersByRoleResponse>(
    () => `/users/role/${Role.Cartographer}`
  );
  protected readonly cartographers = computed(() =>
    this.cartographersResource.hasValue() ? this.cartographersResource.value().data : []
  );

  protected readonly phases = computed(() =>
    this.reviewForm()
      .map((section: IForm) => section.phase.trim())
      .filter((phase: string, index: number, phases: string[]) => Boolean(phase) && phases.indexOf(phase) === index)
  );

  protected addReviewer(): void {
    const defaultPhase = this.phases()[0];

    this.value.update((reviewers) => [
      { email: '', phase: defaultPhase ? [defaultPhase] : [], solutionsCount: 0 },
      ...reviewers
    ]);
  }

  protected updateReviewer(index: number, changes: Partial<IReviewer>): void {
    this.value.update((reviewers) =>
      reviewers.map((reviewer, reviewerIndex) => (reviewerIndex === index ? { ...reviewer, ...changes } : reviewer))
    );
  }

  protected updateSolutionsCount(index: number, solutionsCount: number): void {
    this.updateReviewer(index, {
      solutionsCount: Number.isFinite(solutionsCount) ? Math.max(0, Math.trunc(solutionsCount)) : 0
    });
  }

  protected deleteReviewer(index: number): void {
    this.value.update((reviewers) => reviewers.filter((_, reviewerIndex) => reviewerIndex !== index));
  }

  protected unknownPhases(selectedPhases: string[]): string[] {
    return selectedPhases.filter((phase) => !this.phases().includes(phase));
  }

  protected isKnownCartographer(email: string): boolean {
    return this.cartographers().some((user) => user.email === email);
  }

  protected isSelectedByAnotherReviewer(email: string, currentIndex: number): boolean {
    return this.value().some((reviewer, reviewerIndex) => reviewerIndex !== currentIndex && reviewer.email === email);
  }
}
