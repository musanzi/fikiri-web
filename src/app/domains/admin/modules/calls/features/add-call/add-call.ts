import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { IField, IForm } from '@/app/core/interfaces';
import { AddCallStore } from '../../data-access/add-call.store';
import {
  CallContactInfo,
  CallRequirement,
  CreateCallFormModel,
  CreateCallPayload
} from '../../interfaces/calls.interface';
import { CallContactEditor } from '../../ui/call-contact-editor/call-contact-editor';
import { CallFormBuilder } from '../../ui/call-form-builder/call-form-builder';
import { CallRequirementsEditor } from '../../ui/call-requirements-editor/call-requirements-editor';

const COVER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_COVER_SIZE = 5 * 1024 * 1024;

@Component({
  imports: [
    CallContactEditor,
    CallFormBuilder,
    CallRequirementsEditor,
    FormField,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    RouterLink
  ],
  providers: [AddCallStore],
  templateUrl: './add-call.html'
})
export default class AddCall {
  protected store = inject(AddCallStore);

  protected callModel = signal<CreateCallFormModel>({
    name: '',
    ended_at: new Date(),
    started_at: new Date(),
    description: ''
  });

  protected applicationForm = signal<IForm[]>([{ phase: 'Candidature', fields: [] }]);
  protected reviewForm = signal<IForm[]>([{ phase: 'Évaluation', fields: [] }]);
  protected contactInfo = signal<CallContactInfo>({ name: '', role: '', email: '', phone: '', links: [] });
  protected requirements = signal<CallRequirement[]>([]);
  protected cover = signal<File | undefined>(undefined);
  protected coverError = signal('');

  protected configurationValid = computed(
    () =>
      [this.applicationForm(), this.reviewForm()].every((sections) => this.formBuilderValid(sections)) &&
      this.contactInfoValid(this.contactInfo()) &&
      this.requirements().every((requirement) => Boolean(requirement.title.trim()))
  );

  protected callForm = form(this.callModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Le nom est requis.' });
    minLength(schemaPath.name, 3, { message: 'Le nom doit contenir au moins 3 caractères.' });
    required(schemaPath.started_at, { message: 'La date de début est requise.' });
    required(schemaPath.ended_at, { message: 'La date de fin est requise.' });
    validate(schemaPath.ended_at, ({ value, valueOf }) =>
      value().getTime() <= valueOf(schemaPath.started_at).getTime()
        ? { kind: 'date-order', message: 'La date de fin doit être postérieure à la date de début.' }
        : undefined
    );
    required(schemaPath.description, { message: 'La description est requise.' });
    minLength(schemaPath.description, 10, {
      message: 'La description doit contenir au moins 10 caractères.'
    });
  });

  protected onSubmit(): void {
    const cover = this.cover();
    if (!cover) {
      this.coverError.set('La couverture est requise.');
      return;
    }

    submit(this.callForm, async (formState) => {
      const value = formState().value();
      const payload: CreateCallPayload = {
        name: value.name.trim(),
        started_at: value.started_at.toISOString(),
        ended_at: value.ended_at.toISOString(),
        description: value.description.trim(),
        form: this.normaliseForm(this.applicationForm()),
        review_form: this.normaliseForm(this.reviewForm()),
        contact_form: this.normaliseContactInfo(this.contactInfo()),
        requirements: this.normaliseRequirements(this.requirements())
      };

      this.store.addCall({ payload, cover });
    });
  }

  protected onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!COVER_TYPES.has(file.type)) {
      this.cover.set(undefined);
      this.coverError.set('Sélectionnez une image JPEG, PNG ou WebP.');
      input.value = '';
      return;
    }

    if (file.size > MAX_COVER_SIZE) {
      this.cover.set(undefined);
      this.coverError.set('La couverture ne doit pas dépasser 5 Mo.');
      input.value = '';
      return;
    }

    this.cover.set(file);
    this.coverError.set('');
  }

  protected removeCover(input: HTMLInputElement): void {
    this.cover.set(undefined);
    this.coverError.set('');
    input.value = '';
  }

  protected coverSize(file: File): string {
    return `${(file.size / 1024 / 1024).toFixed(1)} Mo`;
  }

  private hasOptions(field: IField): boolean {
    return ['select', 'radio', 'checkbox'].includes(field.type);
  }

  private formBuilderValid(sections: IForm[]): boolean {
    return sections.every(
      (section) =>
        Boolean(section.phase.trim()) &&
        section.fields.every(
          (field) =>
            Boolean(field.label.trim() && field.name.trim()) &&
            (!this.hasOptions(field) ||
              Boolean(field.options?.length && field.options.every((option) => option.label.trim())))
        )
    );
  }

  private contactInfoValid(contact: CallContactInfo): boolean {
    const hasPerson = Boolean(
      contact.name.trim() || contact.role.trim() || contact.email.trim() || contact.phone.trim()
    );
    const personValid = !hasPerson || Boolean(contact.name.trim() && (contact.email.trim() || contact.phone.trim()));
    const linksValid = contact.links.every((link) => Boolean(link.label.trim() && link.url.trim()));
    return personValid && linksValid;
  }

  private normaliseForm(sections: IForm[]): IForm[] | undefined {
    const hasQuestions = sections.some((section) => section.fields.length > 0);
    if (!hasQuestions) {
      return undefined;
    }

    return sections
      .filter((section) => section.fields.length > 0)
      .map((section) => ({
        phase: section.phase.trim(),
        fields: section.fields.map((field) => ({
          ...field,
          name: field.name.trim(),
          label: field.label.trim(),
          options: field.options?.map((option) => ({
            label: option.label.trim(),
            value: option.value
          }))
        }))
      }));
  }

  private normaliseContactInfo(contact: CallContactInfo): CallContactInfo | undefined {
    const hasContent = Boolean(
      contact.name.trim() || contact.role.trim() || contact.email.trim() || contact.phone.trim() || contact.links.length
    );
    if (!hasContent) {
      return undefined;
    }

    return {
      name: contact.name.trim(),
      role: contact.role.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      links: contact.links.map((link) => ({ label: link.label.trim(), url: link.url.trim() }))
    };
  }

  private normaliseRequirements(requirements: CallRequirement[]): CallRequirement[] | undefined {
    return requirements.length
      ? requirements.map((requirement) => ({
          title: requirement.title.trim(),
          description: requirement.description.trim()
        }))
      : undefined;
  }
}
