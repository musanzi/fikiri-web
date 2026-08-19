import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ICallContact, ICallContactInfo, ICallSolution } from '@/app/core/interfaces';
import { FormRenderer } from '@/app/shared/ui/form-renderer/form-renderer';
import { environment } from '@/environments/environment';
import { SubmitSolutionStore } from '../../data-access/submit-solution.store';
import { ICreateSolutionPayload, ISolutionDetailsModel } from '../../interfaces/submission.interface';

@Component({
  imports: [
    DatePipe,
    FormRenderer,
    FormField,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    RouterLink
  ],
  providers: [SubmitSolutionStore],
  templateUrl: './submit-solution.html'
})
export default class SubmitSolution {
  protected store = inject(SubmitSolutionStore);
  protected formRenderer = viewChild(FormRenderer);

  protected currentCallsResource = httpResource<{ data: ICallSolution[] }>(() => '/calls/find/current');

  protected callSelectionModel = linkedSignal(() => ({
    call: this.currentCallsResource.hasValue() ? this.currentCallsResource.value().data[0].id : ''
  }));

  protected callSelectionForm = form(this.callSelectionModel, (schemaPath) => {
    required(schemaPath.call);
  });

  protected selectedCallId = computed(() => this.callSelectionModel().call);

  protected callResource = httpResource<{ data: ICallSolution }>(() => {
    const callId = this.selectedCallId();
    return callId ? `/calls/${callId}` : undefined;
  });

  protected callCoverUrl = computed(() => {
    const cover = this.callResource.hasValue() ? this.callResource.value().data.cover : null;
    return cover ? `${environment.apiUrl}/uploads/calls/covers/${cover}` : '/images/no-img.png';
  });

  protected thumbnail = signal<File | undefined>(undefined);
  protected solutionDetailsModel = signal<ISolutionDetailsModel>({
    name: '',
    description: '',
    problem_solved: ''
  });

  protected solutionDetailsForm = form(this.solutionDetailsModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.description);
    required(schemaPath.problem_solved);
  });

  protected onSubmit(): void {
    const thumbnail = this.thumbnail();
    const formRenderer = this.formRenderer();
    if (!thumbnail || !formRenderer) return;

    submit(this.callSelectionForm, async () => {
      submit(this.solutionDetailsForm, async () => {
        submit(formRenderer.answerForm, async () => {
          const payload: ICreateSolutionPayload = {
            call: this.selectedCallId(),
            ...this.solutionDetailsModel(),
            responses: formRenderer.responses()
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

    this.thumbnail.set(file);
  }

  protected removeThumbnail(input: HTMLInputElement): void {
    this.thumbnail.set(undefined);
    input.value = '';
  }

  protected thumbnailSize(file: File): string {
    return `${(file.size / 1024 / 1024).toFixed(1)} Mo`;
  }

  protected callContacts(contactInfo: ICallContactInfo): ICallContact[] {
    const primaryContact: ICallContact = {
      name: contactInfo.name,
      role: contactInfo.role,
      email: contactInfo.email,
      phone: contactInfo.phone
    };

    return [primaryContact, ...(contactInfo.contacts ?? [])].filter(
      (contact) => contact.name || contact.role || contact.email || contact.phone
    );
  }
}
