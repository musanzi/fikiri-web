import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ICallContact, ICallContactInfo, ICallSolution } from '@/app/shared/interfaces';
import { FormRenderer } from '@/app/shared/ui/form-renderer/form-renderer';
import { environment } from '@/environments/environment';
import { SubmitSolutionStore } from '../../data-access/submit-solution.store';
import { ICreateSolutionPayload, ISolutionDetailsModel } from '../../interfaces/submission.interface';
import { FormsModule } from '@angular/forms';

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
    RouterLink,
    FormsModule
  ],
  providers: [SubmitSolutionStore],
  templateUrl: './submit-solution.html'
})
export default class SubmitSolution {
  protected store = inject(SubmitSolutionStore);
  protected formRenderer = viewChild(FormRenderer);

  protected currentCallsResource = httpResource<{ data: ICallSolution[] }>(() => '/calls/find/current');

  protected selectedCallId = linkedSignal(() => {
    return this.currentCallsResource.value()?.data.at(-1)?.id ?? '';
  });
  protected thumbnail = signal<File | undefined>(undefined);
  protected solutionDetailsModel = signal<ISolutionDetailsModel>({
    name: '',
    description: '',
    problem_solved: ''
  });

  protected callResource = httpResource<{ data: ICallSolution }>(() => {
    const callId = this.selectedCallId();
    return callId ? `/calls/${callId}` : undefined;
  });

  protected callCoverUrl = computed(() => {
    const cover = this.callResource.value()?.data.cover;
    return cover ? `${environment.apiUrl}/uploads/calls/covers/${cover}` : '/images/no-img.png';
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

    if (!this.solutionDetailsForm().valid() || !formRenderer.answerForm().valid()) {
      return;
    }

    const payload: ICreateSolutionPayload = {
      call: this.selectedCallId(),
      ...this.solutionDetailsModel(),
      responses: formRenderer.responses()
    };

    this.store.submitSolution({ payload, thumbnail });
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
