import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IRemoveOrganizationDialogData } from '../../interfaces/organizations.interface';

@Component({
  selector: 'app-remove-organization-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-organization-dialog.html'
})
export class RemoveOrganizationDialog {
  protected readonly data = inject<IRemoveOrganizationDialogData>(MAT_DIALOG_DATA);
}
