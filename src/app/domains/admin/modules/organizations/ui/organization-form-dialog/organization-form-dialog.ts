import { Component, inject, signal } from '@angular/core';
import { FormField, form, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  IOrganizationDialogData,
  IOrganizationDialogResult,
  IOrganizationPayload
} from '../../interfaces/organizations.interface';

@Component({
  selector: 'app-organization-form-dialog',
  imports: [FormField, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './organization-form-dialog.html'
})
export class OrganizationFormDialog {
  protected readonly data = inject<IOrganizationDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<OrganizationFormDialog, IOrganizationDialogResult>);

  protected readonly organizationModel = signal<IOrganizationPayload>({ name: this.data.organization?.name ?? '' });
  protected readonly organizationForm = form(this.organizationModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Le nom est requis.' });
    validate(schemaPath.name, ({ value }) => {
      if (value().trim().length === 0) {
        return { kind: 'whitespace', message: 'Le nom est requis.' };
      }
      return undefined;
    });
  });

  protected onSubmit(): void {
    submit(this.organizationForm, async (formState) => {
      this.dialogRef.close({ payload: { name: formState().value().name.trim() } });
    });
  }
}
