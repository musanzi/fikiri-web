import { Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ICallContactInfo, ICallRequirement, IForm } from '@/app/shared/interfaces';
import { Message } from '@/app/shared/ui/message/message';
import { FormBuilder } from '@/app/shared/ui/form-builder/form-builder';
import { AddCallStore } from '../../data-access/add-call.store';
import { ICreateCallFormModel, ICreateCallPayload } from '../../interfaces/calls.interface';
import { CallContactEditor } from '../../ui/call-contact-editor/call-contact-editor';
import { CallRequirementsEditor } from '../../ui/call-requirements-editor/call-requirements-editor';

@Component({
  imports: [
    CallContactEditor,
    FormBuilder,
    CallRequirementsEditor,
    FormField,
    Message,
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

  protected callModel = signal<ICreateCallFormModel>({
    name: '',
    ended_at: new Date(),
    started_at: new Date(),
    description: ''
  });

  protected applicationForm = signal<IForm[]>([{ phase: 'Candidature', fields: [] }]);
  protected reviewForm = signal<IForm[]>([{ phase: 'Évaluation', fields: [] }]);
  protected contactInfo = signal<ICallContactInfo>({ name: '', role: '', email: '', phone: '', links: [] });
  protected requirements = signal<ICallRequirement[]>([]);
  protected cover = signal<File | undefined>(undefined);

  protected callForm = form(this.callModel, (schemaPath) => {
    required(schemaPath.name);
    minLength(schemaPath.name, 3);
    required(schemaPath.started_at);
    required(schemaPath.ended_at);
    validate(schemaPath.ended_at, ({ value, valueOf }) =>
      value().getTime() <= valueOf(schemaPath.started_at).getTime() ? { kind: 'date-order' } : undefined
    );
    required(schemaPath.description);
    minLength(schemaPath.description, 10);
  });

  protected onSubmit(): void {
    const cover = this.cover();
    if (!cover) {
      return;
    }

    submit(this.callForm, async (formState) => {
      const value = formState().value();
      const payload: ICreateCallPayload = {
        ...value,
        form: this.applicationForm(),
        review_form: this.reviewForm(),
        contact_form: this.contactInfo(),
        requirements: this.requirements()
      };

      this.store.addCall({ payload, cover });
    });
  }

  protected onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.cover.set(file);
  }

  protected removeCover(input: HTMLInputElement): void {
    this.cover.set(undefined);
    input.value = '';
  }
}
