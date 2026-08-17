import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { applyEach, form, FormField, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { ICallSolution, IField } from '@/app/core/interfaces';
import { environment } from '@/environments/environment';
import { SubmitSolutionStore } from '../../data-access/submit-solution.store';
import {
  CreateSolutionPayload,
  SolutionDetailsModel,
  SubmissionAnswer,
  SubmissionAnswersModel,
  SubmissionCallResponse
} from '../../interfaces/submission.interface';

const THUMBNAIL_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

@Component({
  imports: [
    FormField,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    RouterLink
  ],
  providers: [SubmitSolutionStore],
  templateUrl: './submit-solution.html'
})
export default class SubmitSolution {
  protected store = inject(SubmitSolutionStore);

  protected currentCallsResource = httpResource<{ data: ICallSolution[] }>(() => '/calls/find/current');

  protected callSelectionModel = signal({ call: '' });
  protected callSelectionForm = form(this.callSelectionModel, (schemaPath) => {
    required(schemaPath.call, { message: 'Sélectionnez un appel.' });
  });

  protected selectedCallId = computed(() => this.callSelectionModel().call);
  protected callResource = httpResource<SubmissionCallResponse>(() => {
    const callId = this.selectedCallId();
    return callId ? `/calls/${callId}` : undefined;
  });

  protected callCoverUrl = computed(() => {
    const cover = this.callResource.hasValue() ? this.callResource.value().data.cover : null;
    return cover ? `${environment.apiUrl}/uploads/calls/covers/${cover}` : '/images/no-img.png';
  });

  protected formSections = computed(() => {
    let answerIndex = 0;
    const sections = this.callResource.hasValue() ? (this.callResource.value().data.form ?? []) : [];
    return sections.map((section) => ({
      phase: section.phase,
      questions: section.fields.map((field) => ({ field, answerIndex: answerIndex++ }))
    }));
  });

  protected answersModel = linkedSignal<SubmissionAnswersModel>(() => ({
    answers: this.callResource.hasValue() ? this.buildAnswers(this.callResource.value().data.form ?? []) : []
  }));

  protected solutionDetailsModel = signal<SolutionDetailsModel>({
    name: '',
    description: '',
    problem_solved: ''
  });
  protected solutionDetailsForm = form(this.solutionDetailsModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Le nom de la solution est requis.' });
    required(schemaPath.description, { message: 'La description de la solution est requise.' });
    required(schemaPath.problem_solved, { message: 'Le problème résolu est requis.' });
  });

  protected answersForm = form(this.answersModel, (schemaPath) => {
    applyEach(schemaPath.answers, (answer) => {
      required(answer.value, {
        message: 'Ce champ est requis.',
        when: ({ valueOf }) => valueOf(answer.required) && valueOf(answer.type) !== 'checkbox'
      });
      validate(answer.options, ({ value, valueOf }) =>
        valueOf(answer.required) && valueOf(answer.type) === 'checkbox' && !value().some((option) => option.checked)
          ? { kind: 'required', message: 'Sélectionnez au moins une option.' }
          : undefined
      );
    });
  });

  protected thumbnail = signal<File | undefined>(undefined);
  protected thumbnailError = signal('');

  protected onSubmit(): void {
    const thumbnail = this.thumbnail();
    if (!thumbnail) {
      this.thumbnailError.set("L'image de la solution est requise.");
      return;
    }

    submit(this.callSelectionForm, async () => {
      await submit(this.solutionDetailsForm, async () => {
        await submit(this.answersForm, async () => {
          const payload: CreateSolutionPayload = {
            call: this.selectedCallId(),
            ...this.solutionDetailsModel(),
            responses: this.responses()
          };
          this.store.submitSolution({ payload, thumbnail });
        });
      });
    });
  }

  protected onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!THUMBNAIL_TYPES.has(file.type)) {
      this.thumbnail.set(undefined);
      this.thumbnailError.set('Sélectionnez une image JPEG, PNG ou WebP.');
      input.value = '';
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      this.thumbnail.set(undefined);
      this.thumbnailError.set("L'image ne doit pas dépasser 5 Mo.");
      input.value = '';
      return;
    }

    this.thumbnail.set(file);
    this.thumbnailError.set('');
  }

  protected removeThumbnail(input: HTMLInputElement): void {
    this.thumbnail.set(undefined);
    this.thumbnailError.set('');
    input.value = '';
  }

  protected thumbnailSize(file: File): string {
    return `${(file.size / 1024 / 1024).toFixed(1)} Mo`;
  }

  protected fieldInputType(type: string): string {
    return type === 'email' || type === 'date' ? type : 'text';
  }

  private buildAnswers(sections: NonNullable<SubmissionCallResponse['data']['form']>): SubmissionAnswer[] {
    return sections.flatMap((section) => section.fields.map((field) => this.buildAnswer(field)));
  }

  private buildAnswer(field: IField): SubmissionAnswer {
    return {
      name: field.name,
      type: field.type,
      required: field.required ?? false,
      value: '',
      options: (field.options ?? []).map((option) => ({ ...option, checked: false }))
    };
  }

  private responses(): Record<string, string | string[]> {
    return Object.fromEntries(
      this.answersModel().answers.map((answer) => [
        answer.name,
        answer.type === 'checkbox'
          ? answer.options.filter((option) => option.checked).map((option) => option.value)
          : answer.value
      ])
    );
  }
}
