import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { IField, IForm, IFormResponses, ISolution, SolutionStatus } from '@/app/shared/interfaces';
import { UpdateSolutionStore } from '../../data-access/update-solution.store';
import { ISolutionAnswerView, ISolutionReviewView, IUpdateSolutionPayload } from '../../interfaces';

@Component({
  selector: 'app-update-solution',
  imports: [
    DatePipe,
    FormField,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    RouterLink
  ],
  providers: [UpdateSolutionStore],
  templateUrl: './update-solution.html'
})
export default class UpdateSolution {
  readonly id = input.required<string>();

  protected readonly store = inject(UpdateSolutionStore);
  protected readonly statuses: readonly { value: SolutionStatus; label: string }[] = [
    { value: 'pending', label: 'En attente' },
    { value: 'mapped', label: 'Cartographiée' },
    { value: 'explored', label: 'Explorée' },
    { value: 'experimented', label: 'Expérimentée' }
  ];

  protected readonly solutionResource = httpResource<{ data: ISolution }>(() => `/solutions/${this.id()}`);
  protected readonly statusModel = linkedSignal(() => ({
    status: this.solutionResource.value()?.data.status ?? ('pending' as SolutionStatus)
  }));
  protected readonly statusForm = form(this.statusModel, (schemaPath) => {
    required(schemaPath.status, { message: 'Le statut est requis.' });
  });
  protected readonly submissionAnswers = computed(() => {
    const solution = this.solutionResource.value()?.data;
    return solution ? this.answers(solution.call.form, solution.responses) : [];
  });
  protected readonly reviewViews = computed<ISolutionReviewView[]>(() => {
    const solution = this.solutionResource.value()?.data;
    console.log(this.solutionResource.value()?.data);
    if (!solution) return [];

    return solution.reviews.map((review) => ({
      review,
      answers: this.answers(solution.call.review_form, review.data)
    }));
  });

  protected onStatusSubmit(): void {
    submit(this.statusForm, async (formState) => {
      const payload: IUpdateSolutionPayload = formState().value();
      this.store.updateSolution({ id: this.id(), payload });
    });
  }

  private answers(sections: IForm[], responses: IFormResponses): ISolutionAnswerView[] {
    return sections.flatMap((section) =>
      section.fields.map((field) => ({
        label: field.label,
        value: this.answerValue(field, responses[field.name])
      }))
    );
  }

  private answerValue(field: IField, response: string | string[] | undefined): string {
    if (response === undefined || response === '' || (Array.isArray(response) && response.length === 0)) return '—';

    const values = Array.isArray(response) ? response : [response];
    return values.map((value) => field.options?.find((option) => option.value === value)?.label ?? value).join(', ');
  }
}
