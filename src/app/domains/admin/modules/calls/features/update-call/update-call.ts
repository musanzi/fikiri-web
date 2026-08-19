import { httpResource } from '@angular/common/http';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ICallContactInfo, ICallSolution, IForm } from '@/app/core/interfaces';
import { FormBuilder } from '@/app/shared/ui/form-builder/form-builder';
import { UpdateCallStore } from '../../data-access/update-call.store';
import { ICreateCallFormModel } from '../../interfaces/calls.interface';
import { CallContactEditor } from '../../ui/call-contact-editor/call-contact-editor';
import { CallRequirementsEditor } from '../../ui/call-requirements-editor/call-requirements-editor';

@Component({
  imports: [
    CallContactEditor,
    FormBuilder,
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
  providers: [UpdateCallStore],
  templateUrl: './update-call.html'
})
export default class UpdateCall {
  protected store = inject(UpdateCallStore);
  protected callId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  protected callResource = httpResource<{ data: ICallSolution }>(() => `/calls/${this.callId}`);

  protected callModel = linkedSignal<ICreateCallFormModel>(() => {
    const call = this.callResource.hasValue() ? this.callResource.value().data : undefined;

    return {
      name: call?.name ?? '',
      started_at: call ? new Date(call.started_at) : new Date(),
      ended_at: call ? new Date(call.ended_at) : new Date(),
      description: call?.description ?? ''
    };
  });

  protected applicationForm = linkedSignal<IForm[]>(() => {
    const form = this.callResource.hasValue() ? this.callResource.value().data.form : undefined;
    return form?.length ? form : [{ phase: 'Candidature', fields: [] }];
  });

  protected reviewForm = linkedSignal<IForm[]>(() => {
    const form = this.callResource.hasValue() ? this.callResource.value().data.review_form : undefined;
    return form?.length ? form : [{ phase: 'Évaluation', fields: [] }];
  });

  protected contactInfo = linkedSignal<ICallContactInfo>(() => {
    const contact = this.callResource.hasValue() ? this.callResource.value().data.contact_form : undefined;
    return contact ?? { name: '', role: '', email: '', phone: '', links: [] };
  });

  protected requirements = linkedSignal<{ title: string; description: string }[]>(() => {
    return this.callResource.hasValue() ? (this.callResource.value().data.requirements ?? []) : [];
  });

  protected cover = signal<File | undefined>(undefined);
  protected coverError = signal('');

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
    submit(this.callForm, async (formState) => {
      const value = formState().value();
      const payload = {
        ...value,
        form: this.applicationForm(),
        review_form: this.reviewForm(),
        contact_form: this.contactInfo(),
        requirements: this.requirements()
      } as unknown as ICallSolution;

      this.store.updateCall({ id: this.callId, payload, cover: this.cover() });
    });
  }

  protected onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.cover.set(file);
    this.coverError.set('');
  }

  protected removeCover(input: HTMLInputElement): void {
    this.cover.set(undefined);
    this.coverError.set('');
    input.value = '';
  }
}
