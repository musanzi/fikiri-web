import { Component, computed, input, InputSignal, linkedSignal } from '@angular/core';
import { applyEach, form, FormField, required, validate } from '@angular/forms/signals';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { IField, IForm, JsonValue } from '@/app/shared/interfaces';
import { IFormAnswer, IFormAnswersModel } from '../../interfaces';

@Component({
  selector: 'form-renderer',
  imports: [FormField, MatCheckboxModule, MatInputModule, MatRadioModule, MatSelectModule],
  templateUrl: './form-renderer.html'
})
export class FormRenderer {
  readonly sections: InputSignal<IForm[]> = input.required<IForm[]>();
  readonly initialResponses = input<Record<string, JsonValue>>({});

  private readonly answersModel = linkedSignal<IFormAnswersModel>(() => ({
    answers: this.sections().flatMap((section) => section.fields.map((field) => this.buildAnswer(field)))
  }));

  readonly answerForm = form(this.answersModel, (schemaPath) => {
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

  readonly invalid = computed(() => this.answerForm().invalid());

  protected readonly renderedSections = computed(() => {
    let answerIndex = 0;
    return this.sections().map((section) => ({
      phase: section.phase,
      questions: section.fields.map((field) => ({ field, answerIndex: answerIndex++ }))
    }));
  });

  responses(): Record<string, string | string[]> {
    return Object.fromEntries(
      this.answersModel().answers.map((answer) => [
        answer.name,
        answer.type === 'checkbox'
          ? answer.options.filter((option) => option.checked).map((option) => option.value)
          : answer.value
      ])
    );
  }

  protected fieldInputType(type: string): string {
    return type === 'email' || type === 'number' || type === 'date' ? type : 'text';
  }

  private buildAnswer(field: IField): IFormAnswer {
    const initialResponse = this.initialResponses()[field.name];
    const selectedOptions = Array.isArray(initialResponse)
      ? initialResponse.filter((value): value is string => typeof value === 'string')
      : [];

    return {
      name: field.name,
      type: field.type,
      required: field.required ?? false,
      value: typeof initialResponse === 'string' ? initialResponse : '',
      options: (field.options ?? []).map((option) => ({
        ...option,
        checked: selectedOptions.includes(option.value)
      }))
    };
  }
}
