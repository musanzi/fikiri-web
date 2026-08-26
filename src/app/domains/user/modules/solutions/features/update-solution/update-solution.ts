import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, viewChild } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthStore } from '@/app/domains/auth/data-access';
import { ISolution } from '@/app/shared/interfaces';
import { FormRenderer } from '@/app/shared/ui/form-renderer/form-renderer';
import { UpdateSolutionStore } from '../../data-access/update-solution.store';
import { IUpdateSolutionPayload } from '../../interfaces';

@Component({
  imports: [FormField, FormRenderer, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterLink],
  providers: [UpdateSolutionStore],
  templateUrl: './update-solution.html'
})
export default class UpdateSolution {
  private readonly authStore = inject(AuthStore);
  private readonly solutionId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  protected readonly store = inject(UpdateSolutionStore);
  protected readonly formRenderer = viewChild(FormRenderer);

  protected readonly solutionsResource = httpResource<{ data: ISolution[] }>(() => {
    const userId = this.authStore.user()?.id;
    return userId ? `/solutions/user/${userId}` : undefined;
  });

  protected readonly solution = computed(() =>
    this.solutionsResource.value()?.data.find(({ id }) => id === this.solutionId)
  );

  protected readonly solutionModel = linkedSignal(() => ({
    name: this.solution()?.name ?? '',
    description: this.solution()?.description ?? '',
    problem_solved: this.solution()?.problem_solved ?? ''
  }));

  protected readonly solutionForm = form(this.solutionModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Le nom est requis.' });
    required(schemaPath.description, { message: 'La description est requise.' });
    required(schemaPath.problem_solved, { message: 'Le problème résolu est requis.' });
  });

  protected onSubmit(): void {
    const renderer = this.formRenderer();
    if (!renderer || renderer.invalid()) return;

    submit(this.solutionForm, async (formState) => {
      const payload: IUpdateSolutionPayload = {
        ...formState().value(),
        responses: renderer.responses()
      };

      this.store.updateSolution({ id: this.solutionId, payload });
    });
  }
}
