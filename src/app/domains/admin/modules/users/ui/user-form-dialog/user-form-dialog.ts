import { Component, inject, signal } from '@angular/core';
import { applyEach, email, FormField, form, minLength, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IUserDialogData, IUserDialogResult, IUserPayload } from '../../interfaces/users.interface';

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './user-form-dialog.html'
})
export class UserFormDialog {
  protected readonly data = inject<IUserDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialog, IUserDialogResult>);

  protected readonly userModel = signal<IUserPayload>({
    email: this.data.user?.email ?? '',
    name: this.data.user?.name ?? '',
    phone_number: this.data.user?.phone_number ?? '',
    address: this.data.user?.address ?? '',
    organisation: this.data.user?.organization?.id ?? '',
    bio: this.data.user?.bio ?? '',
    socials: Array.isArray(this.data.user?.socials) ? this.data.user.socials : [],
    roles: this.data.user?.roles?.map((role) => role.id) ?? []
  });

  protected readonly userForm = form(this.userModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Le nom est requis.' });
    required(schemaPath.email, { message: "L'adresse e-mail est requise." });
    email(schemaPath.email, { message: "L'adresse e-mail est invalide." });
    required(schemaPath.phone_number, { message: 'Le numéro de téléphone est requis.' });
    required(schemaPath.address, { message: "L'adresse est requise." });
    minLength(schemaPath.roles, 1, { message: 'Sélectionnez au moins un rôle.' });
    applyEach(schemaPath.socials, (social) => {
      required(social.name, { message: 'Le nom du réseau est requis.' });
      required(social.link, { message: 'Le lien est requis.' });
    });
  });

  protected setOrganization(organisation: string): void {
    this.userModel.update((user) => ({ ...user, organisation }));
  }

  protected setRoles(roles: string[]): void {
    this.userModel.update((user) => ({ ...user, roles }));
  }

  protected addSocial(): void {
    this.userModel.update((user) => ({
      ...user,
      socials: [...user.socials, { name: '', link: '' }]
    }));
  }

  protected removeSocial(index: number): void {
    this.userModel.update((user) => ({
      ...user,
      socials: user.socials.filter((_, socialIndex) => socialIndex !== index)
    }));
  }

  protected onSubmit(): void {
    submit(this.userForm, async (formState) => {
      const value = formState().value();
      this.dialogRef.close({
        payload: {
          ...value,
          email: value.email.trim(),
          name: value.name.trim(),
          phone_number: value.phone_number.trim(),
          address: value.address.trim(),
          bio: value.bio.trim(),
          socials: value.socials.map((social) => ({ name: social.name.trim(), link: social.link.trim() }))
        }
      });
    });
  }
}
